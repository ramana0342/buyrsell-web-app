import pool from "../config/database.js";

export const insertChatMessage = async ({
  user_id,
  sender_type,
  message,
  name,
}) => {
  const result = await pool.query(
    `INSERT INTO my_portfolio.chat_messages (user_id, sender_type, message, name)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [user_id, sender_type, message, name],
  );

  return result.rows[0];
};

export const getChatUsersList = async () => {
  const result = await pool.query(`
    SELECT 
      user_id,
      MAX(name) as name, 
      MAX(created_at) as last_message_time
    FROM my_portfolio.chat_messages
    GROUP BY user_id
    ORDER BY last_message_time DESC
  `);

  return result.rows;
};

export const getChatMessagesByUser = async (user_id) => {
  const result = await pool.query(
    `SELECT * FROM my_portfolio.chat_messages
     WHERE user_id = $1
     ORDER BY created_at ASC`,
    [user_id],
  );

  return result.rows;
};
