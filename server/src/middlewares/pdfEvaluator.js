// Middleware to check if PDF has 0 pages or no text
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, '..', '..', 'uploads');

const checkEmptyPDF = (req, res, next) => {
  const filePath = path.join(uploadsDir, req.file.filename);

  // Read the uploaded PDF file as a buffer
  fs.readFile(filePath, (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading file' });
    }

    // Parse the PDF data with pdf-parse
    pdfParse(data).then((pdfData) => {
      // Check if PDF has 0 pages
      if (pdfData.numpages === 0) {
        return res.status(400).json({ error: 'PDF file has no pages' });
      }

      // Check if there is any text in the PDF
      if (!pdfData.text || pdfData.text.trim().length === 0) {
        return res.status(400).json({ error: 'PDF file has no readable text (it might be image-only or empty)' });
      }

      // If everything is fine, proceed to the next middleware
      next();
    }).catch((err) => {
      return res.status(400).json({ error: 'Error processing PDF file' });
    });
  });
};

module.exports = { checkEmptyPDF };
