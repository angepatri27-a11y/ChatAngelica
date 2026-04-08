const http = require("http");
const path = require('path');
const express = require("express");
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

require('./sockets')(io);

server.listen(PORT, () => {
    console.log("Servidor en el puerto", PORT);
});