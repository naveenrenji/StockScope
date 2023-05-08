import React, { useEffect, useState } from "react";
import { Send, SlashCircle } from "react-bootstrap-icons";
import io from "socket.io-client";
import "./Agent.css";
import { auth } from "../../firebase/firebaseConfiguration";
import { signOut } from "firebase/auth";
import { Power } from "react-bootstrap-icons";

const Agent = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [activeChats, setActiveChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);
    newSocket.emit("new_user", { userId: "agent" });

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("request_received", (data) => {
      setPendingRequests((prevRequests) => [...prevRequests, data.userId]);
    });

    socket.on("message", (data) => {
      if (data.senderId === currentChat) {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    });

    return () => {
      socket.off("request_received");
      socket.off("message");
    };
  }, [socket, currentChat]);

  const handleAcceptRequest = (userId) => {
    socket.emit("accept_request", { userId });
    setActiveChats((prevChats) => [...prevChats, userId]);
    setCurrentChat(userId);
    setMessages([]);
    setPendingRequests((prevRequests) =>
      prevRequests.filter((id) => id !== userId)
    );
  };

  //TODO: Commplete handleChatRequest code below to persist chats once switched
  const handleChatRequest = (userId) => {
    setCurrentChat(userId);
    setMessages([]);
    socket.emit("ongoing_chats", { room: userId });
    const previousMessages = activeChats.find((chat) => chat === userId);
    if (previousMessages && previousMessages.messages) {
      setMessages(previousMessages.messages);
    }
  };  

  const handleEndChat = () => {
    socket.emit("end_chat", { receiverId: currentChat });
    setActiveChats((prevChats) => prevChats.filter((id) => id !== currentChat));
    setCurrentChat(null);
    setMessages([]);
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log("Signed out successfully");
        window.location.reload();
      })
      .catch((error) => {
        // An error happened.
      });
  };

  const handleMessageChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim() === "") return;

    const messageData = {
      senderId: "agent",
      receiverId: currentChat,
      content: inputMessage,
    };
    socket.emit("message", messageData);
    setMessages((prevMessages) => [...prevMessages, messageData]);
    setInputMessage("");
  };

  return (
    <div className="Home">
      <div className="portal">
        <div className="title-and-logout">
          <h1 className="portal-title">Agent Portal</h1>
          <button className="authButton" onClick={handleLogout}>
            Logout <Power size="18px" />
          </button>
        </div>
        <div className="agentPortal">
          <div className="agent-Sidebar">
            <p>New Support Requests</p>
            <ul>
              {pendingRequests.map((userId, index) => (
                <li key={index}>
                  {userId}{" "}
                  <button onClick={() => handleAcceptRequest(userId)}>
                    Accept
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="agent-middlebar">
            <p>Ongoing Support Chats</p>
            {activeChats.map((userId, index) => (
              <li key={index}>
                {userId}{" "}
                <button onClick={() => handleChatRequest(userId)}>
                  Switch
                </button>
              </li>
            ))}
          </div>
          <div className="agent-area">
            {currentChat ? (
              <div className="customer-chat">
                <h2>
                  Chat with <span>{currentChat}</span>
                </h2>
                <div className="customer__messages">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`customer__message ${
                        message.senderId === "agent" ? "left" : "right"
                      }`}
                    >
                      {message.content}
                    </div>
                  ))}
                </div>
                <form onSubmit={handleMessageSubmit} className="message-bar">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={handleMessageChange}
                    aria-label="send-message"
                  />
                  <button type="submit">
                    Send <Send />
                  </button>
                </form>
                <button onClick={handleEndChat} className="end-chat">
                  End Chat <SlashCircle />
                </button>
              </div>
            ) : (
              <div>
                <p className="relief">Great! No more customer queries</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agent;
