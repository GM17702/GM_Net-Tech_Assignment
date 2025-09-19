
const { uploadAndParsePDF, getDocuments, getDocumentById, uploadSignature, deleteSignature } = require('../services/PdfService');


async function pdfUpload(req, res) {
  try 
  {
    const { id, originalFilename, fileUrl, summary, parsedText } =  await uploadAndParsePDF(req);

    return res.json({
      id,
      originalFilename,
      fileUrl,
      summary,
      parsedTextSnippet: parsedText.slice(0, 3000)
    });

  } catch (err) {
    console.error('pdf Upload error: ', err);
    return res.status(400).json({ error: 'PDF upload failed: ' + err.message || '' });
  }
}

async function SignatureUpload(req, res) {
  try 
  {
    const doc = await uploadSignature(req);
    return res.json(doc);

  } catch (err) {
    console.error('Signature Upload error: ', err);
    return res.status(400).json({ error: 'Signature upload failed: ' + err.message || '' });
  }
}

async function SignatureDeletion(req, res) {
  try 
  {
    const doc = await deleteSignature(req.params.id);
    return res.json(doc);

  } catch (err) {
    console.error('Signature Deletion error: ', err);
    return res.status(400).json({ error: 'Signature deletion failed: ' + err.message || '' });
  }
}

async function getAllDocuments(req, res)
{
  try 
  {
    const docs = await getDocuments();
    return res.json(docs);
  } catch (err) {
    console.error('getAllDocuments error', err);
    return res.status(400).json({ error: 'Server error: ' + err.message || '' });
  }

};

async function getDocument(req, res) {
  try {
    const doc = await getDocumentById(req.params.id);
    if (!doc) return res.status(400).json({ error: 'Document not found' });
    res.json(doc);
  } catch (err) {
    console.error('getDocument error', err);
    res.status(400).json({ error: 'Server error: ' + err.message || '' });
  }
}


module.exports = { pdfUpload, getDocument, getAllDocuments, SignatureUpload, SignatureDeletion };
