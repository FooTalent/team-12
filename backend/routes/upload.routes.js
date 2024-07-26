const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');
const { uploadFile } = require('../controllers/upload.controller');

// Ruta para subir un solo archivo
router.post('/', upload.single('image'), uploadFile);

module.exports = router;
