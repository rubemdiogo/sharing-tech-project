const { Schema, model } = require("mongoose");

const FeedSchema = new Schema(
  {
    title: { type: String, required: true },
    typeOfskills: {
      type: String,
      enum: ["Web Developer", "UX/UI Design", "Data Analytics"],
      required: true,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },

    description: { type: String, required: true },

    image: { type: String, default: "/public/images/default.png" },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Project", FeedSchema);
