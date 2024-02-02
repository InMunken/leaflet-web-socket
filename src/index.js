const express = require('express');
const engine = require('ejs-mate');
const path = require('path');
const socketIO = require('socket.io');
const http = require('http');

//inicialisaciones
const app = express();
const server = http.createServer(app);
const io = socketIO(server)

//settings
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));    

//rutas
app.use(require('./routes/'))

//sockets
require('./sockets/')(io);


//static files
app.use(express.static(path.join(__dirname, 'public')));

//starting the server
server.listen(3001, () => {
    console.log('Servidor en el puerto 3001')
})