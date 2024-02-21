let Usuarios = 
[
    
];


let Dibujos =
[

]

module.exports = io => {
    io.on('connection', (socket) => {
        //infotmación del socket
        let userinformation = socket.request.connection.remoteAddress
        
        console.log("alguien se conectó!: ", userinformation)
        socket.on('disconnect', () => {
            console.log("alguien se desconectó! :( : ", userinformation)
        });
        
        //Envío de información recolectada durante la sesión
        socket.emit('ingreso-u', Usuarios)
        socket.emit('ingreso-d', Dibujos)
        
    
        
        //manejo de evetos de ubicación
        socket.on('usuarioActualizado', data => {
            io.emit('usuarioConectado', {nombre: data.nombre, latlng: data.latlng})
            Usuarios.push(data);
            console.log("Lista de usuarios: \n", Usuarios)
        });


        //manejo de dubujos
        socket.on('nuevoDibujo', data =>{
            console.log("dibujo recibido");
            console.log("make a console log");
            console.log(data)

            Dibujos.push(data)

            console.log("Lista de dibujos: \n", Dibujos)
            socket.broadcast.emit('dibujoDeUser', data);
        });
        
    });

}