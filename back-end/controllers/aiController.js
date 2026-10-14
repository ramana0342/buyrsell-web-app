import { generateResponse } from "../services/aiService.js";
import {
  createConversation,
  saveMessage,
  getConversationHistory,
} from "../services/conversationService.js";

export const chatWithAI = async (req, res) => {
  try {
    const { conversationId, message } = req.body;

    if (!conversationId || !message) {
      return res.status(400).json({
        success: false,
        message: "conversationId and message are required",
      });
    }

    await createConversation(conversationId);

    await saveMessage(conversationId, "user", message);

    const history = await getConversationHistory(conversationId);

    const reply = await generateResponse(history);

    await saveMessage(conversationId, "assistant", reply);

    return res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};