const express = require('express');
const router = express.Router();
const { generateTests, generateCode, chatWithAI } = require('../controllers/aiController');

router.post('/generate-tests', generateTests);
router.post('/generate-code', generateCode);
router.post('/chat', chatWithAI);

module.exports = router;
