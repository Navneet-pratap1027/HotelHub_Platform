const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

// 1. Check Login
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ 
      success: false, 
      message: "You must be logged in first!" 
    });
  }
  next();
};

// 2. Save Redirect URL (Zarurat nahi hai MERN mein, par rehne dein)
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

// 3. Check Listing Ownership (FIXED LOGIC)
module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  
  if (!listing) {
    return res.status(404).json({ success: false, message: "Listing not found!" });
  }

  // MERN mein res.locals ki jagah req.user use karein
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Session expired, please login again." });
  }

  // Owner compare karein
  if (!listing.owner.equals(req.user._id)) {
    return res.status(403).json({ 
      success: false, 
      message: "You do not have permission! You are not the owner." 
    });
  }
  next();
};

// 4. Validate Listing
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    return res.status(400).json({ success: false, message: errMsg }); // Error throw ki jagah JSON bhejye
  }
  next();
};

// 5. Validate Review
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    return res.status(400).json({ success: false, message: errMsg });
  }
  next();
};

// 6. Check Review Author (FIXED LOGIC)
module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);

  if (!review) {
    return res.status(404).json({ success: false, message: "Review not found!" });
  }

  // res.locals ki jagah req.user use karein
  if (!req.user || !review.author.equals(req.user._id)) {
    return res.status(403).json({ 
      success: false, 
      message: "You are not the author of this review" 
    });
  }
  next();
};