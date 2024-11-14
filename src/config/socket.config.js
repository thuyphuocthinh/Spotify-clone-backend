import { Server } from "socket.io";
import Message from "../models/message.model.js";

export const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  const userSockets = new Map(); // key : value => {userId: socketId}
  const userActivities = new Map(); // key : value => {userId: activites[]}

  io.on("connection", (socket) => {
    socket.on("user_connected", (userId) => {
      userSockets.set(userId, socket.id);
      userActivities.set(userId, "Idle");

      // broadcast to all connected sockets that this user just logged in
      io.emit("user_connected", userId);
      // let other users (exluding me) about online users
      socket.emit("users_online", Array.from(userSockets.keys()));
      // broadcast to all connected sockets about online users' activities
      io.emit("activites", Array.from(userActivities.entries()));
    });

    socket.on("update_activity", (userId, activity) => {
      console.log(">>> activity updated: ", userId, activity);
      userActivities.set(userId, activity);
      io.emit("activites_updated", { userId, activity });
    });

    socket.on("send_message", async (data) => {
      try {
        const { senderId, receiverId, content } = data;

        const message = await Message.create({
          senderId,
          receiverId,
          content,
        });

        // send to receiver in realtime, if they're online
        const receiverSocketId = userSockets.get(receiverId);
        if (receiverSocketId) {
          // send to only one receiver
          io.to(receiverSocketId).emit("receive_message", message);
        }

        socket.emit("message_sent", message);
      } catch (error) {
        console.error("Message error:", error);
        socket.emit("message_error", error.message);
      }
    });

    socket.on("disconnect", () => {
        let disconnectedUserId;
        for (const [userId, socketId] of userSockets.entries()) {
            // find disconnected user
            if (socketId === socket.id) {
                disconnectedUserId = userId;
                userSockets.delete(userId);
                userActivities.delete(userId);
                break;
            }
        }
        if (disconnectedUserId) {
            // client listen events => update status...
            io.emit("user_disconnected", disconnectedUserId);
        }
    });
  });
};

/**
 * io.emit => send event to all connected users
 * socket.emit => send event to the connected user (owner of socket)
 * socket.broadcast.emit => send an event to all connected clients except the one that triggered it
 * socket.on => listen event (client, server)
 * io.to(room).emit => send event to all clients in a specific room
 */