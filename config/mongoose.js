const mongoose = require("mongoose");
/** Connect MongoDB from Node.js application */
mongoose.set('strictQuery', false);
mongoose.connect('mongodb+srv://flagtick:YvwSHeSJL0rVYpJN@cluster0.rlpe6rz.mongodb.net/chatbox?retryWrites=true&w=majority', {
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});

module.exports = mongoose;
