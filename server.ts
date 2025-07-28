import http from 'http';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/* -------------------------------------------------- */
/* 1.  Read the port Render provides (fallback 4000)   */
/* -------------------------------------------------- */
const PORT  = Number(process.env.PORT) || 4000;  // ✅  key change
const HOST  = '0.0.0.0';                         // bind on all IFs

/* -------------------------------------------------- */
/* 2.  Plain HTTP server just to keep Render happy     */
/* -------------------------------------------------- */
const httpServer = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Socket.IO Server Running');
});

/* -------------------------------------------------- */
/* 3.  Socket.IO instance                              */
/* -------------------------------------------------- */
const io = new Server(httpServer, {
  cors: {
    origin : '*',            // tighten for prod
    methods: ['GET', 'POST']
  }
});

/* -------------------------------------------------- */
/* 4.  Socket handlers                                 */
/* -------------------------------------------------- */
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