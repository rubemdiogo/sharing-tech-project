const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      require: [true, "User name is require."],
      unique: true,
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
      require: [true, "Password is required."],
    },

    profile: {
      name: String,
      occupation: {
        type: String,
        enum: ["Web Developer", "Data Analytics", "UX/UI Design"],
      },
      skills: String,
      image: {
        type: String,
        default: "/public/images/profilephotodefault.png",
      },
      gitHub: String,
      aboutMe: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", UserSchema);
