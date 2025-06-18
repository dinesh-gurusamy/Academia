const express = require('express');
const multer = require('multer');
const { storage, cloudinary } = require('../config/cloudinary'); // cloudinary config
const Resource = require('../models/Resource');
const authMiddleware = require('../middleware/auth');
const path = require('path');
const { URL } = require('url');

const router = express.Router();
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
router.post(
  '/upload',
  authMiddleware.isAuthenticated,
  authMiddleware.isFacultyOrAdmin,
  upload.single('file'),
  async (req, res) => {
    try {
      const { title, year, subjectCode, examType } = req.body;
      if (!title || !year || !subjectCode || !examType || !req.file) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const resource = new Resource({
        title,
        year,
        subjectCode,
        examType,
        filePath: req.file.path, // ✅ Cloudinary URL
      });

      await resource.save();

      res.status(201).json({
        message: 'Resource uploaded successfully',
        fileUrl: resource.filePath,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Get a specific resource by ID
router.get('/:id', authMiddleware.isAuthenticated, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ error: 'Resource not found' });
    res.json(resource);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a resource
router.put(
  '/:id',
  authMiddleware.isAuthenticated,
  authMiddleware.isFacultyOrAdmin,
  upload.single('file'),
  async (req, res) => {
    try {
      const { title, year, subjectCode, examType } = req.body;
      const resource = await Resource.findById(req.params.id);
      if (!resource) return res.status(404).json({ error: 'Resource not found' });

      resource.title = title || resource.title;
      resource.year = year || resource.year;
      resource.subjectCode = subjectCode || resource.subjectCode;
      resource.examType = examType || resource.examType;

      if (req.file) {
        // Optional: delete old Cloudinary file by public_id
        const publicId = resource.filePath.split('/').pop().split('.')[0];
        try {
          await cloudinary.uploader.destroy(`academia-resources/${publicId}`);
        } catch (err) {
          console.error('Cloudinary delete failed:', err.message);
        }

        resource.filePath = req.file.path;
      }

      await resource.save();
      res.json({
        message: 'Resource updated successfully',
        fileUrl: resource.filePath,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Delete a resource

router.delete('/:id', authMiddleware.isAuthenticated, authMiddleware.isAdmin, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ error: 'Resource not found' });

    // Decode and extract filename from Cloudinary URL
    const decodedUrl = decodeURIComponent(resource.filePath);
    const parsedUrl = new URL(decodedUrl);
    const segments = parsedUrl.pathname.split('/');
   const filenameWithExt = decodeURIComponent(segments[segments.length - 1]);// Already decoded from above
    const publicId = `academia-resources/${path.parse(filenameWithExt).name}`; // no extension

    console.log('Cloudinary Deletion Debug:');
    console.log('Original URL:', resource.filePath);
    console.log('Decoded URL:', decodedUrl);
    console.log('Filename:', filenameWithExt);
    console.log('Final public_id:', publicId);

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'raw'
    });

    console.log('Cloudinary delete result:', result);

    await resource.deleteOne();
    res.json({ message: 'Resource and file deleted successfully' });
  } catch (error) {
    console.error('Deletion failed:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;