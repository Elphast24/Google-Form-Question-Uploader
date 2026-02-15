const multer = require('multer');

// Configure multer for memory storage (no disk storage)
const storage = multer.memoryStorage();

// File filter for DOCX and TXT only
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'text/plain' // .txt
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only DOCX and TXT files are allowed.'), false);
  }
};

// Multer configuration with 10MB file size limit
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: fileFilter
});

module.exports = upload;