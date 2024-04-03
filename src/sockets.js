module.exports = (io) => {

  io.on("connection", (socket) => {

    console.log("alguien se conectó!");

    socket.on("disconnect", () => {
      console.log("alguien se desconectó! :( \n");
    });

    //manejo de dibujos
    socket.on("nuevoDibujo", (data) => {
      console.log("dibujo recibido");
      console.log(data);

      socket.broadcast.emit("dibujoDeUser", data);
    });

  });
};
