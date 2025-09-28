// index.js
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Your React app's address
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/offers', require('./routes/offers'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/matches', require('./routes/matches'));
app.use('/api/reports', require('./routes/reports'));

// Socket.IO connection for chat
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // User joins a chat room based on match_id
  socket.on('join_room', (matchId) => {
    socket.join(matchId);
    console.log(`User ${socket.id} joined room ${matchId}`);
  });

  // Listen for a message and broadcast it to the room
  socket.on('send_message', async (data) => {
    const { match_id, sender_id, content } = data;
    // Save message to database
    await pool.query(
      'INSERT INTO Message (match_id, sender_id, content) VALUES (?, ?, ?)',
      [match_id, sender_id, content]
    );
    // Broadcast message to the specific room
    io.to(match_id).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));