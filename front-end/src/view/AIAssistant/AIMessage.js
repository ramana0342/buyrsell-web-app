

import React from "react";
import { FaRobot, FaUser } from "react-icons/fa";

import "./AIMessage.scss";

const AIMessage = ({ message, typing = false }) => {
    const isAssistant = message.sender === "assistant";

    return (
        <div
            className={`ai-message ${isAssistant ? "assistant-message" : "user-message"
                }`}
        >
            {isAssistant && (
                <div className="avatar assistant-avatar">
                    <FaRobot />
                </div>
            )}

            <div className="message-bubble">
                {typing ? (
                    <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                ) : (
                    message.text
                )}
            </div>

            {!isAssistant && (
                <div className="avatar user-avatar">
                    <FaUser />
                </div>
            )}
        </div>
    );
};

export default AIMessage;