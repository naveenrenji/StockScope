const express = require("express");
const app = express();
const session = require("express-session");
const configRoutes = require("./routes");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const http = require("http");
const { mongoConfig } = require("./config/settings.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

const connectMongo = async () => {
  try {
    let conn = await mongoose.connect(
      mongoConfig.serverUrl + "" + mongoConfig.database,
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    console.log(conn.modelNames());
  } catch (error) {
    console.log("could not connect");
    console.log(error);
  }
};

connectMongo();

app.use(
  session({
    name: "AuthCookie",
    secret: "This is a secret.. shhh don't tell anyone",
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: 86400000 },
  })
);
configRoutes(app);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const users = {}; // Store users and their socket ids
const pendingRequests = []; // Store pending chat requests
const chats = {}; // Stores socket ids and their chat history

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('new_user', (data) => {
    users[data.userId] = socket.id;
    console.log('New user:', data.userId, socket.id);
  });

  socket.on('talk_to_agent', (data) => {
    pendingRequests.push(data.userId);
    io.to(users['agent']).emit('request_received', data);
    console.log('Request sent from:', data.userId);
  });

  socket.on('accept_request', (data) => {
    const userToAccept = pendingRequests.shift();
    io.to(users[userToAccept]).emit('request_accepted', { agentId: 'agent' });
    console.log('Request accepted for:', userToAccept);
  });

  socket.on('message', (data) => {
    if(!chats.users[data.receiverId]){
      chats.users[data.receiverId] = [data.content];
    }else{
      chats.users[data.receiverId] = [...chats.users[data.receiverId], data.content];
    }
    io.to(users[data.receiverId]).emit('message', data);
    console.log('Message sent from', data.senderId, 'to', data.receiverId);
  });

  socket.on('load_chat', (data)=>{
    const chatHistory = chats.users[data.receiverId];
    io.to(users[data.receiverId]).emit('chat_loaded', chatHistory);
    console.log(`Chat history with User: ${data.receiverId} loaded`);
  });

  socket.on('end_chat', (data) => {
    io.to(users[data.receiverId]).emit('chat_ended', { agentId: 'agent' });
    console.log('Chat ended with', data.receiverId);
  });

  socket.on('disconnect', () => {
    const disconnectedUser = Object.keys(users).find(
      (key) => users[key] === socket.id
    );
    delete users[disconnectedUser];
    console.log('User disconnected:', disconnectedUser);
  });
});


server.listen(3001, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3001");
});
