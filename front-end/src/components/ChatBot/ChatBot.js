
import React, { useEffect, useState } from "react";
import "./ChatBot.css";
import { io } from "socket.io-client";
import { ChatFill, Send, XLg } from "react-bootstrap-icons";
import { checkEmail } from "../../helpers";
import { v4 as uuidv4 } from 'uuid';

const socketOptions = {
  withCredentials: false,
};

let socket;

function ChatBot() {
  const currentUser = "naveenrenji";
  const [isOpen, setIsOpen] = useState(false);
  const [chatState, setChatState] = useState("welcome");
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [roomID, setRoomID] = useState(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    socket = io(process.env.REACT_APP_BACKEND_URL || "http://localhost:3001", socketOptions);

    socket.on("connect", () => {
      console.log("Connected to the server");

      if (chatState === "talk_agent") {
        console.log("talking to agent");
        setRoomID(uuidv4());
        socket.emit("joinRequest", { username: currentUser, room: roomID });
      }
    });

    socket.on("message", (message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message.text, sender: message.sender },
      ]);
    });

    socket.on("agentJoined", () => {
      setChatState("agent_chat");
    });

    socket.on("agentEndChat", () => {
      setChatState("welcome");
      setMessages([]);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from the server");
    });

    return () => {
      socket.disconnect();
    };
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
      setMessages([
        ...messages,
        { text: "Connecting you to an agent. Please wait...", sender: "bot" },
      ]);
    }
  };

  const handleSendMessage = (event) => {
    event.preventDefault();
    let new_messages = [];
    if (inputMessage.trim()) {
      new_messages = [
        ...messages,
        { text: inputMessage.toString(), sender: "user" },
      ];
      setMessages(new_messages);
      
      if (chatState === "agent_chat") {
        socket.emit("sendMessage", inputMessage, roomID);
      }
      
      setInputMessage("");

      if (chatState === "raise_ticket") {
        new_messages = [
          ...new_messages,
          { text: "Please provide your email address.", sender: "bot" },
        ];

        setChatState("ask_email");
        setMessages(new_messages);
      } else if (chatState === "ask_email") {
        let email = "";
        try {
          email = checkEmail(inputMessage);
          // Save the ticket as a JSON object
          const ticket = {
            issue: messages[messages.length - 2].text,
            email: inputMessage,
          };
          console.log(ticket);
          new_messages = [
            ...new_messages,
            { text: "Thank you. Your ticket has been created.", sender: "bot" },
          ];
          setChatState("ticket_created");
          setMessages(new_messages);
          setChatState("welcome");
        } catch (e) {
          new_messages = [
            ...new_messages,
            { text: "Invalid email ID, please re-enter", sender: "bot" },
          ];
          setChatState("ask_email");
          setMessages(new_messages);
        }
      }
    }
  };

  const Message = ({ message }) => (

    <div
      className={`chatbot__message ${message.sender === currentUser ? "user" : "bot"}`}
    >
      {message.text}
      {message.sender === "agent" && (
        <span className="chatbot__agent-name">Agent</span>
      )}
    </div>
  );

  return (
    <div className="chatbot">
      {isOpen ? (
        <div className="chatbot__container">
          <button className="chatbot__minimize" onClick={toggleChat}>
            <XLg />
          </button>
          <div className="chatbot__messages">
            {messages.map((message, index) => (
              <Message key={index} message={message} />
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
}

export default ChatBot;
