const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  newPost: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  selectedCategory: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);