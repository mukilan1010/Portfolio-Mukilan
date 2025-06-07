const express = require('express');
const router = express.Router();
const SkillCategory = require('../models/Skill');

// @route   GET /api/skills
// @desc    Get all skill categories with skills
// @access  Public
router.get('/', async (req, res) => {
  try {
    const skillCategories = await SkillCategory.find().sort({ createdAt: 1 });
    res.json(skillCategories);
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ 
      message: 'Server error while fetching skills',
      error: error.message 
    });
  }
});

// @route   GET /api/skills/:id
// @desc    Get single skill category
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const skillCategory = await SkillCategory.findById(req.params.id);
    
    if (!skillCategory) {
      return res.status(404).json({ message: 'Skill category not found' });
    }
    
    res.json(skillCategory);
  } catch (error) {
    console.error('Error fetching skill category:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid category ID format' });
    }
    res.status(500).json({ 
      message: 'Server error while fetching skill category',
      error: error.message 
    });
  }
});

// @route   POST /api/skills
// @desc    Create new skill category
// @access  Private (you can add authentication middleware later)
router.post('/', async (req, res) => {
  try {
    const { category, icon, skills } = req.body;

    // Validation
    if (!category || !category.trim()) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    // Check if category already exists
    const existingCategory = await SkillCategory.findOne({ 
      category: category.trim() 
    });
    
    if (existingCategory) {
      return res.status(400).json({ 
        message: 'A category with this name already exists' 
      });
    }

    const newSkillCategory = new SkillCategory({
      category: category.trim(),
      icon: icon || '🎨',
      skills: skills || []
    });

    const savedCategory = await newSkillCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    console.error('Error creating skill category:', error);
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'A category with this name already exists' 
      });
    }
    res.status(500).json({ 
      message: 'Server error while creating skill category',
      error: error.message 
    });
  }
});

// @route   PUT /api/skills/:id
// @desc    Update skill category
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { category, icon } = req.body;

    // Validation
    if (!category || !category.trim()) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const skillCategory = await SkillCategory.findById(req.params.id);
    
    if (!skillCategory) {
      return res.status(404).json({ message: 'Skill category not found' });
    }

    // Check if new category name already exists (excluding current category)
    if (category.trim() !== skillCategory.category) {
      const existingCategory = await SkillCategory.findOne({ 
        category: category.trim(),
        _id: { $ne: req.params.id }
      });
      
      if (existingCategory) {
        return res.status(400).json({ 
          message: 'A category with this name already exists' 
        });
      }
    }

    skillCategory.category = category.trim();
    if (icon) skillCategory.icon = icon;

    const updatedCategory = await skillCategory.save();
    res.json(updatedCategory);
  } catch (error) {
    console.error('Error updating skill category:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid category ID format' });
    }
    res.status(500).json({ 
      message: 'Server error while updating skill category',
      error: error.message 
    });
  }
});

// @route   DELETE /api/skills/:id
// @desc    Delete skill category
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const skillCategory = await SkillCategory.findById(req.params.id);
    
    if (!skillCategory) {
      return res.status(404).json({ message: 'Skill category not found' });
    }

    await SkillCategory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Skill category deleted successfully' });
  } catch (error) {
    console.error('Error deleting skill category:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid category ID format' });
    }
    res.status(500).json({ 
      message: 'Server error while deleting skill category',
      error: error.message 
    });
  }
});

// @route   POST /api/skills/:id/skill
// @desc    Add skill to category
// @access  Private
router.post('/:id/skill', async (req, res) => {
  try {
    const { name, level, color } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Skill name is required' });
    }
    
    if (!level || level < 1 || level > 100) {
      return res.status(400).json({ message: 'Skill level must be between 1 and 100' });
    }

    const skillCategory = await SkillCategory.findById(req.params.id);
    
    if (!skillCategory) {
      return res.status(404).json({ message: 'Skill category not found' });
    }

    // Check if skill already exists in this category
    const existingSkill = skillCategory.skills.find(
      skill => skill.name.toLowerCase() === name.trim().toLowerCase()
    );
    
    if (existingSkill) {
      return res.status(400).json({ 
        message: 'A skill with this name already exists in this category' 
      });
    }

    const newSkill = {
      name: name.trim(),
      level: parseInt(level),
      color: color || 'bg-blue-500'
    };

    skillCategory.skills.push(newSkill);
    const updatedCategory = await skillCategory.save();
    
    res.status(201).json(updatedCategory);
  } catch (error) {
    console.error('Error adding skill:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid category ID format' });
    }
    res.status(500).json({ 
      message: 'Server error while adding skill',
      error: error.message 
    });
  }
});

