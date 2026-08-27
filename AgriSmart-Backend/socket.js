import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { persistMessage } from "./controllers/chatController.js";

// Attach a Socket.IO server for real-time buyer <-> farmer chat.
export function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: true, credentials: true },
  });

  // Authenticate every socket using the JWT passed in the handshake.
  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.query?.token ||
        (socket.handshake.headers?.authorization || '').replace('Bearer ', '');
      if (!token) return next(new Error('Authentication token missing'));

      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error('Authentication failed'));
    }
  });

  io.on("connection", (socket) => {
    // Personal room lets us push conversation-list updates to a user on any device.
    socket.join(`user:${socket.userId}`);

    // Join a specific conversation room to receive its messages live.
    socket.on("conversation:join", (conversationId) => {
      if (conversationId) socket.join(`conversation:${conversationId}`);
    });

    socket.on("conversation:leave", (conversationId) => {
      if (conversationId) socket.leave(`conversation:${conversationId}`);
    });

    // Send a message: persist it, then broadcast to the room + both participants.
    socket.on("message:send", async ({ conversationId, text }, ack) => {
      try {
        if (!conversationId || !text || !text.trim()) {
          return ack?.({ ok: false, error: 'conversationId and text are required' });
        }
        const { message, participants } = await persistMessage({
          conversationId,
          senderId: socket.userId,
          text,
        });

        io.to(`conversation:${conversationId}`).emit("message:new", message);
        // Notify each participant's personal room so their conversation list refreshes.
        participants.forEach((pid) => {
          io.to(`user:${pid}`).emit("conversation:updated", {
            conversationId,
            lastMessage: message.text,
            lastMessageAt: message.createdAt,
          });
        });
        ack?.({ ok: true, data: message });
      } catch (err) {
        ack?.({ ok: false, error: err.message });
      }
    });

    // Lightweight typing indicator.
    socket.on("typing", ({ conversationId, isTyping }) => {
      if (conversationId) {
        socket.to(`conversation:${conversationId}`).emit("typing", {
          userId: socket.userId,
          isTyping: !!isTyping,
        });
      }
    });
  });

  return io;
}
