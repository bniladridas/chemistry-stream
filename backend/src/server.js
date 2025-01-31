const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Store connected users
const connectedUsers = new Map();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('join', (userData) => {
    connectedUsers.set(socket.id, userData);
    io.emit('userList', Array.from(connectedUsers.values()));
  });

  // Handle chat messages
  socket.on('message', (data) => {
    io.emit('message', {
      user: connectedUsers.get(socket.id),
      text: data.text,
      timestamp: new Date()
    });
  });

  // Handle video call signaling
  socket.on('callUser', (data) => {
    io.to(data.userToCall).emit('callUser', {
      signal: data.signalData,
      from: socket.id,
      name: connectedUsers.get(socket.id)
    });
  });

  socket.on('answerCall', (data) => {
    io.to(data.to).emit('callAccepted', data.signal);
  });

  socket.on('disconnect', () => {
    connectedUsers.delete(socket.id);
    io.emit('userList', Array.from(connectedUsers.values()));
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
