import React, { useEffect, useState } from "react";
import "./ChatBot.css";
import { io } from "socket.io-client";

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
            Minimize
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
              <button type="submit">Send</button>
            </form>
          </div>
        </div>
      ) : (
        <div className="chatbot__icon" onClick={toggleChat}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M12 2C6.486 2 2 6.486 2 12c0 5.515 4.486 10 10 10h9V12C22 6.486 17.515 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-4-10h8v2H8zm0-4h8v2H8zm0 8h4v2H8z" />
          </svg>
        </div>
      )}
    </div>
  );
}

export default ChatBot;
