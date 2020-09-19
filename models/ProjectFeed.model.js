const { Schema, model } = require("mongoose");

const FeedSchema = new Schema({
  title: { type: String, required: true, unique: true },
  typeOfskills: {
    type: String,
    enum: ["Web Developer", "UX/UI Design", "Data Analytics"],
    required: true,
  },
  createdBy: { type: [String], required: true },

  description: { type: [String], required: true },

  image: { type: String, default: "/public/images/default.png" },
  created: { type: Date, default: Date.now() },
});

module.exports = model("ProjectFeed", FeedSchema);
