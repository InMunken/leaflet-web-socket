let Usuarios = 
[
    { nombre: 'prueba', latlng: { lat: -34.5719940, lng: -58.5398390 } },
    { nombre: '', latlng: { lat: -34.6237603, lng: -58.8415188 } }
];

module.exports = io => {
    io.on('connection', (socket) => {
        let userinformation = socket.request.connection.remoteAddress
        console.log("alguien se conectó!: ", userinformation)

        socket.emit('ingreso', Usuarios)
            
        socket.on('disconnect', () => {
            console.log("alguien se desconectó! :( : ", userinformation)
        });

        socket.on('nuevoDibujo', data =>{
            console.log("dibujo recibido");
            console.log("make a console log");
            console.log(data.layerType)
            socket.broadcast.emit('dibujoDeUser', data);
        });
        
        socket.on('usuarioActualizado', data => {
            io.emit('usuarioConectado', {nombre: data.nombre, latlng: data.latlng})
            Usuarios.push(data);
            console.log(Usuarios)
        });
    });

}