
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const documentsRouter = require('./routes/document');
const { errorHandler } = require('./middlewares/errorHandler');

dotenv.config();


const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); // allow base64 images in JSON
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files (PDFs and Signatures)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// api
app.use('/api/documents', documentsRouter);


// simple root
app.get('/', (req, res) => res.send('PDF Backend API'));
app.use(errorHandler);
// connect DB and start
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || '';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err.message);
    process.exit(1);
});