const express = require('express');
const router = express.Router();
const Experience = require('../models/Experience');

// GET all experiences
router.get('/', async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ startDate: -1 });
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch experiences', error });
  }
});

// POST new experience
router.post('/', async (req, res) => {
  try {
    const newExperience = new Experience(req.body);
    const savedExperience = await newExperience.save();
    res.status(201).json(savedExperience);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create experience', error });
  }
});

// PUT update experience by id
router.put('/:id', async (req, res) => {
  try {
    const updatedExperience = await Experience.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedExperience) return res.status(404).json({ message: 'Experience not found' });
    res.json(updatedExperience);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update experience', error });
  }
});

// DELETE experience by id
router.delete('/:id', async (req, res) => {
  try {
    const deletedExperience = await Experience.findByIdAndDelete(req.params.id);
    if (!deletedExperience) return res.status(404).json({ message: 'Experience not found' });
    res.json({ message: 'Experience deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete experience', error });
  }
});

module.exports = router;
