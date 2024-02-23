// session.js

class Session {
    constructor(id, data) {
      this.id = id;
      this.data = data;
      this.timestamp = new Date();
    }
  }
  
  const sessions = {};
  
  function generateToken() {
    // Implementa la lógica para generar un token único
    return "token-aleatorio";
  }
  
  function joinSession(token) {
    const session = sessions[token];
    if (session) {
      // Asocia el socket del cliente a la sesión
      // ...
    } else {
      // La sesión no existe
      // ...
    }
  }
  
  // app.js
  
  const app = express();
  const server = http.createServer(app);
  const io = require("socket.io")(server);
  
  io.on("connection", (socket) => {
    const token = socket.handshake.query.token;
    if (token) {
      joinSession(token);
    } else {
      // Crea una nueva sesión
      const session = new Session(generateToken(), {});
      sessions[session.id] = session;
      // Asocia el socket del cliente a la nueva sesión
      // ...
    }
  });
  
  server.listen(3000);