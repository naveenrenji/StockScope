import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Send, SlashCircle } from "react-bootstrap-icons";
import io from "socket.io-client";
import { auth } from "../../firebase/firebaseConfiguration";
import { signOut } from "firebase/auth";
import { Power } from "react-bootstrap-icons";
import "./Agent.css";
import { onAuthStateChanged } from "firebase/auth";

const Agent = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [activeChats, setActiveChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentChat) {
      const chatHistory = localStorage.getItem(`chat_${currentChat}`);
      if (chatHistory) {
        setMessages(JSON.parse(chatHistory));
      }
    }
  }, [currentChat]);

  useEffect(() => {
    // console.log("Messages");
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);
    newSocket.emit("new_user", { userId: "agent" });

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === "stockscope2023@gmail.com") {
        console.log(user);
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        console.log("uid", user);
      } else {
        //console.log("user is logged out");
        //alert("You are not Logged in");
        navigate("/");
      }
    });
    return unsubscribe;
  }, [navigate]);

  useEffect(() => {
    if (!socket) return;

    socket.on("request_received", (data) => {
      setPendingRequests((prevRequests) => [...prevRequests, data.userId]);
    });
    socket.on("message", (data) => {
      if (data.senderId === currentChat) {
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, data];
          localStorage.setItem(
            `chat_${currentChat}`,
            JSON.stringify(updatedMessages)
          );
          return updatedMessages;
        });
      }
    });

    socket.on("User_closed", (data)=>{
      if (data === currentChat) {
        setMessages((prevMessages) => {
          let leftMessage = currentChat+" has left the chat."
          const messageData = {
            senderId: currentChat,
            receiverId: "agent",
            content: leftMessage,
          };
          const updatedMessages = [...prevMessages, messageData];
          localStorage.setItem(
            `chat_${currentChat}`,
            JSON.stringify(updatedMessages)
          );
          return updatedMessages;
        });
      }
    });

    return () => {
      socket.off("request_received");
      socket.off("message");
    };
  }, [socket, currentChat]);

  const handleAcceptRequest = (userId) => {
    socket.emit("accept_request", { userId });
    setActiveChats((prevChats) => {
      if (prevChats.includes(userId)) {
        return prevChats;
      } else {
        return [...prevChats, userId];
      }
    });
    setCurrentChat(userId);
    setMessages([]);
    setPendingRequests((prevRequests) =>
      prevRequests.filter((id) => id !== userId)
    );
  };

  //TODO: Commplete handleChatRequest code below to persist chats once switched
  const handleChatRequest = (userId) => {
    setCurrentChat(userId);
    const chatHistory = localStorage.getItem(`chat_${userId}`);
    if (chatHistory) {
      setMessages(JSON.parse(chatHistory));
    } else {
      setMessages([]);
    }
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
        navigate("/");
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
    const updatedMessages = [...messages, messageData];
    setMessages(updatedMessages);
    localStorage.setItem(
      `chat_${currentChat}`,
      JSON.stringify(updatedMessages)
    );
    setInputMessage("");
  };

  return (
    <div className="Home">
      <div className="portal">
        <div className="title-and-logout">
          <h1 className="portal-title">Agent Portal</h1>
          <div>
            <Link className="authButton2" onClick={handleLogout}>
              <Power size="18px" style={{ margin: "5px" }} /> Logout
            </Link>
          </div>
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
                  <div ref={messagesEndRef}></div>
                </div>

                {/* <div ref={messagesEndRef}></div> */}

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
