import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

function Agent() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [requests, setRequests] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

  const socket = io("http://localhost:3001/agent", { autoConnect: false });

  useEffect(() => {
    socket.connect();

    socket.on("updateRequests", (updatedRequests) => {
      setRequests(updatedRequests);
    });

    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const handleAcceptRequest = (request) => {
    setCurrentChat(request);
    socket.emit("acceptRequest", request);
  };

  const handleInputChange = (event) => {
    setInputMessage(event.target.value);
  };

  const handleSendMessage = (event) => {
    event.preventDefault();

    if (inputMessage.trim()) {
      const room = currentChat.id;
      socket.emit("sendMessage", inputMessage, room);

      setMessages([...messages, { text: inputMessage, sender: "agent", room }]);
      setInputMessage("");
    }
  };

  const handleEndChat = () => {
    const room = currentChat.id;
    socket.emit("endChat", room);
    setCurrentChat(null);
    setMessages([]);
  };

  return (
    <div className="agent">
      <h2>Agent Chat</h2>
      <div className="agent__requests">
        <h3>Pending Requests</h3>
        {requests.map((request, index) => (
          <div key={index} className="agent__request">
            <span>{request.username}</span>
            <button onClick={() => handleAcceptRequest(request)}>Accept</button>
          </div>
        ))}
      </div>
      <div className="agent__messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`agent__message ${
              message.sender === "agent" ? "agent" : "user"
            }`}
          >
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
          disabled={!currentChat}
        />
        <button type="submit" disabled={!currentChat}>
          Send
        </button>
      </form>
      {currentChat && (
        <button onClick={handleEndChat} className="agent__end-chat">
          End Chat
        </button>
      )}
    </div>
  );
}

export default Agent;
