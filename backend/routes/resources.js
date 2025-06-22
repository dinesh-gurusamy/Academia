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
        filePath: req.file.path,
        cloudinaryId: req.file.filename  // ✅ Cloudinary URL
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

      // Update text fields
      resource.title = title || resource.title;
      resource.year = year || resource.year;
      resource.subjectCode = subjectCode || resource.subjectCode;
      resource.examType = examType || resource.examType;

      // 🧼 Replace PDF if new file uploaded
      if (req.file) {
        // ✅ Delete old file from Cloudinary
        if (resource.cloudinaryId) {
          await cloudinary.uploader.destroy(resource.cloudinaryId, {
            resource_type: 'raw',
          });
        }

        // ✅ Save new file details
        resource.filePath = req.file.path;
        resource.cloudinaryId = req.file.filename;
      }

      await resource.save();

      res.json({
        message: 'Resource updated successfully',
        fileUrl: resource.filePath,
      });
    } catch (error) {
      console.error('Edit error:', error.message);
      res.status(500).json({ error: 'Error while updating the resource' });
    }
  }
);


// Delete a resource

router.delete('/:id', authMiddleware.isAuthenticated, authMiddleware.isAdmin, async (req, res) => {
  try {
    // Find the resource in MongoDB
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    // Construct public_id using folder and saved filename (cloudinaryId)
    const publicId = resource.cloudinaryId;

    console.log('➡️ Deleting from Cloudinary:', publicId);

    // Delete file from Cloudinary (for non-images: use `resource_type: 'raw'`)
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'raw',
    });

    console.log('✅ Cloudinary response:', result);

    // Delete resource from MongoDB
    await resource.deleteOne();

    res.json({ message: 'Resource and file deleted successfully' });
  } catch (error) {
    console.error('❌ Deletion error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
module.exports = router;