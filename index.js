const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const Chat = require("./models/chatmodel");
const userRoutes = require("./routes/userroute");

const app = express();
const server = http.createServer(app);

// CORS configuration
const corsOptions = {
    origin: "http://localhost:5173", // Change this to your frontend URL when deployed
    credentials: true, // Allow credentials
};

app.use(express.json());
app.use(cors(corsOptions)); // Use the CORS options
app.use("/user", userRoutes);

// Socket.io setup
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Change this to your frontend URL when deployed
        methods: ["GET", "POST"],
        credentials: true,
    },
});

mongoose
    .connect("mongodb+srv://kartik:1234@cluster0.hra8h.mongodb.net/Elder")
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
const PORT = process.env.PORT || 8000; // Use environment variable for port
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});