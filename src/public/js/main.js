$(function(){                          //Indica que el código se ejecutará solo cuando toda la página HTML haya terminado de cargar.
    const socket = io();         //Abre la conexión de tiempo real con el servidor.
    const $messageForm = $('#message-form'), $messageBox = $('#message'), $chat = $('#chat');       //Aquí se crean "atajos" a los elementos del HTML (el formulario de mensajes, la caja de texto, el área de chat, etc.) usando sus IDs.
    const $nickForm = $('#nickForm'), $nickError = $('#nickError'), $nickname = $('#nickname'), $users = $('#usernames');  //Una variable para guardar el nombre que el usuario elija.
    let myNickname = '';

    $nickForm.submit( e => {
        e.preventDefault();   //Evita que la página se recargue al enviar el formulario.
        const nick = $nickname.val().trim();   //Captura el nombre escrito y le quita espacios vacíos.
        socket.emit('nuevo usuario', nick, data => {   //Envía el nombre al servidor. El servidor responde con true o false (representado aquí por data).
            if(data){
                myNickname = nick;
                // ESTA LÍNEA ES LA QUE QUITA EL "DISPLAY: NONE" DEL CSS
                $('#nickWrap').hide();         //Esconde la pantalla de inicio de sesión.
                $('#contentWrap').show();  //Muestra la pantalla del chat.
            } else {
                $nickError.html('<div class="alert alert-danger">El nombre ya existe.</div>');
            }
            $nickname.val('');
        });
    });

    $messageForm.submit( e => {
        e.preventDefault();
        socket.emit('Enviar mensaje', $messageBox.val(), data => {           // Envía el texto escrito al servidor.
            $chat.append(`<p style="color:red"><em>${data}</em></p>`);  //Si el servidor devuelve un error (por ejemplo, si usaste mal el comando /w), se imprime ese error en color rojo solo para ti.
        });
        $messageBox.val('');   //Limpia la caja de texto para que puedas escribir el siguiente mensaje.
    });

    socket.on('Nuevo mensaje', data => {          //Escucha cuando el servidor anuncia un mensaje público.
        $chat.append(`<div><b>${data.nick}:</b> ${data.msg}</div>`);  //Agrega el mensaje al final del chat con el nombre del autor en negrita.
        $chat.scrollTop($chat[0].scrollHeight);   //Mueve automáticamente el scroll hacia abajo para que siempre veas el último mensaje.
    });

    socket.on('whisper', data => {           //Escucha cuando alguien te envía un mensaje privado. Se muestra de forma diferente (en gris y cursiva) para que sepas que es secreto.
        $chat.append(`<div style="color:gray; font-style:italic"><b>${data.nick} (privado):</b> ${data.msg}</div>`);
        $chat.scrollTop($chat[0].scrollHeight);
    });

    socket.on('usernames', data => {         //Escucha la lista actualizada de personas conectadas que envía el servidor.
        let html = '';
        for(let i = 0; i < data.length; i++) {          //Recorre la lista de nombres y genera el código HTML necesario (con un icono de usuario) para mostrar quiénes están en el chat.
            html += `<p><i class="fas fa-user"></i> ${data[i]}</p>`;
        }
        $users.html(html);
    });
});