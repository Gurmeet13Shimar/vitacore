const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

let io = null;

/**
 * Initialize Socket.IO and attach it to an HTTP server.
 * Must be called once from server.js before any route code runs.
 */
const initIO = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  // ── JWT authentication middleware ────────────────────────────────────────
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        return next(new Error('Authentication token missing'));
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id; // attach userId to socket
      next();
    } catch (err) {
      next(new Error('Invalid or expired token'));
    }
  });

  // ── Connection handler ────────────────────────────────────────────────────
  io.on('connection', (socket) => {
    const userId = socket.userId;
    // Each user joins their own private room keyed by their MongoDB _id
    socket.join(userId);
    console.log(`[Socket.IO] User ${userId} connected (socket: ${socket.id})`);

    socket.on('disconnect', (reason) => {
      console.log(`[Socket.IO] User ${userId} disconnected — ${reason}`);
    });
  });

  console.log('[Socket.IO] Server initialized ✅');
  return io;
};

/**
 * Get the Socket.IO instance after initialization.
 * Throws if called before initIO().
 */
const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized. Call initIO(httpServer) first.');
  }
  return io;
};

module.exports = { initIO, getIO };
