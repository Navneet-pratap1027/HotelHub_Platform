if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const cors = require("cors");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// Routes Import
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const googleRouter = require("./routes/google.js");

const dbUrl = process.env.ATLASDB_URL;

// MongoDB Connection
main()
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

// --- MIDDLEWARES ---

// Production mein origin handle karne ke liye update
app.use(cors({
  origin: process.env.NODE_ENV === "production" ? false : "http://localhost:5173", 
  credentials: true 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// --- SESSION & STORE ---
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: { secret: process.env.SECRET },
  touchAfter: 24 * 3600,
});

const sessionOptions = {
  store,
  secret: process.env.SECRET || "mysupersecretstring",
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Production mein secure cookies
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
  },
};

app.use(session(sessionOptions));

// --- PASSPORT ---
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// --- API ROUTES ---
app.use("/api/auth", userRouter);      
app.use("/auth/google", googleRouter); 
app.use("/api/listings", listingRouter);
app.use("/api/listings/:id/reviews", reviewRouter);

app.get("/api/current-user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(200).json({ user: null });
  }
});

app.get("/api/company-info", (req, res) => {
  res.json({
    companyName: "HotelHub Private Limited",
    since: 2024,
    description: "Holidays rentals homes, villa, cabins, beach house and more"
  });
});

// --- STATIC FILES & FRONTEND SERVE (Monolith Setup) ---

// Public/Uploads folder for Backend
app.use("/public", express.static(path.join(__dirname, "/public")));
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Agar Production hai toh Frontend ka 'dist' folder serve karein
if (process.env.NODE_ENV === "production") {
  // Yahan path dhyan se check karein (HotelHub/frontend/dist)
  const frontendPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    // API routes ke alawa koi bhi route ho toh index.html bhejein
    if (!req.path.startsWith("/api")) {
      res.sendFile(path.join(frontendPath, "index.html"));
    }
  });
}

// --- ERROR HANDLING ---

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "API Endpoint not found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).json({
    success: false,
    message: message, 
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at port: ${PORT}`);
});