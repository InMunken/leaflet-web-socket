module.exports = io => {
    io.on('connection', (socket) => {
        let userinformation = socket.request.connection.remoteAddress

        console.log("alguien se conectó!: ", userinformation)

        socket.on('disconnect', () => {
            console.log("alguien se desconectó! :( : ", userinformation)
        })
        
        socket.on('usuarioActualizado', data => {
            socket.broadcast.emit('usuarioConectado', {nombre: data.nombre, latlng: data.latlng})
        });

    });

}