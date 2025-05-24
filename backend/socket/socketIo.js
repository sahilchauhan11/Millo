import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      const allowedOrigins = [process.env.URL, 'http://localhost:5173'];
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const users = {};
export const getReceiverSocket = (receiverId) => {
  return users[receiverId];
};

io.on('connection', (socket) => {
  try {
    const userId = socket.handshake.query.userId;

    if (!userId) {
    
      return;
    }

    users[userId] = socket.id;
    

    io.emit('getOnlineUsers', Object.keys(users));

    // ✅ Listen for disconnection
    socket.on('disconnect', () => {
      if (userId) {
     
        delete users[userId];
        io.emit('getOnlineUsers', Object.keys(users));
      }
    });

    socket.on('sendMessage', ({ receiverId, message }) => {
      const receiverSocketId = users[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('newMessage', message);
      }
    });

    socket.on('sendNotification', ({ receiverId, notification }) => {
      const receiverSocketId = users[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('notification', notification);
      }
    });

    socket.on('error', (err) => {
         });

  } catch (error) {
   
  }
});

export { io, server, app };
