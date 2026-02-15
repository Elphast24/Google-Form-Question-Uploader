const express = require('express');
const authRoutes = require('./auth');
const uploadRoutes = require('./upload');
const formRoutes = require('./forms');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/upload', uploadRoutes);
router.use('/forms', formRoutes);

module.exports = router;