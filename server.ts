import { Server } from 'socket.io';
import http from 'http';
import { prisma } from '@/lib/prisma';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Socket.IO Server');
});

const io = new Server(server, {
  cors: {
    origin: "*", // Allows all origins, or specify your frontend domain here
    methods: ["GET", "POST"],
  },
});

// Handle incoming connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for messages from clients
  socket.on('send_message', (newMessage) => {
    prisma.message.create({
      data: newMessage,
    }).then((savedMessage) => {
      // Emit the message to the room associated with the gigId
      io.to(newMessage.gigId).emit('receive_message', savedMessage);
    }).catch(err => {
      console.error('Failed to save message:', err);
      socket.emit('error', { message: 'Failed to save message' });
    });
  });

  // Join a specific gig's chat room
  socket.on('join_gig', (gigId) => {
    socket.join(gigId);
    console.log(`User joined gig room: ${gigId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server
server.listen(4000, () => {
  console.log('Socket.IO server running on port 4000');
});
