const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/usermodel");
const router = express.Router();

const SECRET_KEY = "kartik"; // Make sure this is the same as your JWT secret

// Signup Route
router.post("/signup", async (req, res) => {
    const { name, email, password, type } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        const name = await User.findOne({name});
        if(name) return res.status(400).json({message:"Name already in use"});
        if (existingUser) return res.status(400).json({ message: "Email already in use" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, type });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
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

// Middleware for JWT verification
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


router.get("/Elder",async(req,res)=>{
    try{
        const user=await User.find({type:"Elder"});
        res.status(200).json(user);
    }catch(err){
        res.status(500).json({message:"Server error"});
    }
}); 
router.get("/Family",async(req,res)=>{
  try{
    const user = await User.find({type:"Family"});
    res.status(200).json(user);
  }catch(err){
    res.status(500).json({message:"Server error"});
  }
})

// Get Current User
router.get("/me", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
