const Message = require("../models/Message");

const addMessage = async (req, res) => {
    try {
        const message = await Message.create({
            message: req.body.message,
            date_created: req.body.date_created
        });

        return res.json({
            success: true,
            message: "Message added successfully!",
        });
    } catch (error) {
        return res.json({
            success: false,
            message: "Error with adding message. See server console for more info.",
        });
    }
};

const getMessages = async (req, res) => {
    try {
        const messages = await new Promise((resolve) => { 
            Message.find({}, function(err, data) { 
                if (err !== null) {
                    resolve(err);
                } else {
                    resolve(data);
                }
            });
        }); 
        return res.json({
            success: true,
            message: messages
        });
    } catch (error) {
        return res.json({
            success: false,
            message: error
        });
    }
};
  
module.exports = {
    addMessage,
    getMessages,
};

