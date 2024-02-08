let Usuarios = 
[
    { nombre: 'prueba', latlng: { lat: -34.5719940, lng: -58.5398390 } }
];

module.exports = io => {
    io.on('connection', (socket) => {
        let userinformation = socket.request.connection.remoteAddress
        console.log("alguien se conectó!: ", userinformation)
            
        socket.on('disconnect', () => {
            console.log("alguien se desconectó! :( : ", userinformation)
        })
        
        socket.on('usuarioActualizado', data => {
            Usuarios.push(data);
            io.emit('usuarioConectado', Usuarios)
            console.log(Usuarios)
        });
    });

}