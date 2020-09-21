const bcrypt = require("bcrypt");
const saltRounds = 10;
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const passport = require("passport");

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
  console.log(req.body);
  const { username, email, password } = req.body;
  const error = {};
  if (!username || typeof username !== "string" || username.length > 20) {
    error.username = "Username is required and should be 20 characters max";
    res.render("auth/signup", {
      errorMessage: "Username is required and should be 20 characters max",
      username: true,
    });

    if (!email || !email.match(/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/)) {
      error.email = "Email is required and should be a valid Email address";
      res.render("auth/signup", {
        errorMessage: "Email is required and should be a valid Email address",
        email: true,
      });
    }

    if (
      !password ||
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
        username,
        email,
        passwordHash: hashPass,
      });
      res.redirect("/login");
      console.log(result);
    } catch (err) {
      console.error(err);
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(500).render("auth/signup", { errorMessage: err.message });
      } else if (err.code === 11000) {
        res
          .status(500)
          .render("auth/signup", {
            errorMessage:
              "Username and E-mail need to be unique. Either Username or E-mail is already used.",
          });
      }
    }
  }
});

module.exports = router;
