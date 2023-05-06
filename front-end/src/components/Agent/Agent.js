import React, { useState } from "react";
import { io } from "socket.io-client";

function Agent() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  const handleInputChange = (event) => {
    setInputMessage(event.target.value);
  };

  const handleSendMessage = (event) => {
    event.preventDefault();

    if (inputMessage.trim()) {
      const socket = io("http://localhost:3001");
      socket.emit("sendMessage", inputMessage, "agent");

      setMessages([...messages, { text: inputMessage, sender: "agent" }]);
      setInputMessage("");
    }
  };

  return (
    <div className="agent">
      <h2>Agent Chat</h2>
      <div className="agent__messages">
        {messages.map((message, index) => (
          <div key={index} className={`agent__message ${message.sender === "agent" ? "agent" : "user"}`}>
            {message.text}
          </div>
        ))}
      </div>
      <form className="agent__input" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Type your message"
          value={inputMessage}
          onChange={handleInputChange}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Agent;
