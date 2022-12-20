const express = require("./config/express.js"),
    mongoose = require("mongoose");

const app = express.init();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

server.listen(3000, () => {
    console.log('Server started on port 3000');
});

/** Socket.io */
io.of("/api/socket").on("connection", (socket) => {
    console.log("socket.io: Connection established successfully: ", socket.id);
  
    socket.on("disconnect", () => {
      console.log("socket.io: Connection lose!: ", socket.id);
    });

    // socket.on('technical-issue', (msg) => {
    //   console.log('message: ' + msg);
    // });
});

/** Connect MongoDB from Node.js application */
mongoose.set('strictQuery', false);
mongoose.connect('mongodb+srv://flagtick:YvwSHeSJL0rVYpJN@cluster0.rlpe6rz.mongodb.net/chatbox?retryWrites=true&w=majority', {
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});

const connection = mongoose.connection;

connection.once("open", () => {

    const messageCollectionStream = connection.collection("messages").watch();
    messageCollectionStream.on("change", (change) => {
        switch (change.operationType) {
          case "insert":
            console.log(change.operationType);
            io.of("/api/socket").emit("technical-issue", 'Your problem will be solving. Please wait for a moment!');
            break;
          case "delete":
            break;
        }
    });

});

