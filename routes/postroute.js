const express = require("express");
const Post = require("../models/posts");
const router = express.Router();

// Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new post
router.post("/", async (req, res) => {
  const { newPost, username, selectedCategory } = req.body;
  try {
    const post = new Post({ newPost, username, selectedCategory });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;