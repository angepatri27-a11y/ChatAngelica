module.exports = function (io) {
    let users = {}; 
 // Cuando alguien se conecta
    io.on('connection', socket => {
        // Registro de  nuevos usuarios
        socket.on('nuevo usuario', (data, cb) => {                                                             //Escucha cuando alguien escribe su nombre y le da a "Entrar".
            if (!data || data.trim() === '') return cb(false);                                                //Si el nombre está vacío, le dice al navegador "error" (false).
            let cleanName = data.trim();
            if (cleanName in users) {                                                                       //Revisa si el nombre ya existe en el objeto users. Si alguien más se llama igual, no lo deja entrar.
                cb(false);
            } else {                                                                                        //Si el nombre es nuevo:
                cb(true);
                socket.nickname = cleanName;                                                                 //Asigna el nombre al socket.
                users[socket.nickname] = socket;                                                             //Guarda la conexión completa en nuestra lista de usuarios.
                updateNicknames();                                                                          //Actualiza la lista de usuarios. Llama a la función para avisar a todos que la lista de conectados cambió.
            }
        });

        socket.on("Enviar mensaje", function (data, cb) {                                                   //Escucha cuando alguien escribe un mensaje. O escucha cuando alguien escribe algo en el chat y presiona Enter.
            let msg = data.trim();
            if (msg.substr(0, 3) === '/w ') {                                                               //Si el mensaje comienza con /w, es un mensaje privado.
                msg = msg.substr(3);
                const index = msg.indexOf(' ');                                                             //Busca el espacio después del nombre para separar el nombre del mensaje.
                if (index !== -1) {
                    var name = msg.substring(0, index);                                                     //Extrae el nombre del usuario.
                    var msgContent = msg.substring(index + 1);                                              //Extrae el contenido del mensaje.
                    if (name in users) {                                                                     //Revisa si el destinatario está conectado.
                        users[name].emit('whisper', { msg: msgContent, nick: socket.nickname });        //Le envía el mensaje solo al destinatario.
                        socket.emit('whisper', { msg: msgContent, nick: socket.nickname });       //Te envía el mensaje a ti mismo para que veas lo que escribiste en tu pantalla.
                    } else {
                        cb('Error: El usuario no existe.');
                    }
                } else {
                    cb('Error: Usa /w nombre mensaje');
                }
            } else {
                io.sockets.emit('Nuevo mensaje', { msg: data, nick: socket.nickname });                    //Envía el mensaje a absolutamente todos los conectados.
            }
        });

        socket.on('disconnect', data => {                                       //Se activa automáticamente cuando alguien cierra la pestaña o pierde internet.
            if (!socket.nickname) return;
            delete users[socket.nickname];                                       //Borra al usuario de nuestra lista para que el nombre quede libre otra vez.
            updateNicknames();                                                               //Actualiza la lista de conectados para los que se quedaron.
        });

        function updateNicknames() {                                                                       //Esta función emite un evento llamado usernames.
            io.sockets.emit('usernames', Object.keys(users));         //Toma nuestra lista de usuarios y extrae solo los nombres para enviárselos a todos y que la lista lateral de la página se actualice.
        }
    });
};