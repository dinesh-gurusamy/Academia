const path = require('path');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
 // add this if not already

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'academia-resources',
    resource_type: 'raw', // ✅ necessary
    allowed_formats: ['pdf'],
    public_id: (req, file) => {
      const ext = path.extname(file.originalname); // e.g., .pdf
      const base = path.basename(file.originalname, ext); // e.g., dummy
      return `${base}-${Date.now()}${ext}`; // e.g., dummy-1750078123.pdf ✅
    },
  },
});



module.exports = {
  cloudinary,
  storage,
};