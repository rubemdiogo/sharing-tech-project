const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Project = require("../models/Project.model");

const fileUploader = require("../configs/cloudinary.config");

router.get("/project-feed", async (req, res, next) => {
 try{

  const result = await Project.find().populate("createdBy");
  console.log(result);
  res.render("feed/project-feed", {project: result});

 } catch(err){
   console.error(err);
 }
  
});

// CRUD:

//GET - create:

router.get("/project-create", (req, res) => res.render("feed/project-create"));

//POST - create:

router.post("/project-create", fileUploader.single("image"), async (req, res) => {

  const { title, typeOfskills, description} = req.body;
  const image = req.file ? req.file.url : "/images/default.png"

  const createdBy = req.user._id;
  const email = req.user.email;
  console.log(req.body);

  try {
    const result = await Project.create({title, typeOfskills, description, createdBy, email, image});
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
      projectToEdit.isWebDev = projectToEdit.typeOfskills === "Web Developer";
      projectToEdit.isData = projectToEdit.typeOfskills === "Data Analytics";
      projectToEdit.isUx = projectToEdit.typeOfskills === "UX/UI Design";
      res.render('feed/project-edit', projectToEdit);
    })
    .catch(error => console.log(`Error while getting a single project for edit: ${error}`));
});

//POST - update:

router.post("/feed/project-edit/:id", fileUploader.single("image") , async (req, res) => {
  try {
    console.log(req.body);
    const result = await Project.updateOne(
      { _id: req.params.id },
      { $set: { ...req.body, image: req.file ? req.file.url : "/public/images/default.png"} }
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
