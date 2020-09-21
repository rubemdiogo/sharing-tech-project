const bcrypt = require("bcryptjs");
const saltRounds = 10;
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const passport = require("passport");
const { replaceOne } = require("../models/User.model");

const User = require("../models/User.model");

// const fileUploader = require("../configs/cloudinary.config");

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
    res.render("auth/signup", {
      errorMessage: "name is required",
      name: true,
    });
  }

  if (!email || !email.match(/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/)) {
    error.email = "Email is required and should be a valid Email address";
    res.render("auth/signup", {
      errorMessage: "Email is required and should be a valid Email address",
      email: true,
    });
  }

  if (
    !password &&
    !password.match(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
    )
  ) {
    error.password =
      "Password is required, should be at least 8 characters long, should contain an uppercase letter, lowercase letter, a number and a special character";
    res.render("auth/signup", {
      errorMessage:
        "Password is required, should be at least 8 characters long, should contain an uppercase letter, lowercase letter, a number and a special character",
      password: true,
    });
  }

  if (Object.keys(error).length) {
    res.render("auth/signup", error);
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

router.get("/profile-edit/:id", async (req, res) => {
  console.log(req.user);
  return res.render("auth/profileEditForm", { user: req.user });
});
router.post("/profile-edit/:id", async (req, res) => {
  try {
    console.log(req.body);
    const result = await User.updateOne(
      { _id: req.params.id },
      { $set: { ...req.body } }
    );
    console.log("update result --> ", result);
    res.redirect("/profile");
  } catch (err) {
    console.error(err);
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// rota delete User
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
