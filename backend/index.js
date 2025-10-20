require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const db = require('./db');
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });
app.use(cors());
app.use(express.json());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/offers', require('./routes/offers'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/matches', require('./routes/matches'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/users', require('./routes/users'));
io.on('connection', (socket) => {
  socket.on('join_chat', (matchId) => socket.join(matchId));
  socket.on('send_message', async (data) => {
    try {
      const { match_id, sender_id, content } = data;
      const [match] = await db.query('SELECT user1_id, user2_id FROM matches WHERE id = ?', [match_id]);
      if (!match.length) return; // safety check
      const receiver_id = match[0].user1_id === sender_id ? match[0].user2_id : match[0].user1_id;
      const newMessage = { match_id, sender_id, receiver_id, content };
      const [result] = await db.query('INSERT INTO messages SET ?', newMessage);
      const [messageRow] = await db.query(
        'SELECT m.*, u.username as sender_username FROM messages m JOIN users u ON m.sender_id = u.id WHERE m.id = ?', [result.insertId]);
      io.to(match_id).emit('receive_message', messageRow[0]);
    } catch (error) {
      console.error('Socket.IO error:', error);
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Backend server started on port ${PORT}`));