const express = require("./config/express.js");
const Logger = require('./utils/logger');
const mongoose = require('./config/mongoose');
const app = express.init();

const http = require('http');
const fs = require('fs');
const server = http.createServer({},app);

const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }, 
    path: '/api/socket'});

/**
 * Custom specific endpoint to socket client listen : path /api/socket
 * Remove websoket from client to avoid BLOCK HTTPS
 * Install SSL Signed certificate to server
 * Add cors: origin: '*' resolve bug: https://localhost:3000/api/socket/?EIO=4&transport=polling upon client request
 * Concern: 
 * - Need to install SSL to Apache2 and configur proxy_http to https. (YES, NO)
 * - CDN support mask HTTPS instead of configure ssl in Apache2 (YES, NO)
 * - SSL Signed in Node.js need (YES, NO) YES
 */
 io.on('connection', function (socket) {
    Logger.info('Welcome to server chat');
    socket.on('technical-issue', function (data) {
        io.sockets.emit('technical-issue', data);
    });
});

app.get("/", (req, res) => {
    res.send("<h1>Your server has start from deployment!!</h1>");
});

app.disable('etag');

server.listen(3000, () => {
    Logger.info('Server started on port 3000');
});


/** Socket.io */
// io.of("/api/socket").on("connection", (socket) => {
//     Logger.info("socket.io: Connection established successfully: ", socket.id);
  
//     socket.on("disconnect", () => {
//         Logger.info("socket.io: Connection lose!: ", socket.id);
//     });
// });

// const connection = mongoose.connection;

// const collections = mongoose.connection.collections;
// Promise.all(Object.values(collections).map(async (collection) => {
//     await collection.deleteMany({}); 
// }));

// connection.once("open", async () => {
//     const messageCollectionStream = connection.collection("messages").watch();
//     const coll = connection.collection("messages");
//     let listMessages = [];
//     messageCollectionStream.on("change", async (change) => {
//         switch (change.operationType) {
//           case "insert":
//             const cursor = coll.find();
//             await cursor.forEach( (cursor) => {
//                 listMessages.push(cursor);
//             });
//             Logger.info(listMessages);
//             io.of("/api/socket").emit("technical-issue", listMessages);
//             listMessages = [];
//             break;
//           case "delete":
//             break;
//         }
//     });
// });

