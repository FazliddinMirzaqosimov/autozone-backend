const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "You must give name"],
  },
  price: {
    type: Number,
    required: [true, "Price isn't defined"],
  },
  category: {
    type: String,
    required: [true, "Category isn't defined"],
  },
  car: {
    type: String,
    required: [true, "Car isn't defined"],
  },
  image: {
    type: String,
  },
  description: {
    type: String,
  },
  country: {
    type: String,
  },
  rating: {
    type: Number,
    default: 1,
  },
  capacity: {
    type: String,
  },
  created: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

module.exports = mongoose.model("Product", productSchema);
