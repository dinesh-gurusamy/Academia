const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'academia-resources',
    resource_type: 'raw', // ✅ This is critical for PDFs
    allowed_formats: ['pdf'], // Optional: restrict to PDFs
    public_id: (req, file) => file.originalname.split('.')[0], // Keep original filename (without extension)
  },
});

module.exports = {
  cloudinary,
  storage,
};