// for chatting

import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocket, io } from "../socket/socketIo.js";



export async function sendMessage(req, res) {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const { message } = req.body;
    
    let conversation = await Conversation.findOne({
      participants: {
        $all: [senderId, receiverId]
      }
    });
    
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId]
      });
    }
    
    const newMessage = await Message.create({
      senderId: senderId,
      receiverId: receiverId,
      content: message
    });
    
    if (newMessage) {
      conversation.messages.push(newMessage._id);
      await conversation.save();
    }
    
    // Send to both the receiver and back to the sender
    const receiverSocket = getReceiverSocket(receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit('newMessage', newMessage);
    }
    
    // Send back to sender's socket too so their UI updates
    const senderSocket = getReceiverSocket(senderId);
    if (senderSocket) {
      io.to(senderSocket).emit('newMessage', newMessage);
    }
    
    return res.status(201).json({ 
      success: true, 
      message:newMessage
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
}
export async function getMessage(req, res) {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;

        const conversation = await Conversation.findOne({
            participants: {
                $all: [senderId, receiverId]
            }
        })?.populate("messages");

        if (!conversation) {
            return res.status(200).json({ message: "Conversation not found", success: true, message: [] });
        }
        return res.status(200).json({ message: "Conversation found", success: true, message: conversation.messages });
    } catch (error) {
        return res.status(500).json({ message: "Error getting messages", error: error.message, success: false });
    }
}