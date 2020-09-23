const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Project = require("../models/Project.model");

// Crud Criar
router.get("/project-create", (req, res) => res.render("/feed/project-create"));

router.post("/feed/project-create", async (req, res) => {
  console.log("req.body --> ", req.body);
  const { title, typeOfskills, createdBy, description, image } = req.body;
  try {
    const result = Project.create(req.body);
    res.redirect("/project-feed");
    console.log("create project -- > ", result);
  } catch (err) {
    console.error(err);
  }
});

//GET - update:

router.get("/feed/project-edit/:id", (req, res) =>
  res.render("feed/project-edit")
);

//POST - update:

router.post("/feed/project-edit/:id", async (req, res) => {
  try {
    console.log(req.body);
    const result = await Project.updateOne(
      { _id: req.params.id },
      { $set: { ...req.body } }
    );
    console.log("update result --> ", result);
    res.redirect("/project-feed");
  } catch (err) {
    console.error(err);
  }
});

//
module.exports = router;
