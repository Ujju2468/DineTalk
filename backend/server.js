require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const startPollScheduler = require('./jobs/pollScheduler');

const authRoutes = require('./routes/authRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const messageRoutes = require('./routes/messageRoutes');
const pollRoutes = require('./routes/pollRoutes');
const groupRoutes = require('./routes/groupRoutes');
const pushRoutes = require('./routes/pushRoutes');

connectDB();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));
app.use(express.json({ limit: '5mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/polls', pollRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/push', pushRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:3000' }
});

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  // Join a personal room (for poll reminders / direct notifications)
  socket.on('identify', (userId) => {
    socket.join(`user:${userId}`);
  });

  // Join a group's chat room
  socket.on('joinGroup', (groupId) => {
    socket.join(`group:${groupId}`);
  });

  socket.on('leaveGroup', (groupId) => {
    socket.leave(`group:${groupId}`);
  });

  socket.on('sendMessage', (message) => {
    io.to(`group:${message.group}`).emit('receiveMessage', message);
  });

  socket.on('pollUpdate', (poll) => {
    io.to(`group:${poll.group}`).emit('pollUpdated', poll);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

startPollScheduler(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
