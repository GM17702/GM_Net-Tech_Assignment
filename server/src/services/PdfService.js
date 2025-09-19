const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const Document = require('../models/Document');
const { summarize } = require('../utils/summarizer');

const uploadsDir = path.join(__dirname, '..', '..', 'uploads');

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
    try 
    {
        if (!req.file) throw new Error('Signature image file required');
        const filePath = req.file.path;
        const fileUrl = `/uploads/${path.basename(filePath)}`;

        const doc = await Document.findById(req.params.id);
        if (!doc) throw new Error('Document not found');
        if (doc.signature && doc.signature.imagePath) {
            fs.unlinkSync(doc.signature.imagePath);
        }

        doc.signature = {
            imagePath: filePath,
            imageURL: fileUrl
        };

        await doc.save();
        return doc;

    } catch (err) {
        throw err;
    }
}

const getDocuments = async () => {
    try {
        const topDocument = await Document.findOne().sort({ createdAt: -1 }).lean();
        
        const otherDocuments = await Document.find()
            .sort({ createdAt: -1 })
            .skip(1)
            .select('_id originalFilename signature')
            .lean();
        
        return [topDocument, ...otherDocuments];
    } catch (err) {
        throw err;
    }
};

const deleteSignature = async (docId) => {
    try {
        const doc = await Document.findById(docId);
        if (!doc) throw new Error('Document not found');

        if (doc.signature && doc.signature.imagePath) {
            fs.unlinkSync(doc.signature.imagePath);
        }
        doc.signature = undefined;
        await doc.save();
        return doc;
    } catch (err) {
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

module.exports = { uploadAndParsePDF, getDocuments, getDocumentById, uploadSignature, deleteSignature };