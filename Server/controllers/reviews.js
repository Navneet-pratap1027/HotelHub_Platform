const Listing = require("../models/listing");
const Review = require("../models/review");

// 1. Create Review
module.exports.createReview = async (req, res) => {
  try {
    let listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found!" });
    }

    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    // Frontend par author ka naam dikhane ke liye populate karna zaroori hai
    const populatedReview = await Review.findById(newReview._id).populate("author");

    res.status(200).json({ 
      success: true, 
      message: "New Review Created!", 
      data: populatedReview 
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// 2. Destroy Review
module.exports.destroyReview = async (req, res) => {
  try {
    let { id, reviewId } = req.params;

    // Listing ke array se review ID ko pull (remove) karein
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    
    // Asal review collection se delete karein
    let deletedReview = await Review.findByIdAndDelete(reviewId);

    if (!deletedReview) {
        return res.status(404).json({ success: false, message: "Review not found!" });
    }

    res.status(200).json({ 
      success: true, 
      message: "Review Deleted Successfully!",
      reviewId: reviewId 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};