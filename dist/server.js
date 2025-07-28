"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/* -------------------------------------------------- */
/* 1.  Read the port Render provides (fallback 4000)   */
/* -------------------------------------------------- */
const PORT = Number(process.env.PORT) || 4000; // ✅  key change
const HOST = '0.0.0.0'; // bind on all IFs
const httpServer = http_1.default.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Socket.IO Server Running');
});
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
io.on('connection', (socket) => {
    console.log(`✅  ${socket.id} connected`);
    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        console.log(`📦  ${socket.id} joined ${roomId}`);
    });
    socket.on('send_message', async (data) => {
        const { gigId, roomId, sender, recipient, message } = data;
        if (!gigId || !roomId || !sender || !recipient || !message?.trim()) {
            return socket.emit('error', { message: 'Invalid message format' });
        }
        /* … your Prisma save logic … */
    });
    socket.on('disconnect', () => {
        console.log(`👋  ${socket.id} disconnected`);
    });
});
/* -------------------------------------------------- */
/* 5.  Start                                           */
/* -------------------------------------------------- */
httpServer.listen(PORT, HOST, () => {
    console.log(`🚀  Socket.IO listening on http://${HOST}:${PORT}`);
});
