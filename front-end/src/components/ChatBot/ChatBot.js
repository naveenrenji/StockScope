import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { ChatFill, Send, XLg } from "react-bootstrap-icons";
import "./ChatBot.css";
import sendEmail from "./RaiseTicket";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfiguration";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatStatus, setChatStatus] = useState("idle");
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [user, setUser] = useState("");

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          displayName: user.displayName,
          email: user.email,
        });
      } else {
        console.log("user is logged out");
        setUser("");
      }
    });
    return unsubscribe;
  }, [])

  const currUsername = user.displayName ? user.displayName : "StockScope User";

  useEffect(() => {
    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);
    newSocket.emit("new_user", { userId: currUsername });

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("request_accepted", () => {
      const messageData = {
        senderId: "bot",
        receiverId: currUsername,
        content: "Agent Connected",
      };
      setMessages((prevMessages) => [...prevMessages, messageData]);
      console.log("connected with agent");
      setChatStatus("connected");
    });

    socket.on("message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socket.on("chat_ended", () => {
      setChatStatus("idle");
      const messageData = {
        senderId: "bot",
        receiverId: currUsername,
        content: "Agent has ended the chat.",
      };
      setMessages((prevMessages) => [...prevMessages, messageData]);
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
      receiverId: currUsername,
      content: "Waiting for Agent to accept, please be patient...",
    };
    setMessages((prevMessages) => [...prevMessages, messageData]);
    setInputMessage("");
    socket.emit("talk_to_agent", { userId: currUsername }); // TODO: Replace 'currUsername' with the actual user id (DONE)
  };

  const handleMessageChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim() === "") return;

    if (chatStatus === "raised_ticket") {
      sendEmail(inputMessage, currUsername);
      const messageData = {
        senderId: "bot",
        receiverId: currUsername,
        content:
          "Ticket Raised -  " + inputMessage + "  - Our Agent will reach out to you soon, thank you for your patience.",
      };
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setInputMessage("");
      setChatStatus("idle");
    } else if (chatStatus === "connected") {
      const messageData = {
        senderId: currUsername,
        receiverId: "agent",
        content: inputMessage,
      };
      socket.emit("message", messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setInputMessage("");
    }
    setInputMessage("");
  };

  const handleRaiseTicket = (e) => {
    e.preventDefault();
    setChatStatus("raised_ticket");
    const messageData = {
      senderId: "bot",
      receiverId: currUsername,
      content: "Please type in your concern...",
    };
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
                className={`chatbot__message ${message.senderId === currUsername ? "user" : "bot"
                  }`}
              >
                {message.content}
              </div>
            ))}
            {chatStatus === "idle" && (
              <div className="chatbot__options">
                <button onClick={handleTalkToAgent}>Talk to an Agent</button>
                <button onClick={handleRaiseTicket}>Raise Ticket</button>
              </div>
            )}
            {(chatStatus === "connected" ||
              chatStatus === "raised_ticket" ||
              chatStatus === "raise_issue") && (
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
              )}
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
