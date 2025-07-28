import { Server } from 'socket.io';
import http from 'http';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
// Create a basic HTTP server
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Socket.IO Server Running');
});
// Create a Socket.IO instance with CORS settings
const io = new Server(server, {
    cors: {
        origin: '*', // 🔒 Replace with actual frontend domain in production
        methods: ['GET', 'POST'],
    },
});
// On new client connection
io.on('connection', (socket) => {
    console.log(`✅ New user connected: ${socket.id}`);
    // Handle room join
    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        console.log(`📦 Socket ${socket.id} joined room: ${roomId}`);
    });
    // Handle chat messages
    socket.on('send_message', async (newMessage) => {
        console.log(`📨 Received message:`, newMessage);
        const { gigId, roomId, sender, recipient, message } = newMessage;
        // Validate message content
        if (!gigId || !roomId || !sender || !recipient || !message?.trim()) {
            console.warn('⚠️ Invalid message format received:', newMessage);
            return socket.emit('error', { message: 'Invalid message format' });
        }
        try {
            // Prevent duplicate messages within 5 seconds
            const duplicate = await prisma.message.findFirst({
                where: {
                    gigId,
                    sender,
                    message,
                    createdAt: {
                        gte: new Date(Date.now() - 5000),
                    },
                },
            });
            if (duplicate) {
                console.log('🔁 Duplicate message ignored:', message);
                return;
            }
            // Save the message to database
            const savedMessage = await prisma.message.create({
                data: {
                    gigId,
                    roomId,
                    sender,
                    recipient,
                    message,
                },
            });
            // Emit to all users in the room
            console.log(`✅ Message saved and broadcasting to room ${roomId}`);
            io.to(roomId).emit('receive_message', savedMessage);
        }
        catch (error) {
            console.error('❌ Error saving message to DB:', error);
            socket.emit('error', { message: 'Database error' });
        }
    });
    // On disconnect
    socket.on('disconnect', () => {
        console.log(`👋 User disconnected: ${socket.id}`);
    });
});
// Start the server
server.listen(4000, () => {
    console.log('🚀 Socket.IO server running at http://localhost:4000');
});
