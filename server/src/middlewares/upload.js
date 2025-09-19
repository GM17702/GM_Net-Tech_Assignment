const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random()*1e9);
    cb(null, `${unique}${path.extname(file.originalname)}`);
  }
});
const uploadPDF = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Check if the file is a PDF
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files allowed'), false);
    }

    // Check if file is empty (size <= 0)
    if (file.size <= 0) {
      return cb(new Error('Uploaded PDF file is empty'), false);
    }

    cb(null, true);
  },
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max file size
})

const uploadSignature = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') cb(new Error('Only JPEG or PNG files allowed'), false);
    else cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

module.exports = { upload: uploadPDF, uploadSignature };