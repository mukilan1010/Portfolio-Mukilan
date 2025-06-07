const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Experience', experienceSchema);