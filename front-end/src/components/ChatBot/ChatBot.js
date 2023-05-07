import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { ChatFill, Send, XLg } from "react-bootstrap-icons";
import "../ChatBot/ChatBot.css";
import emailjs from "emailjs-com";
import { checkEmail } from "../../helpers";

function sendEmail(jsonData, username) {
  emailjs.init("hjkkL6TtpBRBqKNxZ");

  const { email, content } = jsonData;

  const serviceID = "service_mbg89ee";
  const templateID = "template_orx5zxh";

  const emailParams = {
    from_name: username,
    from_email: email,
    subject: "StockScope Ticket",
    message: content,
  };

  return emailjs
    .send(serviceID, templateID, emailParams)
    .then((response) => {
      console.log("Email sent successfully", response.status, response.text);
    })
    .catch((err) => {
      console.error("Email sending failed", err);
    });
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatStatus, setChatStatus] = useState("idle");
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const currUsername = "naveenrenji";
  let email = "";
  let content = "";

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

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
    socket.emit("talk_to_agent", { userId: currUsername }); // Replace 'currUsername' with the actual user id
  };

  const handleMessageChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim() === "") return;

    if (chatStatus === "raised_ticket") {
      try {
        email = checkEmail(inputMessage);
        email=inputMessage;
        let messageData = {
          senderId: "bot",
          receiverId: currUsername,
          content: inputMessage,
        };
        setMessages((prevMessages) => [...prevMessages, messageData]);
         messageData = {
          senderId: "bot",
          receiverId: currUsername,
          content:
            "Please type in your concern...",
        };
        setMessages((prevMessages) => [...prevMessages, messageData]);
        setChatStatus("raise_issue");
        setInputMessage("");
      } catch (e) {
        const messageData = {
          senderId: "bot",
          receiverId: currUsername,
          content: "Invalid email ID, please re-enter",
        };
        setMessages((prevMessages) => [...prevMessages, messageData]);
        setInputMessage("");
      }
    }
    else if (chatStatus==="raise_issue"){
      content=inputMessage.trim();
      sendEmail({ email: email, content: content });
      const messageData = {
        senderId: "bot",
        receiverId: currUsername,
        content:
          "Ticket Raised. Our Agent will reach out to you soon, thank you for your patience.",
      };
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setInputMessage("");
      setChatStatus("idle");
    }
    else if (chatStatus==="connected") {
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
      content: "Enter Email ID for this ticket",
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
                className={`chatbot__message ${
                  message.senderId === currUsername ? "user" : "bot"
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
            {(chatStatus === "connected" || chatStatus === "raised_ticket" || chatStatus === "raise_issue") && (
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
