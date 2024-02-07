module.exports = io => {
    io.on('connection', (socket) => {
        let userinformation = socket.request.connection.remoteAddress

        console.log("alguien se conectó!: ", userinformation)

        socket.on('disconnect', () => {
            console.log("alguien se desconectó! :( : ", userinformation)
        })

        // socket.on('coordinadasUsuario', coords => {
        //     socket.broadcast.emit('usuarioConectado', coords, userinformation)
        // });
        
        socket.on('usuarioActualizado', (coords, usuario) => {
            socket.broadcast.emit('usuarioConectado', coords, usuario)
        })

    });

}