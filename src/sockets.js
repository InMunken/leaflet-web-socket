class Sesion {
    constructor(token, data) {
        this.token = token;
        this.data = data;
        this.date = new Date;
    }

}

let Usuarios =
    [

    ];

let Dibujos =
    [

    ]

let Sesiones =
{

}

module.exports = io => {
    io.on('connection', (socket) => {
        //manejo de sesión:
        let session = JSON.parse(socket.handshake.query.session); //de acá saco el objeto que repersenta la sesión

        console.log("usuario conectado con token: ", session.id);




        if (!Sesiones[session.id]) {
            Sesiones[session.id] = {
                sockets: [],
                data: session.data
            };
        }

        Sesiones[session.id].sockets.push(socket);

        // Unir el socket a la sala con el mismo id de la sesión
        socket.join(session.id, () => {
            let rooms = Object.keys(socket.rooms);
            console.log(rooms); // [socket.id, session.id]
        });
        

        //infotmación del socket
        let userinformation = socket.request.connection.remoteAddress

        console.log("alguien se conectó!: ", userinformation)
        socket.on('disconnect', () => {
            console.log("alguien se desconectó! :( : ", userinformation)
        });

        //Envío de información recolectada durante la sesión
        io.to(session.id).emit('ingreso-u', Usuarios)
        io.to(session.id).emit('ingreso-d', Dibujos) 



        //manejo de evetos de ubicación
        socket.on('usuarioActualizado', data => {
            io.to(session.id).emit('usuarioConectado', { nombre: data.nombre, latlng: data.latlng })
            Usuarios.push(data);
            console.log("Lista de usuarios: \n", Usuarios)
        });


        //manejo de dubujos
        socket.on('nuevoDibujo', data => {
            console.log("dibujo recibido");
            console.log("make a console log");
            console.log(data)

            Dibujos.push(data)

            console.log("Lista de dibujos: \n", Dibujos)
            console.log("enviando al token", session.id)

            io.to(session.id).emit('dibujoDeUser', data);
        });

    });

}