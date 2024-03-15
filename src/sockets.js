let Usuarios = [];

let Dibujos = {};

module.exports = (io) => {
  io.on("connection", (socket) => {
    //session management
    let session = JSON.parse(socket.handshake.query.session); 
    console.log("usuario conectado con token: ", session.id);

    if (!Dibujos[session.id]) {
      Dibujos[session.id] = {
        data: session.data,
      };
    }


    // Unir el socket a la sala con el mismo id de la sesión
    socket.join(session.id, () => {
      let rooms = Object.keys(socket.rooms);
      console.log(rooms); // [socket.id, session.id]
    });


    console.log("alguien se conectó!");

    socket.on("disconnect", () => {
      console.log("alguien se desconectó! :( \n");
    });

    //Envío de información recolectada durante la sesión
    socket.emit("ingreso-u", Usuarios);
    console.log(Dibujos[session.id]);
    socket.emit("ingreso-d", Dibujos[session.id]);

    //manejo de evetos de ubicación
    socket.on("usuarioActualizado", (data) => {
      io.to(session.id).emit("usuarioConectado", {
        nombre: data.nombre,
        latlng: data.latlng,
      });
      Usuarios.push(data);
      console.log("Lista de usuarios: \n", Usuarios);
    });

    //manejo de dibujos
    socket.on("nuevoDibujo", (data) => {
      console.log("dibujo recibido");
      console.log("make a console log");
      console.log(data);

      if (!Dibujos[session.id]) {
        Dibujos[session.id] = [];
      }

      Dibujos[session.id].data.push(data);

      console.log("Lista de dibujos: \n", Dibujos);
      console.log("enviando al token", session.id);

      socket.broadcast.to(session.id).emit("dibujoDeUser", data);
    });
  });
};
