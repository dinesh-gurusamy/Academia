const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Resource = require('../models/Resource');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Get all resources
router.get('/', authMiddleware.isAuthenticated, async (req, res) => {
  try {
    const resources = await Resource.find();
    res.json(resources);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Upload a resource
router.post('/upload', authMiddleware.isAuthenticated, authMiddleware.isFacultyOrAdmin, upload.single('file'), async (req, res) => {
  try {
    const { title, year, subjectCode, examType } = req.body;
    if (!title || !year || !subjectCode || !examType || !req.file) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    const resource = new Resource({
      title,
      year,
      subjectCode,
      examType,
      filePath: fileUrl, // <-- full public URL saved
    });

    await resource.save();

    res.status(201).json({ message: 'Resource uploaded successfully', fileUrl: resource.filePath });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Download resource by ID
router.get('/:id', authMiddleware.isAuthenticated, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ error: 'Resource not found' });
    res.json(resource);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update resource
router.put('/:id', authMiddleware.isAuthenticated, authMiddleware.isFacultyOrAdmin, upload.single('file'), async (req, res) => {
  try {
    const { title, year, subjectCode, examType } = req.body;
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ error: 'Resource not found' });

    // Update fields
    resource.title = title || resource.title;
    resource.year = year || resource.year;
    resource.subjectCode = subjectCode || resource.subjectCode;
    resource.examType = examType || resource.examType;

    if (req.file) {
      // Delete old file
      fs.unlink(path.join(__dirname, '..', resource.filePath), (err) => {
        if (err) console.error('Error deleting file:', err);
      });
      resource.filePath = `/uploads/${req.file.filename}`;
    }

    await resource.save();
    res.json({ message: 'Resource updated successfully', fileUrl: resource.filePath });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete resource
router.delete('/:id', authMiddleware.isAuthenticated, authMiddleware.isAdmin, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ error: 'Resource not found' });

    // Delete file
    fs.unlink(path.join(__dirname, '..', resource.filePath), (err) => {
      if (err) console.error('Error deleting file:', err);
    });

    await resource.deleteOne();
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
