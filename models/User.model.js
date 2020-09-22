const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is require."],
    },

    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: [true, "Password is required."],
    },

    occupation: {
      type: String,
      enum: ["Web Developer", "Data Analytics", "UX/UI Design"],
    },

    skills: String,

    image: {
      type: String,
      default: "/images/profilephotodefault.png",
    },
    
    gitHub: String,

    aboutMe: String,
  },

  {
    timestamps: true,
  }
);

module.exports = model("User", UserSchema);
