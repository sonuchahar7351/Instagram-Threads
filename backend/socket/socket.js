import { Server } from 'socket.io'
import http from 'http';
import express from 'express';
import Message from '../models/messageModel.js';
import Conversation from '../models/ConversationModel.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
      cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"]
      }
})

export const getRecipientSocketId = (recipientId) => {
      return userSocketMap[recipientId];
}


const userSocketMap = {}

io.on('connection', (socket) => {
      console.log('a user connected', socket.id);
      const userId = socket.handshake.query.userId;
      if (userId !== "undefined") userSocketMap[userId] = socket.id;
      io.emit("getOnlineUsers", Object.keys(userSocketMap));

      socket.on("markMessagesAsSeen", async ({ conversationId, userId }) => {
            try {
                  await Message.updateMany(
                        { conversationId: conversationId, seen: false },
                        { $set: { seen: true } }
                  );

                  await Conversation.updateOne({ _id: conversationId }, { $set: { "lastMessage.seen": true } });

                  io.to(userSocketMap[userId]).emit("messagesSeen", { conversationId })
                  // const userSockets = userSocketMap[userId];

                  // if (userSockets && userSocketMap.length > 0) {
                  //       userSocketMap?.forEach((socketId) => {
                  //     io.to(socketId).emit("messagesSeen", { conversationId });
                  //   });
                  // } else {
                  //   // Handle the case where the user isn't connected
                  //   console.log(`User ${userId} is not currently connected`);
                  // }

            } catch (error) {
                  console.log(error)
            }
      })


      socket.on("disconnect", () => {
            console.log("User disconnected");
            delete userSocketMap[userId];
            io.emit("getOnlineUsers", Object.keys(userSocketMap))
      })
})

export { io, server, app }