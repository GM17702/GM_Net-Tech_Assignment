const multer = require('multer');

// Error handler middleware to catch Multer-specific errors
function errorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
}

module.exports = { errorHandler };