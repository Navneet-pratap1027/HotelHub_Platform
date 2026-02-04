const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

// 1. Check Login (Modified for React/JSON)
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ 
      success: false, 
      message: "You must be logged in first!" 
    });
  }
  next();
};

// 2. Save Redirect URL
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

// 3. Check Listing Ownership (Fixed Crash)
module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  
  if (!listing) {
    return res.status(404).json({ success: false, message: "Listing not found!" });
  }

  // Pehle check karein currUser exist karta hai ya nahi
  if (!res.locals.currUser) {
    return res.status(401).json({ success: false, message: "Session expired, please login again." });
  }

  // Ab owner check karein
  if (!listing.owner.equals(res.locals.currUser._id)) {
    return res.status(403).json({ 
      success: false, 
      message: "You do not have permission as you are not the owner!" 
    });
  }
  next();
};

// 4. Validate Listing
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// 5. Validate Review
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// 6. Check Review Author (Fixed Crash)
module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);

  if (!review) {
    return res.status(404).json({ success: false, message: "Review not found!" });
  }

  if (!res.locals.currUser || !review.author.equals(res.locals.currUser._id)) {
    return res.status(403).json({ 
      success: false, 
      message: "You are not the author of this review" 
    });
  }
  next();
};