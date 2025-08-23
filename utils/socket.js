const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

function setupSocket(server) {
  const io = new Server(server, { cors: { origin: "*" } });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      const user = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = user;
      next();
    } catch (err) {
      next(err);
    }
  });

  io.on("connection", (socket) => {
    socket.on("join-room", ({ roomId }) => {
      socket.join(roomId);
      socket.to(roomId).emit("peer-joined", { userId: socket.user.userId });
    });

    socket.on("webrtc-offer", ({ roomId, sdp }) => {
      socket.to(roomId).emit("webrtc-offer", { from: socket.user.userId, sdp });
    });

    socket.on("webrtc-answer", ({ roomId, sdp }) => {
      socket.to(roomId).emit("webrtc-answer", { from: socket.user.userId, sdp });
    });

    socket.on("webrtc-ice-candidate", ({ roomId, candidate }) => {
      socket.to(roomId).emit("webrtc-ice-candidate", { from: socket.user.userId, candidate });
    });

    socket.on("end-session", ({ roomId }) => {
      socket.to(roomId).emit("session-ended");
    });
  });
}

module.exports = { setupSocket };
