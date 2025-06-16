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
    resource_type: 'raw',
    allowed_formats: ['pdf'],
    public_id: (req, file) => {
      const originalName = file.originalname.split('.')[0]; // filename without extension
      return `${originalName}-${Date.now()}.pdf`; // ✅ ensures .pdf in URL
    },
  },
});


module.exports = {
  cloudinary,
  storage,
};