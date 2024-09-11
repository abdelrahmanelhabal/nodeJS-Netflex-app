const mongoose = require("mongoose");

const listShema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: [true, "Title is required"],
      unique: [true, "Title must be unidue"],
    },
    type: { type: String },
    genre: { type: String },
    content: {
      type: Array,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("list", listShema);
