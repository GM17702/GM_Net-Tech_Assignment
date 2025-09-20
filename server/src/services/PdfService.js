const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const Document = require('../models/Document');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const { summarize } = require('../utils/summarizer');
const { sendSignedPdf } = require('../utils/emailing');

const uploadsDir = path.join(__dirname, '..', '..', 'uploads');

// Ensure the uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}


const uploadAndParsePDF = async (req) => {

    try 
    {
    if (!req.file) return res.status(400).json({ error: 'PDF file required' });
    const filePath = req.file.path;
    const fileUrl = `/uploads/${path.basename(filePath)}`;

    const dataBuffer = fs.readFileSync(filePath);
    const parsed = await pdfParse(dataBuffer);
    const text = (parsed.text || '').trim();
    if (!text) {
      return res.status(400).json({ error: 'Empty PDF or cannot parse text.' });
    }

    const summary = await summarize(text);

    const doc = new Document({
      originalFilename: req.file.originalname,
      filePath,
      fileUrl,
      parsedText: text,
      summary,
    });

    await doc.save();

    return {
        id: doc._id,
        originalFilename: doc.originalFilename,
        fileUrl: doc.fileUrl,
        summary: doc.summary,
        parsedText: doc.parsedText
    };


    } catch (err) {
        throw err;
    }
};

const uploadSignature = async (req) => {
  try {
    if (!req.file) throw new Error('Signature image file required');

    const filePath = req.file.path; // local path saved by multer
    const fileUrl = `/uploads/${path.basename(filePath)}`;

    // Load DB record
    const doc = await Document.findById(req.params.id);
    if (!doc) throw new Error('Document not found');

    // Clean up old signature file if present
    if (doc.signature?.imagePath) {
      try {
        fs.unlinkSync(doc.signature.imagePath);
      } catch (err) {
        console.warn('Could not delete old signature image:', err.message);
      }
    }

    // Append signature page to existing PDF
    if (!doc.filePath) throw new Error('Original PDF path missing');
    const originalPdfBytes = fs.readFileSync(doc.filePath);
    const pdfDoc = await PDFDocument.load(originalPdfBytes);

    // Get first page size to keep consistency
    const firstPage = pdfDoc.getPage(0);
    const { width, height } = firstPage.getSize();
    const signaturePage = pdfDoc.addPage([width, height]);

    // Embed signature image (PNG or JPG)
    const signatureImageBytes = fs.readFileSync(filePath);
    const signatureImage = filePath.toLowerCase().endsWith('.png')
      ? await pdfDoc.embedPng(signatureImageBytes)
      : await pdfDoc.embedJpg(signatureImageBytes);

    // Compute image size and position
    const imgWidth = width * 0.4;
    const imgHeight = (signatureImage.height / signatureImage.width) * imgWidth;
    const marginLeft = width * 0.05; // 10% of page width
    // const yImage = (height - imgHeight) / 2  + 20;
    const yValue = height - 50;

    // Draw label text above the signature
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    signaturePage.drawText('Signature:', {
      x: marginLeft,
      y: yValue,
      size: 18,
      color: rgb(0, 0, 0),
      font,
    });

    // Draw signature image itself
    signaturePage.drawImage(signatureImage, {
      x: marginLeft,
      y: yValue - imgHeight - 10, // 10 units below the text
      width: imgWidth,
      height: imgHeight,
    });

    // Save new PDF to disk
    const newPdfBytes = await pdfDoc.save();
    const signedPdfPath = path.join(
      path.dirname(doc.filePath),
      `signed-${path.basename(doc.filePath)}`
    );
    fs.writeFileSync(signedPdfPath, newPdfBytes);

    // Save signature info to DB
    doc.signature = {
      imagePath: filePath,
      imageURL: fileUrl,
      filePath: signedPdfPath,
      fileUrl: `/uploads/${path.basename(signedPdfPath)}`,
    };

    await doc.save();
    return doc;
  } catch (err) {
    console.error('Error in uploadSignature:', err);
    throw err;
  }
};

const getDocuments = async () => {
    try {
        const topDocument = await Document.findOne().sort({ createdAt: -1 }).lean();
        
        if (!topDocument) {
            // If no documents exist
            return [];
        }

        const otherDocuments = await Document.find()
            .sort({ createdAt: -1 })
            .skip(1) // Skip the top document
            .select('_id originalFilename signature')
            .lean();
        
        // Combine the top document with other documents
        return [topDocument, ...otherDocuments];
    } catch (err) {
        throw err;
    }
};
const deleteSignature = async (docId) => {
  try {
    const doc = await Document.findById(docId);
    if (!doc) throw new Error('Document not found');

    // Delete signature image file if present
    if (doc.signature && doc.signature.imagePath) {
      try {
        fs.unlinkSync(doc.signature.imagePath);
      } catch (err) {
        console.warn('Could not delete signature image:', err.message);
      }
    }

    // Delete generated signed PDF if present
    if (doc.signature && doc.signature.filePath) {
      try {
        fs.unlinkSync(doc.signature.filePath);
      } catch (err) {
        console.warn('Could not delete signed PDF file:', err.message);
      }
    }

    // Clear signature info
    doc.signature = undefined;

    await doc.save();
    return doc;
  } catch (err) {
    console.error('Error in deleteSignature:', err);
    throw err;
  }
};

const getDocumentById = async (id) => {
    try {
        const doc = await Document.findById(id).lean();
        return doc;
    } catch (err) {
        throw err;
    }
};

const sendSignedPDFEmail = async (docId, email) => {
  try {
    const doc = await Document.findById(docId);
    if (!doc) throw new Error('Document not found');

    if (!doc.signature || !doc.signature.filePath) {
      throw new Error('No signed PDF available to send');
    }

    await sendSignedPdf(email, doc.signature.filePath);
  } catch (err) {
    console.error('Error in sendSignedPDFEmail:', err);
    throw err;
  }
};

module.exports = { uploadAndParsePDF, getDocuments, getDocumentById, uploadSignature, deleteSignature, sendSignedPDFEmail };