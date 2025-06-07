const express = require('express');
const multer = require('multer');
const path = require('path');
const Project = require('../models/Project');

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure 'uploads' folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// GET all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create new project with optional image upload
router.post('/', upload.single('screenshot'), async (req, res) => {
  try {
    const {
      title,
      description1,
      description2,
      description3,
      description4,
      deploymentLink,
      githubLink,
    } = req.body;

    const screenshotUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const project = new Project({
      title,
      description1,
      description2,
      description3,
      description4,
      deploymentLink,
      githubLink,
      screenshotUrl,
    });

    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update a project by ID with optional image upload
router.put('/:id', upload.single('screenshot'), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const {
      title,
      description1,
      description2,
      description3,
      description4,
      deploymentLink,
      githubLink,
    } = req.body;

    project.title = title || project.title;
    project.description1 = description1 || project.description1;
    project.description2 = description2 || project.description2;
    project.description3 = description3 || project.description3;
    project.description4 = description4 || project.description4;
    project.deploymentLink = deploymentLink || project.deploymentLink;
    project.githubLink = githubLink || project.githubLink;

    if (req.file) {
      project.screenshotUrl = `/uploads/${req.file.filename}`;
    }

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE a project by ID
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
