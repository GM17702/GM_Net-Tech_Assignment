const express = require('express');

const {
  pdfUpload,
  getDocument,
  getAllDocuments,
  SignatureUpload,
  SignatureDeletion
} = require('../controllers/PdfController');

const router = express.Router();
const { upload, uploadSignature } = require('../middlewares/upload');
const { checkEmptyPDF } = require('../middlewares/pdfEvaluator');

router.post('/uploadPDF', upload.single('file'), checkEmptyPDF, pdfUpload);
router.post('/uploadSignature/:id', uploadSignature.single('file'), SignatureUpload);
router.get('/:id', getDocument);
router.get('/', getAllDocuments);
router.delete('/deleteSignature/:id', SignatureDeletion);

module.exports = router;
