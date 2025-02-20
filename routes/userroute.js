const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/usermodel");
const router = express.Router();

const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

// Signup Route
router.post("/signup", async (req, res) => {
  const { name, email, password, type } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, type });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign({ id: user._id, type: user.type }, SECRET_KEY, { expiresIn: "1d" });

    res.status(200).json({ token, type: user.type, name: user.name });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Middleware to Verify JWT Token
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "No token provided" });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });
    req.userId = decoded.id;
    req.userType = decoded.type;
    next();
  });
};

// Protected Route Example (Get User Data)
router.get("/", verifyToken, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(404).json({ message: "No users found" });
  }
});

module.exports = router;
