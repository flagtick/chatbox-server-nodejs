const express = require("./config/express.js"),
    mongoose = require("mongoose");
const Logger = require('./utils/logger');

const app = express.init();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

server.listen(3000, () => {
    Logger.info('Server started on port 3000');
});

app.get("/", (req, res) => {
    res.send("<h1>Your server has start from deployment!!</h1>");
});

/** Socket.io */
io.of("/api/socket").on("connection", (socket) => {
    Logger.info("socket.io: Connection established successfully: ", socket.id);
  
    socket.on("disconnect", () => {
        Logger.info("socket.io: Connection lose!: ", socket.id);
    });
});

/** Connect MongoDB from Node.js application */
mongoose.set('strictQuery', false);
mongoose.connect('mongodb+srv://flagtick:YvwSHeSJL0rVYpJN@cluster0.rlpe6rz.mongodb.net/chatbox?retryWrites=true&w=majority', {
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});

const connection = mongoose.connection;

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

