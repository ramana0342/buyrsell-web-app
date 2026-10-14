import express from "express";
import { fetchChatUsersList , fetchChatMessages } from "../controllers/chatController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/users-list", authMiddleware, fetchChatUsersList);
router.get("/messages/:user_id", fetchChatMessages);

export default router;