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

let agentRequests = [];
let agentRooms = {};

const userNamespace = io.of("/user");
const agentNamespace = io.of("/agent");

userNamespace.on("connection", (socket) => {
  console.log("New user client connected");

  socket.on("requestAgent", (user) => {
    agentRequests.push(user);
    agentNamespace.emit("requestsUpdated", agentRequests);
  });

  socket.on("disconnect", () => {
    console.log("User client disconnected");
  });

  socket.onAny((event, ...args) => {
    console.log("user : ",event, args);
  });
});

agentNamespace.on("connection", (socket) => {
  console.log("New agent client connected");

  socket.emit("requestsUpdated", agentRequests);

  socket.on("acceptRequest", (user) => {
    const roomId = `room_${user}_${Date.now()}`;
    agentRooms[user] = roomId;
    socket.join(roomId);

    socket.emit("roomCreated", { user, roomId });
    userNamespace.to(user).emit("roomCreated", roomId);
  });

  socket.on("sendMessage", (message, room) => {
    socket.to(room).emit("message", { text: message, room: room });
  });

  socket.on("endChat", (roomId) => {
    userNamespace.to(roomId).emit("chatEnded");
    socket.leave(roomId);
  });

  socket.onAny((event, ...args) => {
    console.log("Agent : ",event, args);
  });

  socket.on("disconnect", () => {
    console.log("Agent client disconnected");
  });
});


server.listen(3001, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3001");
});
