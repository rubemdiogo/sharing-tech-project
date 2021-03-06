const bcrypt = require("bcryptjs");
const saltRounds = 10;
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const passport = require("passport");
const { replaceOne } = require("../models/User.model");

const User = require("../models/User.model");

const fileUploader = require("../configs/cloudinary.config");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", async (req, res) => {
  console.log("req.body -> ", req.body);
  const { name, email, password } = req.body;
  const error = {};
  if (!name || typeof name !== "string") {
    error.name = "name is required";
  }

  if (!email || !email.match(/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/)) {
    error.email = "Email is required and should be a valid Email address";
  }

  if (
    !password ||
    !password.match(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
    )
  ) {
    error.password =
      "Password is required, should be at least 8 characters long, should contain an uppercase letter, lowercase letter, a number and a special character";
  }

  if (Object.keys(error).length) {
    return res.render("auth/signup", error);
  }

  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashPass = await bcrypt.hash(password, salt);
    console.log("hashPass >", hashPass);
    const result = await User.create({
      name,
      email,
      passwordHash: hashPass,
    });
    res.redirect("/login");
    console.log("resultado - >", result);
  } catch (err) {
    console.error(err);
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(500).render("auth/signup", { errorMessage: err.message });
    } else if (err.code === 11000) {
      res.status(500).render("auth/signup", {
        errorMessage:
          "name and E-mail need to be unique. Either name or E-mail is already used.",
      });
    }
  }
});

router.get("/login", (req, res) => res.render("auth/login"));

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
  })
);

router.get("/profile", (req, res) => {
  console.log("session --> ", req.user);
  if (!req.user || !req.user._id) {
    return res.redirect("/login");
  }
  return res.render("auth/profile", req.user);
});

//GET - update:

router.get("/profile-edit/:id", (req, res) => {
  console.log(req.user);
  req.user.isWebDev = req.user.occupation === "Web Developer";
  req.user.isData = req.user.occupation === "Data Analytics";
  req.user.isUx = req.user.occupation === "UX/UI Design";
  return res.render("auth/profileEditForm", { user: req.user });
});

//POST - update:

router.post("/profile-edit/:id", fileUploader.single("image"), async (req, res) => {
  try {
    console.log(req.body);
    const result = await User.updateOne(
      { _id: req.params.id },
      { $set: { ...req.body, image: req.file ? req.file.url : req.user.image } }
    );
    console.log("update result --> ", result);
    res.redirect("/profile");
  } catch (err) {
    console.error(err);
  }
});

//GET - logout:

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// GET - delete User:
router.get("/delete-user/:id", async (req, res) => {
  try {
    const result = await User.deleteOne({ _id: req.params.id });
    console.log("delete --> ", result);
    res.redirect("/");
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
