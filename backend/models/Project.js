const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description1: { type: String },
  description2: { type: String },
  description3: { type: String },
  description4: { type: String },
  deploymentLink: { type: String },
  githubLink: { type: String },
  screenshotUrl: { type: String },  // URL or relative path to the uploaded image
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
