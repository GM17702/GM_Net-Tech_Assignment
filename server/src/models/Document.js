const mongoose = require('mongoose');

const SignatureSchema = new mongoose.Schema({
  imagePath: String,
  imageURL: String,
  filePath: String,
  fileUrl: String,
});

const DocumentSchema = new mongoose.Schema({
  originalFilename: String,
  filePath: String, // server path to original pdf
  fileUrl: String, // served url
  parsedText: String,
  summary: String,
  signature: SignatureSchema,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Document', DocumentSchema);