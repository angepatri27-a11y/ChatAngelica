const http = require("http");                                      //Importa el módulo nativo de Node.js para crear servidores web. Aunque Express lo hace solo, Socket.io necesita este módulo directamente para engancharse a la conexión.
const path = require('path');                                       //Importa una herramienta para manejar rutas de carpetas y archivos de forma segura, sin importar si usas Windows o Linux.
const express = require("express");                               //Importa Express, el marco de trabajo (framework) que facilita la creación de rutas y el manejo de peticiones web.
const socketio = require('socket.io');                              //Importa la librería que permite la comunicación bidireccional (tiempo real) entre el servidor y los usuarios.

const app = express();                                           //Crea una instancia de Express. Aquí es donde definirás qué carpetas o rutas verá el usuario.
const server = http.createServer(app);                            //Crea el servidor físico usando el módulo http, pero le dice que todas las reglas de navegación las maneje la aplicación app de Express.
const io = socketio(server);                                    //Conecta Socket.io al servidor que acabamos de crear. A partir de aquí, el servidor puede "escuchar" y "hablar" con los clientes en vivo.

const PORT = process.env.PORT || 3000;                  //Define el puerto donde funcionará el chat. Si el servicio de internet donde lo subas te da uno (process.env.PORT), lo usa; si no, usa el puerto 3000 por defecto.

app.use(express.static(path.join(__dirname, 'public')));   //Le dice al servidor que todos los archivos que están en la carpeta llamada public (como el HTML, CSS y el JavaScript del cliente) deben ser accesibles para cualquier persona que entre a la web

require('./sockets')(io); //Esta línea busca el archivo sockets.js (el código que analizamos anteriormente) y le pasa el objeto io. Básicamente, le entrega el "megáfono" al otro archivo para que sepa cómo repartir los mensajes.

server.listen(PORT, () => {   //¡La línea final! Pone a funcionar el servidor en el puerto definido.
    console.log("Servidor en el puerto", PORT);  //Imprime un mensaje en la consola para confirmarte que todo salió bien y el chat ya está en línea.
});