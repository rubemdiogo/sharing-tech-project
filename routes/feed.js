const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Project = require("../models/Project.model");

router.get("/project-feed", (req, res, next) => {
  res.render("feed/project-feed");
});

// CRUD:

//GET - create:

router.get("/project-create", (req, res) => res.render("feed/project-create"));

//POST - create:

router.post("/project-create", async (req, res) => {

  const { title, typeOfskills, description} = req.body;

  const createdBy = req.user._id;
  const email = req.user.email;
  console.log(req.body);

  try {
    const result = await Project.create({title, typeOfskills, description, createdBy, email});
    res.redirect("/project-feed");
    console.log("create project -- > ", result);
  } catch (err) {
    console.error(err);
  }
});

//GET - update:

router.get('/project-feed/:id/project-edit', (req, res) => {
  const { id } = req.params;
 
  Project.findById(id)
    .then(projectToEdit => {
      console.log(projectToEdit);
      res.render('project-edit', bookToEdit);
    })
    .catch(error => console.log(`Error while getting a single project for edit: ${error}`));
});

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

//GET delete:

router.get("/delete-project/:id", async (req, res) => {
  try {
    const result = await Project.deleteOne({ _id: req.params.id });
    console.log("delete --> ", result);
    res.redirect("/project-feed");
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
