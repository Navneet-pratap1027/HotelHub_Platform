const express = require("express");
const router = express.Router();
const passport = require('../controllers/googles.js');

// 1. Google Auth Start
router.get(
    "/",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

// 2. Google Auth Callback
router.get(
    "/callback",
    passport.authenticate("google", { 
        failureRedirect: "http://localhost:5173/login" // React login page par bheje agar fail ho
    }),
    function (req, res) {
        // SUCCESS: React ke home page par redirect karein (Port 5173)
        // Yahan se browser wapas aapke React app mein chala jayega
        res.redirect("http://localhost:5173/");
    }
);

module.exports = router;