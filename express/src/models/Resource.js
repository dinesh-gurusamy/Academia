import mongoose from 'mongoose'

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  year: { type: Number, required: true },
  subjectCode: { type: String, required: true },
  examType: { type: String, required: true },
  filePath: { type: String, required: true },
  cloudinaryId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Resource = mongoose.model('Resource', resourceSchema);
export default Resource;