import { getChatUsersList } from "../models/chatModel.js";
import { getChatMessagesByUser } from "../models/chatModel.js";

export const fetchChatUsersList = async (req, res) => {
  try {
    const users = await getChatUsersList();

    res.status(200).json({
      status: { code: 200 },
      response: users,
    });
  } catch (error) {
    res.status(500).json({
      status: { code: 500, message: error.message },
    });
  }
};

export const fetchChatMessages = async (req, res) => {
  try {
    const { user_id } = req.params;

    const messages = await getChatMessagesByUser(user_id);

    res.status(200).json({
      status: { code: 200 },
      response: messages,
    });
  } catch (error) {
    res.status(500).json({
      status: { code: 500, message: error.message },
    });
  }
};