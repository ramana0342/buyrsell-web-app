import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { getSocketURL } from "../../network/ApiConfig";
import { usersChatMessages } from "../../network/portfolioApiService/portfolioApiService";

const UserChat = ({ setIsChatOpen }) => {
  const [user, setUser] = useState(null);
  const [nameInput, setNameInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState("");
  const [adminOnline, setAdminOnline] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const chatRef = useRef(null);

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(getSocketURL(), {
      transports: ["websocket"],
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("chat_user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);


  useEffect(() => {
    if (!socket || !user) return;

    const joinRoom = () => {
      socket.emit("join_room", {
        user_id: user.user_id,
        name: user.name,
      });

    };

    if (socket.connected) {
      joinRoom();
    }

    socket.on("connect", joinRoom);

    return () => {
      socket.off("connect", joinRoom);
    };
  }, [socket, user]);

  useEffect(() => {
    if (!socket) return;

    const handleOnlineUsers = (data) => {
      setAdminOnline(!!data?.admin);
    };

    const handleReceiveMessage = (data) => {
      setMessages((prev) => {
        const exists = prev.some(
          (m) =>
            m.message === data.message &&
            m.created_at === data.created_at
        );

        if (exists) return prev;

        return [...prev, data];
      });
    };

    const handleTyping = ({ user_id, sender }) => {
      setTyping(sender);
      setTimeout(() => setTyping(""), 1500);
    };

    socket.on("online_users", handleOnlineUsers);
    socket.on("receive_message", handleReceiveMessage);
    socket.on("typing", handleTyping);

    return () => {
      socket.off("online_users", handleOnlineUsers);
      socket.off("receive_message", handleReceiveMessage);
      socket.off("typing", handleTyping);
    };
  }, [socket]);


  useEffect(() => {
    if (!user) return;
    if (messages.length === 0) {
      getUserChatMessages();
    }

  }, [user]);

  const getUserChatMessages = async () => {

    setIsLoading(true);
    try {
      const data = await usersChatMessages(user.user_id)
      if (!data?.response?.length) return;
      setMessages(data?.response);
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    };
  }

  // ✅ SMOOTH AUTO SCROLL
  useEffect(() => {
    if (!chatRef.current) return;

    chatRef.current.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("send_message", {
      user_id: user.user_id,
      sender_type: "user",
      name: user.name,
      message,
    });

    setMessage("");
  };

  return (
    <div className="chat-popup">

      {/* HEADER */}
      <div className="user-chat-header">
        Chat
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div className={`user-status ${adminOnline ? "online" : "offline"}`}>
            Ramana is {adminOnline ? "Online" : "Offline"}
          </div>

          <span className="close-btn" onClick={() => {
            socket?.disconnect();
            setIsChatOpen(false)
          }}>
            ✖
          </span>
        </div>
      </div>

      {/* START */}
      {!user ? (
        <div className="user-start-chat">
          <div className="start-card">
            <div className="chat-icon">💬</div>

            <h3>Start Conversation</h3>
            <p>Chat with our support team instantly</p>

            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Enter your name"
            />

            <button
              onClick={() => {
                if (!nameInput.trim()) return;

                const newUser = {
                  user_id: "user_" + Math.random().toString(36).substring(2, 8),
                  name: nameInput,
                };

                localStorage.setItem("chat_user", JSON.stringify(newUser));
                setUser(newUser);

                const startChat = () => {
                  socket.emit("join_room", {
                    user_id: newUser.user_id,
                    name: newUser.name,
                  });

                  socket.emit("user_started_chat", {
                    user_id: newUser.user_id,
                    name: newUser.name,
                  });
                };

                if (socket.connected) {
                  startChat();
                } else {
                  socket.once("connect", startChat);
                }
              }}
            >
              Start Chat
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* MESSAGES */}
          <div className="user-chat-messages" ref={chatRef}>
            {isLoading ? (
              <div className="chat-loading">
                <div className="loader"></div>
                <p>Loading messages...</p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={`user-message ${msg.sender_type === "user" ? "user-self" : "user-admin"
                    }`}
                >
                  <div>{msg.message}</div>
                  <small>
                    {msg.created_at &&
                      new Date(msg.created_at).toLocaleTimeString()}
                  </small>
                </div>
              ))
            )}
          </div>

          {/* TYPING */}
          {typing && <div className="user-typing">{typing} typing...</div>}

          {/* INPUT */}
          <div className="user-chat-input">
            <input
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);

                socket.emit("typing", {
                  user_id: user.user_id,
                  sender: user.name,
                });
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Type message..."
            />

            {message.trim() && (
              <button onClick={sendMessage}>Send</button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default UserChat;