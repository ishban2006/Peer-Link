const { Server } = require("socket.io");

module.exports.connectToSocket = (server) => {
    return new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"]
        }
    });
};