const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  level: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  color: {
    type: String,
    required: true,
    default: 'bg-blue-500'
  }
});

const skillCategorySchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  icon: {
    type: String,
    required: true,
    default: '🎨'
  },
  skills: [skillSchema]
}, {
  timestamps: true
});

// Add index for better performance
skillCategorySchema.index({ category: 1 });

module.exports = mongoose.model('SkillCategory', skillCategorySchema);