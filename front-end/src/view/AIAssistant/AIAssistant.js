import React, { useState, useEffect, useRef } from "react";

import "./AIAssistant.scss";

import AIHeader from "./AIHeader";

import { welcomeMessage } from "./aiData";

import AIMessage from "./AIMessage";

import AIInput from "./AIInput";

import { askAI } from "../../network/portfolioApiService/portfolioApiService";

import { v4 as uuidv4 } from "uuid";

import useSpeechSynthesis from "./hooks/useSpeechSynthesis";

const AIAssistant = ({ onClose }) => {
    const [messages, setMessages] = useState([welcomeMessage]);
    const [loading, setLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const messagesRef = useRef(null);
    const { speak } = useSpeechSynthesis();



    const [conversationId] = useState(() => {
        let id = localStorage.getItem("ai_conversation_id");

        if (!id) {
            id = uuidv4();
            localStorage.setItem("ai_conversation_id", id);
        }

        return id;
    });

    useEffect(() => {
        if (!messagesRef.current) return;

        messagesRef.current.scrollTo({
            top: messagesRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [messages]);

    const handleSend = async (text) => {
        if (!text.trim()) return;

        const userMessage = {
            id: Date.now(),
            sender: "user",
            text,
        };

        setMessages((prev) => [...prev, userMessage]);

        setLoading(true);
        setIsTyping(true);



        try {

            const userMessage = {
                conversationId: conversationId,
                message: text
            }

            const response = await askAI(userMessage);

            setIsTyping(false);



            const aiMessage = {
                id: Date.now() + 1,
                sender: "assistant",
                text: response.reply,
            };

            setMessages((prev) => [...prev, aiMessage]);

            speak(response.reply);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    sender: "assistant",
                    text: "Sorry, something went wrong.",
                },
            ]);
            setIsTyping(false);
        } finally {
            setLoading(false);
            setIsTyping(false);
        }
    };

    return (
        <div className="ai-assistant">
            <AIHeader onClose = {onClose} />

            <div className="ai-messages" ref={messagesRef}>
                {messages.map((message) => (
                    <AIMessage
                        key={message.id}
                        message={message}
                    />
                ))}

                {isTyping && (
                    <AIMessage
                        message={{
                            sender: "assistant",
                            text: "",
                        }}
                        typing={true}
                    />
                )}
            </div>

            <AIInput
                onSend={handleSend}
                loading={loading}
            />
        </div>
    );
};

export default AIAssistant;