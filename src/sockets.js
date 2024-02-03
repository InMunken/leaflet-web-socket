module.exports = io => {
    io.on('connection', (socket) => {
        console.log("alguien se conectó!")

        socket.on('coordinadasUsuario', coords => {
            socket.broadcast.emit('usuarioConectado', coords)
        });
    });
}