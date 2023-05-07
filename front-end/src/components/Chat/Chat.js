import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { ChatFill, Send, XLg } from "react-bootstrap-icons";
import "../ChatBot/ChatBot.css";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatStatus, setChatStatus] = useState("idle");
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);
    newSocket.emit("new_user", { userId: "user1" }); // Replace 'user1' with the actual user id

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("request_accepted", () => {
      setChatStatus("connected");
    });

    socket.on("message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socket.on("chat_ended", () => {
      setChatStatus("idle");
      setMessages([]);
    });

    return () => {
      socket.off("request_accepted");
      socket.off("message");
      socket.off("chat_ended");
    };
  }, [socket]);

  const handleTalkToAgent = () => {
    setChatStatus("waiting");
    const messageData = {
      senderId: "bot",
      receiverId: "user1",
      content: "Waiting for Agent to accept, please be patient...",
    };
    setMessages((prevMessages) => [...prevMessages, messageData]);
    setInputMessage("");
    socket.emit("talk_to_agent", { userId: "user1" }); // Replace 'user1' with the actual user id
  };

  const handleMessageChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim() === "") return;

    const messageData = {
      senderId: "user1",
      receiverId: "agent",
      content: inputMessage,
    };
    socket.emit("message", messageData);
    setMessages((prevMessages) => [...prevMessages, messageData]);
    setInputMessage("");
  };

  return (
    <div className="chatbot">
      {isOpen ? (
        <div className="chatbot__container">
          <button className="chatbot__minimize" onClick={toggleChat}>
            <XLg />
          </button>
          <div className="chatbot__messages">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`chatbot__message ${
                    message.senderId === "user1" ? "user" : "bot"
                  }`}
                >
                  {message.content}
                </div>
              ))}
            {chatStatus === "idle" && (
              <div className="chatbot__options">
                <button onClick={handleTalkToAgent}>Talk to an Agent</button>
              </div>
            )}
            <form className="chatbot__input" onSubmit={handleMessageSubmit}>
              <input
                type="text"
                placeholder="Type your message"
                value={inputMessage}
                onChange={handleMessageChange}
              />
              <button type="submit" className="sendButton">
                <Send />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="chatbot__icon" onClick={toggleChat}>
          <ChatFill height={30} width={30} color="#FF919D" />
        </div>
      )}
    </div>
  );
};

export default Chatbot;
