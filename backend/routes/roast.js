const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { extractTextFromPDF, cleanupFile, validateResumeText } = require('../services/pdfService');
const { roastResume, getAvailableModes } = require('../services/groqService');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Get available roasting modes
router.get('/modes', (req, res) => {
  try {
    const modes = getAvailableModes();
    res.json({ modes });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get roasting modes' });
  }
});

// Roast resume from text input
router.post('/text', async (req, res) => {
  try {
    const { text, mode = 'smart-critic' } = req.body;

    // Validate input
    const cleanText = validateResumeText(text);

    // Generate roast
    const result = await roastResume(cleanText, mode);

    res.json({
      success: true,
      result: result,
      input_type: 'text',
      character_count: cleanText.length
    });

  } catch (error) {
    console.error('Text roast error:', error);
    res.status(400).json({ 
      error: error.message || 'Failed to roast resume text' 
    });
  }
});

// Roast resume from PDF upload
router.post('/pdf', upload.single('resume'), async (req, res) => {
  let filePath = null;

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    filePath = req.file.path;
    const mode = req.body.mode || 'smart-critic';

    // Extract text from PDF
    const resumeText = await extractTextFromPDF(filePath);
    
    // Generate roast
    const result = await roastResume(resumeText, mode);

    res.json({
      success: true,
      result: result,
      input_type: 'pdf',
      filename: req.file.originalname,
      character_count: resumeText.length
    });

  } catch (error) {
    console.error('PDF roast error:', error);
    res.status(400).json({ 
      error: error.message || 'Failed to roast PDF resume' 
    });
  } finally {
    // Always clean up the uploaded file
    if (filePath) {
      cleanupFile(filePath);
    }
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    message: 'Resume roaster is ready to burn! 🔥',
    groq_configured: !!process.env.GROQ_API_KEY
  });
});

module.exports = router;