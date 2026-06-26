const { Server } = require("socket.io");

let connections = {};       // Kitne Log
let messages = {};          // Chats during meet
let timeOnline = {};        

module.exports.connectToSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: [
            "http://localhost:5173",
            "http://localhost:5174",
            "https://peer-link-frontenddep.onrender.com"
        ],
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {       // Whenever a connection comes
        console.log("Connection Established with Socket from FrontEnd");
        
        socket.on("join-meet", (path) => {
            if (connections[path] === undefined) {
                connections[path] = [];         // Create Room if dne
            }

            connections[path].push(socket.id);          // Socket.id is current live connection id of user
            timeOnline[socket.id] = new Date();

            connections[path].forEach(elem => {
                io.to(elem).emit("User Joined", socket.id, connections[path]);
            });            
            if (messages[path] !== undefined) {
                messages[path].forEach(elem => {
                    io.to(socket.id).emit("chat-message", elem.data, 
                        elem.sender, elem['sender-socket-id']);
                });
            }
        });

        socket.on("signal", (toId, message) => {
            io.to(toId).emit("signal", socket.id, message);
            console.log("SIGNAL");
            console.log(socket.id, "---->", toId);
        });

        socket.on("chat-message", (data, sender) => {
            const [matchingRoom, userFound] = Object.entries(connections)
                .reduce(([room, isFound], [roomKey, roomVal]) => {

                    if (!isFound && roomVal.includes(socket.id)) {
                        return [roomKey, true];
                    }
                    return [room, isFound];
                }, ['', false]);

            if (userFound) {
                if (messages[matchingRoom] === undefined) {
                    messages[matchingRoom] = [];
                }

                messages[matchingRoom].push({
                    data,
                    sender,
                    'sender-socket-id': socket.id
                });

                connections[matchingRoom].forEach(elem => {
                    io.to(elem).emit("chat-message", data, sender, socket.id);
                });
            }
        });

        socket.on("disconnect", () => {
            const [matchingRoom, userFound] = Object.entries(connections)
            .reduce(([room, isFound], [roomKey, roomVal]) => {

                    if (!isFound && roomVal.includes(socket.id)) {
                        return [roomKey, true];
                    }

                    return [room, isFound];
                }, ['', false]);

            if (userFound) {
                const diffTime = Math.abs(
                    timeOnline[socket.id] - new Date()
                );

                connections[matchingRoom].forEach(elem => {
                    io.to(elem).emit(
                        "user-left",
                        socket.id
                    );
                });
                connections[matchingRoom] = connections[matchingRoom]
                .filter(id => id !== socket.id);

                if (connections[matchingRoom].length === 0) {
                    delete connections[matchingRoom];               // If room is empty drop it
                }

                delete timeOnline[socket.id];
                console.log(`Call disconnected by ${socket.id}`);
            }
        });
    });

    return io;
};