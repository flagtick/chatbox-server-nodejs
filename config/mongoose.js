const mongoose = require("mongoose");
/** Connect MongoDB from Node.js application */
mongoose.set('strictQuery', false);
mongoose.connect('mongodb+srv://sdcera-chatbot:sdcera@cluster0.pglk0a5.mongodb.net/test', {
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});

module.exports = mongoose;