// @route   PUT /api/skills/:id/skill/:skillIndex
// @desc    Update specific skill in category
// @access  Private
router.put('/:id/skill/:skillIndex', async (req, res) => {
  try {
    const { name, level, color } = req.body;
    const skillIndex = parseInt(req.params.skillIndex);

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Skill name is required' });
    }
    
    if (!level || level < 1 || level > 100) {
      return res.status(400).json({ message: 'Skill level must be between 1 and 100' });
    }

    const skillCategory = await SkillCategory.findById(req.params.id);
    
    if (!skillCategory) {
      return res.status(404).json({ message: 'Skill category not found' });
    }

    if (skillIndex < 0 || skillIndex >= skillCategory.skills.length) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    // Check if new skill name already exists in this category (excluding current skill)
    const existingSkill = skillCategory.skills.find(
      (skill, index) => 
        index !== skillIndex && 
        skill.name.toLowerCase() === name.trim().toLowerCase()
    );
    
    if (existingSkill) {
      return res.status(400).json({ 
        message: 'A skill with this name already exists in this category' 
      });
    }

    // Update the skill
    skillCategory.skills[skillIndex] = {
      _id: skillCategory.skills[skillIndex]._id, // Preserve the _id
      name: name.trim(),
      level: parseInt(level),
      color: color || skillCategory.skills[skillIndex].color
    };

    const updatedCategory = await skillCategory.save();
    res.json(updatedCategory);
  } catch (error) {
    console.error('Error updating skill:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    res.status(500).json({ 
      message: 'Server error while updating skill',
      error: error.message 
    });
  }
});

// @route   DELETE /api/skills/:id/skill/:skillIndex
// @desc    Delete specific skill from category
// @access  Private
router.delete('/:id/skill/:skillIndex', async (req, res) => {
  try {
    const skillIndex = parseInt(req.params.skillIndex);

    const skillCategory = await SkillCategory.findById(req.params.id);
    
    if (!skillCategory) {
      return res.status(404).json({ message: 'Skill category not found' });
    }

    if (skillIndex < 0 || skillIndex >= skillCategory.skills.length) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    // Remove the skill
    skillCategory.skills.splice(skillIndex, 1);
    
    const updatedCategory = await skillCategory.save();
    res.json(updatedCategory);
  } catch (error) {
    console.error('Error deleting skill:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    res.status(500).json({ 
      message: 'Server error while deleting skill',
      error: error.message 
    });
  }
});

// @route   GET /api/skills/stats/overview
// @desc    Get skills statistics
// @access  Public
router.get('/stats/overview', async (req, res) => {
  try {
    const categories = await SkillCategory.find();
    
    const stats = {
      totalCategories: categories.length,
      totalSkills: categories.reduce((total, cat) => total + cat.skills.length, 0),
      averageProficiency: 0,
      topSkills: []
    };

    if (stats.totalSkills > 0) {
      const allSkills = categories.flatMap(cat => cat.skills);
      const totalProficiency = allSkills.reduce((sum, skill) => sum + skill.level, 0);
      stats.averageProficiency = Math.round(totalProficiency / stats.totalSkills);
      
      // Get top 5 skills by proficiency
      stats.topSkills = allSkills
        .sort((a, b) => b.level - a.level)
        .slice(0, 5)
        .map(skill => ({
          name: skill.name,
          level: skill.level
        }));
    }

    res.json(stats);
  } catch (error) {
    console.error('Error fetching skills stats:', error);
    res.status(500).json({ 
      message: 'Server error while fetching skills statistics',
      error: error.message 
    });
  }
});

module.exports = router;