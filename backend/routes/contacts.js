const express = require('express');
const Contact = require('../models/Contact');
const router = express.Router();

// POST - Create new contact
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Basic validation
    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Create new contact
    const contact = new Contact({
      name,
      email,
      phone,
      message
    });

    const savedContact = await contact.save();

    res.status(201).json({
      success: true,
      message: 'Contact saved successfully',
      data: {
        id: savedContact._id,
        name: savedContact.name,
        timestamp: savedContact.createdAt
      }
    });

  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving contact'
    });
  }
});

// GET - Get all contacts (optional)
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: contacts
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contacts'
    });
  }
});

module.exports = router;
