const express = require('express');
const multer = require('multer');
const fs = require('fs'); // Required for file deletion
const Resource = require('../models/Resource');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the destination folder for uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Specify the filename
  },
});

const upload = multer({ storage }); // Create the multer instance

// Get all resources
router.get('/', authMiddleware.isAuthenticated, async (req, res) => {
  try {
    const resources = await Resource.find();
    res.json(resources);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a specific resource by ID
router.get('/:id', authMiddleware.isAuthenticated, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    res.json(resource);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Upload a resource (Faculty and Admin only)
router.post('/upload', authMiddleware.isAuthenticated, authMiddleware.isFacultyOrAdmin, upload.single('file'), async (req, res) => {
  try {
    const { title, year, subjectCode, examType } = req.body;
    const filePath = req.file.path;

    // Validate required fields
    if (!title || !year || !subjectCode || !examType || !filePath) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const resource = new Resource({ title, year, subjectCode, examType, filePath });
    await resource.save();

    res.status(201).json({ message: 'Resource uploaded successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a resource (Faculty and Admin only)
router.put('/:id', authMiddleware.isAuthenticated, authMiddleware.isFacultyOrAdmin, upload.single('file'), async (req, res) => {
  try {
    const { title, year, subjectCode, examType } = req.body;
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    // Update resource fields
    resource.title = title || resource.title;
    resource.year = year || resource.year;
    resource.subjectCode = subjectCode || resource.subjectCode;
    resource.examType = examType || resource.examType;

    // If a new file is uploaded, update the file path
    if (req.file) {
      // Delete the old file if necessary
      fs.unlink(resource.filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
        }
      });
      resource.filePath = req.file.path;
    }

    await resource.save();
    res.json({ message: 'Resource updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a resource (Admin only)
router.delete('/:id', authMiddleware.isAuthenticated, authMiddleware.isAdmin, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    // Delete the file from the uploads folder
    fs.unlink(resource.filePath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
      }
    });

    // Delete the resource from the database
    await resource.deleteOne();
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;