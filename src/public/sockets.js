

module.exports =  io => {
    io.on('connection', (socket) => {
        console.log("alguien se conectó!")
    });
}