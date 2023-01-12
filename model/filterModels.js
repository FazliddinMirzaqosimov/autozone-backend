const mongoose = require("mongoose");
const filterSchema = new mongoose.Schema({
  filterName: {
    type: String,
    trim: true,
    required: [true, "You must give filterName"],
  },
  name: {
    type: String,
    unique: true,
    trim: true,
    required: [true, "You must give name"],
  },
});

exports.Filter = mongoose.model("Filter", filterSchema);
