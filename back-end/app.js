const express = require("express");
const app = express();
const session = require("express-session");
const configRoutes = require("./routes");
const cors = require("cors");
const mongoose = require("mongoose");
const {Server} = require("socket.io");
const http = require("http");
const { mongoConfig } = require("./config/settings.json");

let count = {};

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
const io = new Server(server, {cors: {origin: "*"}});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("join", ({ username, room }) => {
    socket.join(room);

    socket.emit("message", {
      text: `Welcome ${username}, you are connected to ${room}`,
    });

    socket.broadcast.to(room).emit("message", {
      text: `${username} has joined the chat`,
    });
  });

  socket.on("sendMessage", (message, room) => {
    io.to(room).emit("message", { text: message });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(3001, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3001");
});
