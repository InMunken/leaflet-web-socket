const uuidv4 = require('uuid').v4;

class Session {
    constructor(id, data = {}) {
        this.id = id;
        this.data = data;
        this.timestamp = new Date();
    }

    generateToken() {
        return uuidv4();
    }
}

const sessions = new Map();

io.on('connection', (socket) => {
    let token = socket.handshake.query.token;

    if (token) {
        let session = sessions.get(token);

        if (session) {
            socket.session = session;
        } else {
            let newSession = new Session(token);
            sessions.set(token, newSession);
            socket.session = newSession;
        }
    } else {
        let newToken = new Session().generateToken();
        let newSession = new Session(newToken);
        sessions.set(newToken, newSession);
        socket.session = newSession;
    }
});

function joinSession(token) {
    let session = sessions.get(token);

    if (session) {
        socket.session = session;
    } else {
        console.log("Invalid token. No session found.");
    }
}