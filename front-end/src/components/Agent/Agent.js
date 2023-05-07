import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const Agent = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [activeChats, setActiveChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);
    newSocket.emit('new_user', { userId: 'agent' });

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('request_received', (data) => {
      setPendingRequests((prevRequests) => [...prevRequests, data.userId]);
    });

    socket.on('message', (data) => {
      if (data.senderId === currentChat) {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    });

    return () => {
      socket.off('request_received');
      socket.off('message');
    };
  }, [socket, currentChat]);

  const handleAcceptRequest = (userId) => {
    socket.emit('accept_request', { userId });
    setActiveChats((prevChats) => [...prevChats, userId]);
    setCurrentChat(userId);
    setMessages([]);
    setPendingRequests((prevRequests) => prevRequests.filter((id) => id !== userId));
  };

  const handleEndChat = () => {
    socket.emit('end_chat', { receiverId: currentChat });
    setActiveChats((prevChats) => prevChats.filter((id) => id !== currentChat));
    setCurrentChat(null);
    setMessages([]);
  };

  const handleMessageChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim() === '') return;

    const messageData = {
      senderId: 'agent',
      receiverId: currentChat,
      content: inputMessage,
    };
    socket.emit('message', messageData);
    setMessages((prevMessages) => [...prevMessages, messageData]);
    setInputMessage('');
  };

  return (
    <div>
      <h1>Agent Dashboard</h1>
      <h2>Pending Requests</h2>
      <ul>
        {pendingRequests.map((userId, index) => (
          <li key={index}>
            {userId} <button onClick={() => handleAcceptRequest(userId)}>Accept</button>
          </li>
        ))}
      </ul>
      {currentChat && (
        <div>
          <h2>Chat with {currentChat}</h2>
          <ul>
            {messages.map((message, index) => (
              <li
                key={index}
                style={{
                  textAlign: message.senderId === 'agent' ? 'right' : 'left',
                }}
              >
                {message.content}
              </li>
            ))}
          </ul>
          <form onSubmit={handleMessageSubmit}>
            <input
              type="text"
              value={inputMessage}
              onChange={handleMessageChange}
            />
            <button type="submit">Send</button>
          </form>
          <button onClick={handleEndChat}>End Chat</button>
        </div>
      )}
    </div>
  );
};

export default Agent;
