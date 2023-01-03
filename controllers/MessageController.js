const Message = require("../models/Message");
const Conversation = require('../models/Conversation');
const mongoose = require('../config/mongoose');
const Logger = require("../utils/logger");
const nodemailer = require('nodemailer');
  
const addMessage = async (req, res) => {
    const UIID = 'UIID' + req.body.topic_id + req.body.person_id;

    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'nguyenthanhtuanpro2k@gmail.com',
            pass: 'lmehetwumzjutarq',
        },
        });

  
    const mailOptions = {
        to: 'treynguyen2k.it@gmail.com',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
    };
    // clearCollections();
    try {
        const message = await Message.create({
            owner_message_id: req.body.person_id,
            message: req.body.message,
            conversation_id: UIID,
            date_created: req.body.date_created
        });

        let promiseConn = await getConversationPromise(UIID);
        if (promiseConn == null) {
            const conversation = await Conversation.create({
                conversation_id: UIID,
                topic_id: req.body.topic_id,
                user_id: req.body.person_id,
                staff_id: null,
                date_modified: new Date().toISOString(),
                date_created: req.body.date_created 
            });
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
            return res.json({
                success: true,
                message: "Message added successfully!",
            });
        }
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        return res.json({
            success: true,
            message: "Message added successfully!",
        });
    } catch (error) {
        Logger.error(error);
        return res.json({
            success: false,
            message: "Error with adding message. See server console for more info.",
        });
    }

};

async function getConversation(UIID) {
    return Conversation.findOne({conversation_id: UIID}).exec();
}

async function getConversationPromise(UIID) {
    return new Promise((resolve) => {
        Conversation.findOne({conversation_id: UIID}, function (err, conversation) {
            resolve(conversation);
         });
    });
}

async function clearCollections() {
	const collections = mongoose.connection.collections;
	await Promise.all(Object.values(collections).map(async (collection) => {
		await collection.deleteMany({}); 
	}));
}

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

