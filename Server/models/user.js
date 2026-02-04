const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Email unique hona zaroori hai
  },
  
  // Role Based Access Control (RBAC)
  role: {
    type: String,
    enum: ["customer", "owner", "admin"],
    default: "customer", // New user hamesha customer rahega
  },

  // --------google / OAuth------------
  providerId: String,
  provider: String,
  
  // Optional: Profile picture from Google
  avatar: String,
});

// passportLocalMongoose automatically username aur password add kar dega
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);