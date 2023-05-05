import React, { useEffect, useState } from "react";
import "./ChatBot.css";
import { io } from "socket.io-client";
import { ChatFill, Send, XLg } from "react-bootstrap-icons";

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatState, setChatState] = useState("welcome");
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (chatState === "talk_agent") {
      const socket = io("http://localhost:3001");

      socket.on("connect", () => {
        console.log("Connected to the server");

        socket.emit("join", { username: "user", room: "agent" });

        socket.on("message", (message) => {
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: message.text, sender: "agent" },
          ]);
        });

        socket.on("disconnect", () => {
          console.log("Disconnected from the server");
        });
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [chatState]);

  const handleOptionClick = (option) => {
    if (option === "raise_ticket") {
      setChatState("raise_ticket");
      setMessages([
        ...messages,
        { text: "Please describe your issue.", sender: "bot" },
      ]);
    } else if (option === "talk_agent") {
      setChatState("talk_agent");
    }
  };

  const handleSendMessage = (event) => {
    event.preventDefault();
    if (inputMessage.trim()) {
      setMessages([...messages, { text: inputMessage, sender: "user" }]);
      setInputMessage("");

      if (chatState === "raise_ticket") {
        setChatState("ask_email");
        setMessages([
          ...messages,
          { text: "Please provide your email address.", sender: "bot" },
        ]);
      } else if (chatState === "ask_email") {
        // Save the ticket as a JSON object
        const ticket = {
          issue: messages[messages.length - 2].text,
          email: inputMessage,
        };
        console.log(ticket);

        setChatState("ticket_created");
        setMessages([
          ...messages,
          { text: "Thank you. Your ticket has been created.", sender: "bot" },
        ]);
      }
    }
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
                  message.sender === "user" ? "user" : "bot"
                }`}
              >
                {message.text}
                {message.sender === "agent" && (
                  <span className="chatbot__agent-name">Agent</span>
                )}
              </div>
            ))}
            {chatState === "welcome" && (
              <div className="chatbot__options">
                <button onClick={() => handleOptionClick("raise_ticket")}>
                  Raise a Ticket
                </button>
                <button onClick={() => handleOptionClick("talk_agent")}>
                  Talk to an Agent
                </button>
              </div>
            )}
            <form className="chatbot__input" onSubmit={handleSendMessage}>
              <input
                type="text"
                placeholder="Type your message"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
              />
              <button type="submit" className="sendButton"><Send/></button>
            </form>
          </div>
        </div>
      ) : (
        <div className="chatbot__icon" onClick={toggleChat}>
          <ChatFill height={30} width={30} color="#FF919D"/>
        </div>
      )}
    </div>
  );
}

export default ChatBot;
