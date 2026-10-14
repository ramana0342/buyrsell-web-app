import pool from "../config/database.js";


export const createConversation = async (conversationId) => {
    const query = `
    INSERT INTO my_portfolio.ais_conversations(conversation_id)
    VALUES($1)
    ON CONFLICT (conversation_id)
    DO NOTHING
  `;

    await pool.query(query, [conversationId]);
};

export const saveMessage = async (
    conversationId,
    role,
    message
) => {
    const query = `
    INSERT INTO ais_messages
    (
      conversation_id,
      role,
      message
    )
    VALUES($1,$2,$3)
  `;

    await pool.query(query, [
        conversationId,
        role,
        message
    ]);
};

export const getConversationHistory = async (
    conversationId
) => {
    const query = `
    SELECT role,message
    FROM ais_messages
    WHERE conversation_id = $1
    ORDER BY created_at DESC
    LIMIT 20
  `;

    const result = await pool.query(query, [conversationId]);

    return result.rows.reverse();
};