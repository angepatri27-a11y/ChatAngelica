module.exports = function (io) {
    let users = {}; 

    io.on('connection', socket => {
        socket.on('nuevo usuario', (data, cb) => {
            if (!data || data.trim() === '') return cb(false);
            let cleanName = data.trim();
            if (cleanName in users) {
                cb(false);
            } else {
                cb(true);
                socket.nickname = cleanName;
                users[socket.nickname] = socket;
                updateNicknames();
            }
        });

        socket.on("Enviar mensaje", function (data, cb) {
            let msg = data.trim();
            if (msg.substr(0, 3) === '/w ') {
                msg = msg.substr(3);
                const index = msg.indexOf(' ');
                if (index !== -1) {
                    var name = msg.substring(0, index);
                    var msgContent = msg.substring(index + 1);
                    if (name in users) {
                        users[name].emit('whisper', { msg: msgContent, nick: socket.nickname });
                        socket.emit('whisper', { msg: msgContent, nick: socket.nickname });
                    } else {
                        cb('Error: El usuario no existe.');
                    }
                } else {
                    cb('Error: Usa /w nombre mensaje');
                }
            } else {
                io.sockets.emit('Nuevo mensaje', { msg: data, nick: socket.nickname });
            }
        });

        socket.on('disconnect', data => {
            if (!socket.nickname) return;
            delete users[socket.nickname];
            updateNicknames();
        });

        function updateNicknames() {
            io.sockets.emit('usernames', Object.keys(users));
        }
    });
};