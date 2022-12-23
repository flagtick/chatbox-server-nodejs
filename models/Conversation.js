const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema({
    conversation_id: {
      type: String,
      unique: false,
      required: true,
    },
    topic_id: {
      type: String,
      unique: false,
      required: true,
    },
    user_id: {
      type: String,
      unique: false,
      required: true  
    },
    staff_id: {
      type: String,
      unique: false,
      required: false  
    },
    date_modified: {
      type: Date,
      required: true  
    },
    date_created: {
        type: Date,
        required: true
    }
  });
  
  const Conversation = mongoose.model("Conversation", ConversationSchema);

  module.exports = Conversation;