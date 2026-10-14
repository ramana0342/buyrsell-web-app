import { insertChatMessage } from "../models/chatModel.js";
import { sendMailToAdminForChat } from "../controllers/handleSendMessageToAdmin.js";
import jwt from "jsonwebtoken";

let onlineUsers = new Map();
let adminOnline = false;
let socketUserMap = new Map();
const lastEmailSent = new Map();

const emitOnlineUsers = (io) => {
  io.emit("online_users", {
    users: Array.from(onlineUsers.entries()).map(([user_id, data]) => ({
      user_id,
      name: data.name,
    })),
    admin: adminOnline,
  });
};

export const setupChatSocket = (io) => {

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        socket.user = null;
        return next();
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;

      next();
    } catch (err) {
      return next(new Error("Unauthorized"));
    }
  });


  io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    // ---------------- ADMIN ----------------
    socket.on("join_admin", () => {
      if (!socket.user?.admin_id) {
        return;
      }
      socket.join("admin_room");
      socket.data.role = "admin";

      adminOnline = true;

      emitOnlineUsers(io);
    });

    // ---------------- USER ----------------
    socket.on("join_room", ({ user_id, name }) => {
      if (socket.data.role === "admin") return;

      socket.join(user_id);

      socket.data.user_id = user_id;
      socket.data.role = "user";

      if (!onlineUsers.has(user_id)) {
        onlineUsers.set(user_id, {
          name: name || "User",
          sockets: new Set(),
        });
      }

      onlineUsers.get(user_id).sockets.add(socket.id);

      emitOnlineUsers(io);
    });

    // ---------------- MESSAGE ----------------
    socket.on("send_message", (data) => {

      const isAdmin = socket.user?.admin_id === process.env.ADMIN_ID;
      if (data.sender_type === "admin") {
        if (!isAdmin) {
          return;
        }
      }

      const messageData = {
        ...data,
        created_at: new Date(),
      };

      io.to(data.user_id).emit("receive_message", messageData);
      io.to("admin_room").emit("receive_message", messageData);

      io.to("admin_room").emit("update_user_list");

      io.to("admin_room").emit("new_message_alert", {
        user_id: data.user_id,
        sender_type: data.sender_type,
        name: data.name
      });

      insertChatMessage(messageData).catch(console.error);

      if (!adminOnline && data.sender_type === "user") {

        const now = Date.now();
        const last = lastEmailSent.get(data.user_id) || 0;

        if (now - last > 60000) {

          lastEmailSent.set(data.user_id, now);
          sendMailToAdminForChat({
            name: data.name,
            message: data.message,
            user_id: data.user_id
          }).catch(err => {
            console.error("Chat email failed:", err);
          });

        }

      }
    });

    // ---------------- TYPING  ----------------
    socket.on("typing", ({ user_id }) => {
      const role = socket.data.role;

      if (role === "admin") {
        io.to(user_id).emit("typing", {
          user_id,
          sender: "Admin",
        });
      } else {
        io.to("admin_room").emit("typing", {
          user_id,
          sender: "User",
        });
      }
    });

    // ---------------- DISCONNECT ----------------
    socket.on("disconnect", () => {
      const { user_id, role } = socket.data;

      // ADMIN
      if (role === "admin") {
        adminOnline = false;
        emitOnlineUsers(io);
        return;
      }

      // USER
      if (user_id && onlineUsers.has(user_id)) {
        const userData = onlineUsers.get(user_id);

        userData.sockets.delete(socket.id);

        if (userData.sockets.size === 0) {
          onlineUsers.delete(user_id);
        }
      }

      emitOnlineUsers(io);
    });

    socket.on("user_started_chat", (data) => {

      socket.join(data.user_id);

      socket.data.user_id = data.user_id;
      socket.data.role = "user";

      if (!onlineUsers.has(data.user_id)) {
        onlineUsers.set(data.user_id, {
          name: data.name || "User",
          sockets: new Set([socket.id]),
        });
      } else {
        onlineUsers.get(data.user_id).name = data.name || "User";
        onlineUsers.get(data.user_id).sockets.add(socket.id);
      }

      emitOnlineUsers(io);

      const systemMessage = {
        user_id: data.user_id,
        sender_type: "admin",
        name: data.name,
        message: "Hi, How can I help you?",
        created_at: new Date(),
      };

      io.to(data.user_id).emit("receive_message", systemMessage);
      io.to("admin_room").emit("receive_message", systemMessage);

      io.to("admin_room").emit("new_user_started", {
        user_id: data.user_id,
        name: data.name,
      });

      insertChatMessage(systemMessage).catch(console.error);
    });

  });
};