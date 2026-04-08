$(function(){
    const socket = io();
    const $messageForm = $('#message-form'), $messageBox = $('#message'), $chat = $('#chat');
    const $nickForm = $('#nickForm'), $nickError = $('#nickError'), $nickname = $('#nickname'), $users = $('#usernames');
    let myNickname = '';

    $nickForm.submit( e => {
        e.preventDefault();
        const nick = $nickname.val().trim();
        socket.emit('nuevo usuario', nick, data => {
            if(data){
                myNickname = nick;
                // ESTA LÍNEA ES LA QUE QUITA EL "DISPLAY: NONE" DEL CSS
                $('#nickWrap').hide();
                $('#contentWrap').show();
            } else {
                $nickError.html('<div class="alert alert-danger">El nombre ya existe.</div>');
            }
            $nickname.val('');
        });
    });

    $messageForm.submit( e => {
        e.preventDefault();
        socket.emit('Enviar mensaje', $messageBox.val(), data => {
            $chat.append(`<p style="color:red"><em>${data}</em></p>`);
        });
        $messageBox.val('');
    });

    socket.on('Nuevo mensaje', data => {
        $chat.append(`<div><b>${data.nick}:</b> ${data.msg}</div>`);
        $chat.scrollTop($chat[0].scrollHeight);
    });

    socket.on('whisper', data => {
        $chat.append(`<div style="color:gray; font-style:italic"><b>${data.nick} (privado):</b> ${data.msg}</div>`);
        $chat.scrollTop($chat[0].scrollHeight);
    });

    socket.on('usernames', data => {
        let html = '';
        for(let i = 0; i < data.length; i++) {
            html += `<p><i class="fas fa-user"></i> ${data[i]}</p>`;
        }
        $users.html(html);
    });
});