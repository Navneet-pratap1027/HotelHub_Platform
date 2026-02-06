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
        // Frontend URL dashboard se uthayega
        failureRedirect: `${process.env.FRONTEND_URL}/login` 
    }),
    function (req, res) {
        // Success: Frontend ke home page par redirect
        res.redirect(`${process.env.FRONTEND_URL}/`);
    }
);

module.exports = router;