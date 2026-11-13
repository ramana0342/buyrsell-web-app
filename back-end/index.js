import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

// import { setupChatSocket } from "./sockets/chatSocket.js";
// import chatRoutes from "./routes/chatRoutes.js";
// import aiRoutes from "./routes/aiRoutes.js";

import sellerAuthRoutes from "./routes/seller_routes/sellerAuthRoutes.js"
import sellerProductRoutes from "./routes/seller_routes/sellerProductRoutes.js";
import productRoutes from "./routes/product_routes/productRoutes.js";
import customerRoutes from "./routes/customer_routes/customerRoutes.js";
import customerWishlistRoutes from "./routes/customer_routes/customerWishlistRoutes.js";
import customerCartRoutes from "./routes/customer_routes/customerCartRoutes.js";
import offerRoutes from "./routes/offerRoutes.js";
import cookieParser from "cookie-parser";


const app = express();

const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// setupChatSocket(io);

const allowedOrigins = [
  process.env.FRONTEND_URL,
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Lightweight liveness check for the hosting platform. This intentionally
// does not depend on PostgreSQL so the HTTP service can start independently.
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/buyrsell/api/seller", sellerAuthRoutes);
app.use("/buyrsell/api", sellerProductRoutes);
app.use("/buyrsell/api", productRoutes);
app.use("/buyrsell/api/customer", customerRoutes);
app.use("/buyrsell/api/customer", customerWishlistRoutes);
app.use("/buyrsell/api/customer", customerCartRoutes);
app.use("/buyrsell/api", offerRoutes);

// app.use("/my-portfolio/api/chat", chatRoutes);
// app.use("/my-portfolio/api/ai", aiRoutes);



app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT = process.env.PORT || 6000;

// Do not hold HTTP startup on a database round trip. PostgreSQL connections
// are opened lazily by the shared pool when an API request needs the database.
server.listen(PORT, () => {
  console.log(`Server started running on port ${PORT}`);
});
