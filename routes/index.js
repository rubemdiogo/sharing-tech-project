const bcrypt = require('bcrypt');
const saltRounds = 10;
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const passport = require('passport');

const User = require('../models/User.model');

const fileUploader = require("../configs/cloudinary.config");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});



module.exports = router;
