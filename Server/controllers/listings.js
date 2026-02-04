const Listing = require("../models/listing");
const User = require("../models/user"); // Role update ke liye zaroori hai
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// 1. Get All Listings
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.status(200).json(allListings);
};

// 2. Show Single Listing
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");

  if (!listing) {
    return res.status(404).json({ success: false, message: "Listing not found!" });
  }
  res.status(200).json(listing);
};

// 3. Create Listing (With Role Update Logic)
module.exports.createListing = async (req, res, next) => {
  try {
    let response = await geocodingClient
      .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
      .send();

    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = response.body.features[0].geometry;

    let savedListing = await newListing.save();

    // --- ROLE UPDATE LOGIC ---
    // Agar user customer hai, toh property list karte hi owner bana do
    if (req.user.role === "customer") {
      await User.findByIdAndUpdate(req.user._id, { role: "owner" });
    }

    res.status(201).json({ 
      success: true, 
      message: "New Listing Created and Role Updated to Owner!", 
      data: savedListing 
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// 4. Update Listing
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  try {
    let coordinate = await geocodingClient
      .forwardGeocode({
        query: `${req.body.listing.location},${req.body.listing.country}`,
        limit: 1,
      })
      .send();

    req.body.listing.geometry = coordinate.body.features[0].geometry;
    let updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });

    if (req.file) {
      let url = req.file.path;
      let filename = req.file.filename;
      updatedListing.image = { url, filename };
      await updatedListing.save();
    }
    res.status(200).json({ success: true, message: "Listing Updated!", data: updatedListing });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// 5. Delete Listing
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  res.status(200).json({ success: true, message: "Listing Deleted!", data: deletedListing });
};

// 6. Filter by Category
module.exports.filter = async (req, res, next) => {
  let { id } = req.params;
  let allListings = await Listing.find({ category: { $all: [id] } });
  if (allListings.length != 0) {
    res.status(200).json(allListings);
  } else {
    res.status(404).json({ success: false, message: "No listings found for this category" });
  }
};

// 7. Search API
module.exports.search = async (req, res) => {
  let input = req.query.q?.trim().replace(/\s+/g, " ");
  if (!input) {
    return res.status(400).json({ error: "Search value empty" });
  }

  let element = input.charAt(0).toUpperCase() + input.slice(1);

  let allListings = await Listing.find({
    $or: [
      { title: { $regex: element, $options: "i" } },
      { category: { $regex: element, $options: "i" } },
      { country: { $regex: element, $options: "i" } },
      { location: { $regex: element, $options: "i" } }
    ]
  });

  if (allListings.length != 0) {
    res.status(200).json(allListings);
  } else {
    res.status(404).json({ success: false, message: "No results found" });
  }
};