const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
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
      required: [true, "Image isn't defined"],
    },
    imageName: {
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
      min: 0,
      max: 5,
    },
    capacity: {
      type: Number,
    },
    unity: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
