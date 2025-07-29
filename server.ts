
import { Server } from 'socket.io';
import http from 'http';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Socket.IO Server Running');
});


const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST'],
  },
});

/* ---------- socket handlers ---------- */
io.on('connection', (socket) => {
  console.log(`✅ New user connected: ${socket.id}`);

  /* join a room */
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`📦 Socket ${socket.id} joined room: ${roomId}`);
  });

  /* receive & persist a chat message */
  socket.on('send_message', async (newMessage) => {
    console.log(`📨 Received message:`, newMessage);

    const { gigId, roomId, sender, recipient, message } = newMessage;

    // ---------- basic validation ----------
    if (!gigId || !roomId || !sender || !recipient || !message?.trim()) {
      console.warn('⚠️ Invalid message format received:', newMessage);
      return socket.emit('error', { message: 'Invalid message format' });
    }

    try {
      // ---------- duplicate-within-5-seconds guard ----------
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

      // ---------- save to DB ----------
      const savedMessage = await prisma.message.create({
        data: {
          gigId,
          roomId,
          sender,
          recipient,
          message,
        },
      });

      // ---------- broadcast to room ----------
      console.log(`✅ Message saved and broadcasting to room ${roomId}`);
      io.to(roomId).emit('receive_message', savedMessage);
    } catch (error) {
      console.error('❌ Error saving message to DB:', error);
      socket.emit('error', { message: 'Database error' });
    }
  });

  /* disconnect */
  socket.on('disconnect', () => {
    console.log(`👋 User disconnected: ${socket.id}`);
  });
});

/* ---------- start the server ---------- */
server.listen(4000, () => {
  console.log('🚀 Socket.IO server running at http://localhost:4000');
});





// import http from 'http';
// import { Server } from 'socket.io';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// /* ------------------------------------------------------------------ */
// /* 1.  PORT & HOST  (Render sets PORT automatically)                  */
// /* ------------------------------------------------------------------ */
// const PORT = Number(process.env.PORT || 4000);   // 4000 for local, $PORT in prod
// const HOST = '0.0.0.0';

// /* ------------------------------------------------------------------ */
// /* 2.  Tiny HTTP server (health-check, keeps Render happy)            */
// /* ------------------------------------------------------------------ */
// const httpServer = http.createServer((_, res) => {
//   res.writeHead(200, { 'Content-Type': 'text/plain' });
//   res.end('Socket.IO Server Running');
// });

// /* ------------------------------------------------------------------ */
// /* 3.  Socket.IO instance                                             */
// /* ------------------------------------------------------------------ */
// const io = new Server(httpServer, {
//   cors: {
//     origin: [
//       'http://localhost:3000',          // dev
//       'https://gigswallversion2.vercel.app'        // prod  ← replace with your domain(s)
//     ],
//     methods: ['GET', 'POST'],
//     credentials: true,
//   },
// });

// /* ------------------------------------------------------------------ */
// /* 4.  Handlers                                                       */
// /* ------------------------------------------------------------------ */
// io.on('connection', (socket) => {
//   console.log(`✅  ${socket.id} connected`);

//   /* join a room */
//   socket.on('join_room', (roomId) => {
//     socket.join(roomId);
//     console.log(`📦  ${socket.id} joined ${roomId}`);
//   });

//   /* receive & persist a chat message */
//   socket.on('send_message', async (data) => {
//     const { gigId, roomId, sender, recipient, message } = data;
//     if (!gigId || !roomId || !sender || !recipient || !message?.trim()) {
//       return socket.emit('error', { message: 'Invalid message format' });
//     }

//     try {
//       // prevent duplicates in the last 5 s
//       const dupe = await prisma.message.findFirst({
//         where: {
//           gigId,
//           sender,
//           message,
//           createdAt: { gte: new Date(Date.now() - 5_000) },
//         },
//       });
//       if (dupe) return;

//       // save
//       const saved = await prisma.message.create({
//         data: { gigId, roomId, sender, recipient, message },
//       });

//       // broadcast to everyone in the room
//       io.to(roomId).emit('receive_message', saved);
//     } catch (err) {
//       console.error('❌  DB error:', err);
//       socket.emit('error', { message: 'Database error' });
//     }
//   });

//   socket.on('disconnect', () => {
//     console.log(`👋  ${socket.id} disconnected`);
//   });
// });

// /* ------------------------------------------------------------------ */
// /* 5.  Start                                                          */
// /* ------------------------------------------------------------------ */
// httpServer.listen(PORT, HOST, () => {
//   console.log(`🚀  Socket.IO listening on http://${HOST}:${PORT}`);
// });