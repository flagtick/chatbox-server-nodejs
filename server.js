const express = require("./config/express.js");
const Logger = require('./utils/logger');
const mongoose = require('./config/mongoose');
const app = express.init();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

server.listen(3000, () => {
    Logger.info('Server started on port 3000');
});

app.get("/", (req, res) => {
    res.send("<h1>Your server has start from deployment!!</h1>");
});

app.disable('etag');

/** Socket.io */
io.of("/api/socket").on("connection", (socket) => {
    Logger.info("socket.io: Connection established successfully: ", socket.id);
  
    socket.on("disconnect", () => {
        Logger.info("socket.io: Connection lose!: ", socket.id);
    });
});

const connection = mongoose.connection;

const collections = mongoose.connection.collections;
Promise.all(Object.values(collections).map(async (collection) => {
    await collection.deleteMany({}); 
}));

connection.once("open", async () => {
    const messageCollectionStream = connection.collection("messages").watch();
    const coll = connection.collection("messages");
    let listMessages = [];
    messageCollectionStream.on("change", async (change) => {
        switch (change.operationType) {
          case "insert":
            const cursor = coll.find();
            await cursor.forEach( (cursor) => {
                listMessages.push(cursor);
            });
            Logger.info(listMessages);
            io.of("/api/socket").emit("technical-issue", listMessages);
            listMessages = [];
            break;
          case "delete":
            break;
        }
    });
});

