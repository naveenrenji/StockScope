const { createServer } = require("http");
const { Server }  = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];

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

httpServer.listen(8091);
