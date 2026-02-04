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

app.use(cors({
  origin: "http://localhost:5173", // React Port
  credentials: true 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Static Files
app.use("/public", express.static(path.join(__dirname, "/public")));
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Session & Store
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
    secure: false, 
    sameSite: "lax", 
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

// 1. Auth Routes
app.use("/api/auth", userRouter);      
app.use("/auth/google", googleRouter); 

// 2. Listing & Review Routes
app.use("/api/listings", listingRouter);
app.use("/api/listings/:id/reviews", reviewRouter);

// 3. Current User Checker
app.get("/api/current-user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(200).json({ user: null });
  }
});

// 4. Footer Extra Info Routes (Agar aapko content dynamic chahiye)
app.get("/api/company-info", (req, res) => {
  res.json({
    companyName: "HotelHub Private Limited",
    since: 2024,
    description: "Holidays rentals homes, villa, cabins, beach house and more"
  });
});

// --- ERROR HANDLING (Yeh Flash messages ke liye zaroori hai) ---

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "API Endpoint not found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  
  // React Frontend is "message" ko read karke Flash box mein dikhayega
  res.status(statusCode).json({
    success: false,
    message: message, 
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend Server running at http://localhost:${PORT}`);
});