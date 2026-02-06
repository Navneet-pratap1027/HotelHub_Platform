const User = require("../models/user");

// Signup Logic
module.exports.signup = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    
    req.login(registeredUser, (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Login failed after signup" });
      }
      res.status(200).json({ 
        success: true, 
        message: "Welcome to HotelHub!",
        user: {
          _id: registeredUser._id,
          username: registeredUser.username,
          email: registeredUser.email,
          role: registeredUser.role || "guest"
        }
      });
    });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

// Login Logic
module.exports.login = async (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: "Welcome back to HotelHub!",
    user: {
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role || "guest"
    }
  });
};

// Logout Logic
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Logout failed" });
    }
  
    res.clearCookie("connect.sid", {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "none"
    });
    res.status(200).json({ success: true, message: "Logged out successfully!" });
  });
};