const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  username: String,
  text: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Chat", ChatSchema);
