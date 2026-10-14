import React, { useState } from "react";
import { IoSend } from "react-icons/io5";
import { FaMicrophone } from "react-icons/fa";
import useSpeechRecognition from "./hooks/useSpeechRecognition";
import "./AIInput.scss";
import useSpeechSynthesis from "./hooks/useSpeechSynthesis";

const AIInput = ({ onSend, loading }) => {
    const [message, setMessage] = useState("");
    const { stop } = useSpeechSynthesis();

    const {
        listening,
        startListening,
        stopListening,
    } = useSpeechRecognition((transcript) => {
        setMessage(transcript);

        onSend(transcript);

        setMessage("");
    });

    const handleSend = () => {
        const text = message.trim();

        if (!text || loading) return;

        onSend(text);
        setMessage("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleMic = () => {
        stop();          // Stop AI voice immediately
        startListening(); // Start microphone
    };

    return (
        <div className="ai-input">
            <textarea
                placeholder="Ask me anything..."
                value={message}
                rows={1}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
            />

            <button
                type="button"
                className={`mic-btn ${listening ? "listening" : ""}`}
                onClick={handleMic}
                disabled={loading}
            >
                <FaMicrophone />
            </button>

            <button
                onClick={handleSend}
                disabled={!message.trim() || loading}
            >
                <IoSend />
            </button>
        </div>
    );
};

export default AIInput;