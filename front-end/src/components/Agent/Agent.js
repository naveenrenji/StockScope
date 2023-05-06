import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socketOptions = {
  withCredentials: false,
};

let socket;

function Agent() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [pendingRequests, setPendingRequests] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);

  useEffect(() => {
    socket = io(
      process.env.REACT_APP_BACKEND_URL || "http://localhost:3001",
      socketOptions
    );

    socket.on("connect", () => {
      console.log("Connected to the server");
    });

    socket.on("joinRequest", (request) => {
      console.log("received join request " + request);

      setPendingRequests((prevRequests) => [...prevRequests, request]);
    });

    socket.on("message", (message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message.text, sender: message.sender },
      ]);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from the server");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleInputChange = (event) => {
    setInputMessage(event.target.value);
  };

  const handleSendMessage = (event) => {
    event.preventDefault();

    if (inputMessage.trim()) {
      socket.emit("sendMessage", { text: inputMessage, room: currentRoom });

      setMessages([...messages, { text: inputMessage, sender: "agent" }]);
      setInputMessage("");
    }
  };
  const handleAcceptRequest = (request) => {
    setCurrentRoom(request.room);
    socket.emit("acceptRequest", { room: request.room });
    // Join the room when the agent accepts an incoming request
    socket.emit("join", { username: "agent", room: request.room });
    setPendingRequests((prevRequests) =>
      prevRequests.filter((req) => req.room !== request.room)
    );
  };

  const handleEndChat = () => {
    if (currentRoom) {
      socket.emit("agentEndChat", currentRoom);
      setCurrentRoom(null);
      setMessages([]);
    }
  };

  return (
    <div className="agent">
      <h2>Agent Chat</h2>
      <div className="agent__requests">
        {currentRoom === null && (
          <>
            <h3>Pending Requests</h3>
            <ul>
              {pendingRequests.map((request, index) => (
                <li key={index}>
                  {request.username}{" "}
                  <button onClick={() => handleAcceptRequest(request)}>
                    Accept
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      {currentRoom !== null && (
        <>
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
            />
            <button type="submit">Send</button>
          </form>
          <button onClick={handleEndChat}>End Chat</button>
        </>
      )}
    </div>
  );
}

export default Agent;
