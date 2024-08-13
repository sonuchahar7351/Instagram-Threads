import Conversation from "../models/ConversationModel.js";
import Message from "../models/messageModel.js";
import { getRecipientSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
      try {
            const { receiverId, message } = req.body;
            const senderId = req.user._id;

            let conversation = await Conversation.findOne({
                  participants: { $all: [senderId, receiverId] }
            });

            if (!conversation) {
                  conversation = new Conversation({
                        participants: [senderId, receiverId],
                        lastMessage: {
                              text: message,
                              sender: senderId,
                        }
                  })
                  await conversation.save();
            }

            const newMessage = new Message({
                  conversationId: conversation._id,
                  sender: senderId,
                  text: message
            });

            await Promise.all([
                  newMessage.save(),
                  conversation.updateOne({
                        lastMessage: {
                              text: message,
                              sender: senderId,
                        }
                  })
            ])
            const recieverSocketId = getRecipientSocketId(receiverId);
            if (recieverSocketId) {

                  io.to(recieverSocketId).emit("newMessage", newMessage);
            }


            res.status(200).json(newMessage);

      } catch (error) {
            res.status(500).json({ error: error.message })
      }
}

export const getMessages = async (req, res) => {
      const { otherUserId } = req.params;
      const userId = req.user._id;
      try {
            const conversation = await Conversation.findOne({
                  participants: { $all: [userId, otherUserId] }
            })

            if (!conversation) {
                  return res.status(200).json({ error: "conversation not found" });
            }

            const messages = await Message.find({
                  conversationId: conversation._id
            }).sort({ createdAt: 1 })
            res.status(200).json(messages);

      } catch (error) {
            res.status(500).json({ error: error.message });
      }
}

export const getConversations = async (req, res) => {

      const userId = req.user._id;
      try {
            const conversations = await Conversation.find({ participants: userId }).populate({
                  path: "participants",
                  select: "username profilePic"
            });
            //remove the current user form the participant array 
            conversations.forEach(conversation => {
                  conversation.participants = conversation.participants.filter(
                        participant => participant._id.toString() !== userId.toString()
                  );
            });

            res.status(200).json(conversations);
      }
      catch (error) {
            res.status(500).json({ error: error.Message });
      }
}