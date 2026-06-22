const express = require("express");
const {createServer} = require("node:http");
const cors = require("cors");

const path = require("path");
require("dotenv").config();

const {connectToSocket} = require('./controllers/socketManager');
const app = express();
const server = createServer(app);
const socketIO = connectToSocket(server);

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.urlencoded({extended : true}));     //To parse data of an id

app.use(express.json());

app.get("/home", (req, res) => {
    res.send("Hey FrontEnd!!!");
});


// Starting the server
const port = process.env.PORT;
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