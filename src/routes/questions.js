const express = require('express');
const router = express.Router();
const { generate } = require('../controllers/questionController');
const { protect } = require('../middleware/auth');

router.post('/generate', protect, generate);

module.exports = router;