const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

// Note: Agar aapne controller update nahi kiya hai toh ye direct routes kaam aayenge
const userController = require("../controllers/users.js");

// --- Signup Route ---
router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        
        req.login(registeredUser, (err) => {
            if (err) return res.status(500).json({ message: "Login failed after signup" });
            // Flash ki jagah JSON response
            res.status(200).json({ 
                success: true, 
                message: "User registered successfully!",
                user: { id: registeredUser._id, username: registeredUser.username }
            });
        });
    } catch (e) {
        res.status(400).json({ success: false, message: e.message });
    }
}));

// --- Login Route ---
router.post("/login", 
    passport.authenticate("local", { failWithError: true }), 
    (req, res) => {
        // Success Login
        res.status(200).json({ 
            success: true, 
            message: "Welcome back to Wanderlust!", 
            user: req.user 
        });
    },
    (err, req, res, next) => {
        // Failure Login
        res.status(401).json({ 
            success: false, 
            message: "Invalid username or password" 
        });
    }
);

// --- Logout Route ---
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.status(200).json({ success: true, message: "Logged out successfully!" });
    });
});

module.exports = router;