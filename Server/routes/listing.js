const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

// Controller ko import karein (Check karein ki file ka naam 'listings.js' hi hai)
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// --- REST API ROUTES ---

// 1. Root Routes: Sabhi listings dekhna aur Nayi listing save karna
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );

// 2. Search Route: Listings search karna
router.get("/search", wrapAsync(listingController.search));

// 3. Filter Route: Category ke hisaab se filter karna
router.get("/filter/:id", wrapAsync(listingController.filter));

// 4. ID Specific Routes: Ek listing dekhna, Update karna, aur Delete karna
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(
    isLoggedIn, 
    isOwner, 
    wrapAsync(listingController.destroyListing)
  );

module.exports = router;