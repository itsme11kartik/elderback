const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const Chat = require("./models/chatmodel");
const userRoutes = require("./routes/userroute");

const app = express();
const server = http.createServer(app);


const corsOptions = {
    origin: "https://elderfront.onrender.com", 
    credentials: true, 
};

app.use(express.json());
app.use(cors(corsOptions)); 
app.use("/user", userRoutes);


const io = new Server(server, {
    cors: {
        origin: "https://elderfront.onrender.com", 
        methods: ["GET", "POST"],
        credentials: true,
    },
});

mongoose
    .connect("mongodb+srv://kartik:1234@cluster0.hra8h.mongodb.net/Elder")
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));


io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    
    socket.on("fetchMessages", async () => {
        const messages = await Chat.find().sort({ timestamp: 1 });
        socket.emit("loadMessages", messages);
    });

    
    socket.on("sendMessage", async (message) => {
        const newMessage = new Chat(message);
        await newMessage.save(); 

        io.emit("receiveMessage", newMessage); 
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