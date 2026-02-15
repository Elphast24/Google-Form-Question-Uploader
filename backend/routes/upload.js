const express = require('express');
const multer = require('multer');
const authenticateUser = require('../middleware/auth');
const { uploadAndParse } = require('../controllers/uploadController');

const router = express.Router();

// Configure multer for file uploads (in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Protect route with Firebase auth
router.post('/', authenticateUser, upload.single('file'), uploadAndParse);

module.exports = router;
