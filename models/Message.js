const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    message: {
      type: String,
      unique: false,
      required: true,
    },
    date_created: {
        type: Date,
        required: true
    }
  });
  
  const Message = mongoose.model("Message", MessageSchema);

  module.exports = Message;