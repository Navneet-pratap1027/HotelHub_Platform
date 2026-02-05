const Listing = require("../models/listing");
const User = require("../models/user");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

// Token sync for both Frontend/Backend
const mapToken = process.env.VITE_MAP_TOKEN || process.env.MAP_TOKEN;

let geocodingClient;
if (mapToken) {
    geocodingClient = mbxGeocoding({ accessToken: mapToken });
}

// 1. GET ALL LISTINGS
module.exports.index = async (req, res) => {
    try {
        const allListings = await Listing.find({}).sort({ createdAt: -1 });
        res.status(200).json(allListings);
    } catch (err) {
        res.status(500).json({ success: false, message: "Listings fetch nahi ho payin" });
    }
};

// 2. SHOW SINGLE LISTING (With Reviews & Author)
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    try {
        const listing = await Listing.findById(id)
            .populate({
                path: "reviews",
                populate: { path: "author" },
            })
            .populate("owner");

        if (!listing) {
            return res.status(404).json({ success: false, message: "Property nahi mili!" });
        }
        res.status(200).json(listing);
    } catch (err) {
        res.status(400).json({ success: false, message: "Invalid ID" });
    }
};

// 3. CREATE LISTING (WanderLust Style Geometry)
module.exports.createListing = async (req, res) => {
    try {
        let response = await geocodingClient
            .forwardGeocode({
                query: req.body.listing.location,
                limit: 1,
            })
            .send();

        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        
        if (req.file) {
            newListing.image = { url: req.file.path, filename: req.file.filename };
        }
        
        if (response.body.features.length > 0) {
            newListing.geometry = response.body.features[0].geometry;
        }

        await newListing.save();

        // Auto-Role Update
        if (req.user.role === "customer") {
            await User.findByIdAndUpdate(req.user._id, { role: "owner" });
        }

        res.status(201).json({ success: true, message: "New Listing Created!" });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// 4. FILTER BY CATEGORY 
module.exports.filter = async (req, res) => {
    let { id } = req.params; 
    try {
        let allListings = await Listing.find({ category: { $in: [id] } });
        
        if (allListings.length !== 0) {
            res.status(200).json(allListings);
        } else {
            res.status(404).json({ success: false, message: `No listings found for ${id}` });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: "Filter error" });
    }
};
module.exports.search = async (req, res) => {
    let input = req.query.q?.trim().replace(/\s+/g, " ");
    
    if (!input) {
        return res.status(400).json({ success: false, message: "Search value empty!" });
    }

    let data = input.split("");
    let element = "";
    let flag = false;
    for (let index = 0; index < data.length; index++) {
        if (index === 0 || flag) {
            element = element + data[index].toUpperCase();
        } else {
            element = element + data[index].toLowerCase();
        }
        flag = data[index] === " ";
    }

    try {
        // Search by Title, Category, or Country
        let allListings = await Listing.find({
            $or: [
                { title: { $regex: element, $options: "i" } },
                { category: { $regex: element, $options: "i" } },
                { country: { $regex: element, $options: "i" } },
                { location: { $regex: element, $options: "i" } }
            ]
        });

        // Price Logic from WanderLust
        const intValue = parseInt(element, 10);
        if (allListings.length === 0 && !isNaN(intValue)) {
            allListings = await Listing.find({ price: { $lte: intValue } }).sort({ price: 1 });
        }

        if (allListings.length !== 0) {
            res.status(200).json(allListings);
        } else {
            res.status(404).json({ success: false, message: "No matching results found" });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: "Search failed" });
    }
};

// 6. DELETE & UPDATE (Original code remains same but returns JSON)
module.exports.destroyListing = async (req, res) => {
    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Listing Deleted!" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Delete failed" });
    }
};