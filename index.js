const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const Chat = require("./models/chatmodel"); 


const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors());
const routes = require("./routes/userroute");
app.use("/user",routes);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});


mongoose
  .connect("mongodb+srv://kartik:1234@cluster0.hra8h.mongodb.net/")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


// Socket.io event handlers
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Fetch chat history when a user joins
  socket.on("fetchMessages", async () => {
    const messages = await Chat.find().sort({ timestamp: 1 });
    socket.emit("loadMessages", messages);
  });

  // Handle sending messages
  socket.on("sendMessage", async (message) => {
    const newMessage = new Chat(message);
    await newMessage.save(); // Save to database

    io.emit("receiveMessage", newMessage); // Broadcast to all users
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start server
server.listen(8000, () => {
  console.log("Server running on port 8000");
});
