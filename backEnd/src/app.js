const express = require("express");
const {createServer} = require("node:http");
const cors = require("cors");

const path = require("path");
require("dotenv").config();

const {connectToSocket} = require('./controllers/socketManager');
const app = express();
const server = createServer(app);
const socketIO = connectToSocket(server);

const userRoutes = require("./expressRoutes/user");
const {dispError} = require("./config/middleware");

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://peer-link-frontenddep.onrender.com"
    ],
    credentials: true
}));
app.use(express.urlencoded({extended : true}));     //To parse data of an id

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hey FrontEnd!!!");
});

// User things
app.use("/user", userRoutes);

// Display errors
app.use(dispError);

// Starting the server
const port = process.env.PORT || 8080;
const {configDB} = require("./config/db");
const startServer = async () => {
    try {
        await configDB();           // First connect Database
        
        server.listen(port, () => {
            console.log(`server is listening to port ${port}`);
        });
    } catch (err) {
        console.error("Failed to start server:", err);
    }
};

startServer();