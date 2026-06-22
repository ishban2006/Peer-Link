const express = require("express");
const app = express();

const {configDB} = require("./config/db");

app.get("/", (req, res) => {
    res.send("Starting");
});

//Starting the server only after DB connection
const startServer = async () => {
    try {
        await configDB();
        
        app.listen(8080, () => {
            console.log("server is listening to port 8080");
        });
    } catch (err) {
        console.error("Failed to start server:", err);
    }
};

startServer();