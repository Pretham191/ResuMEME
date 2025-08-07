const pdfParse = require('pdf-parse');
const fs = require('fs');

/**
 * Extract text from PDF file with improved formatting preservation
 * @param {string} filePath - Path to the PDF file
 * @returns {Promise<string>} - Extracted text with better formatting
 */
async function extractTextFromPDF(filePath) {
  try {
    const pdfBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(pdfBuffer);
    
    let extractedText = data.text;
    
    // Log raw extracted text for debugging
    console.log('Raw extracted text (first 500 chars):', extractedText.substring(0, 500));
    
    // Improved text cleaning that preserves structure
    let cleanText = extractedText
      // Normalize line breaks - convert multiple line breaks to double line breaks
      .replace(/\n{3,}/g, '\n\n')
      // Preserve section breaks but clean up excessive whitespace
      .replace(/[ \t]+/g, ' ')
      // Clean up bullet points and preserve them
      .replace(/[•·▪▫■□▲△◆◇○●]/g, '•')
      // Preserve email and phone patterns
      .replace(/(\S+@\S+\.\S+)/g, '\nEMAIL: $1\n')
      .replace(/(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/g, '\nPHONE: $1\n')
      // Try to identify and format common resume sections
      .replace(/(EXPERIENCE|WORK EXPERIENCE|EMPLOYMENT|CAREER|PROFESSIONAL EXPERIENCE)(?=[\s\n])/gi, '\n\n=== EXPERIENCE SECTION ===\n')
      .replace(/(EDUCATION|ACADEMIC|QUALIFICATIONS)(?=[\s\n])/gi, '\n\n=== EDUCATION SECTION ===\n')
      .replace(/(SKILLS|TECHNICAL SKILLS|CORE COMPETENCIES|ABILITIES)(?=[\s\n])/gi, '\n\n=== SKILLS SECTION ===\n')
      .replace(/(PROJECTS|PERSONAL PROJECTS|KEY PROJECTS)(?=[\s\n])/gi, '\n\n=== PROJECTS SECTION ===\n')
      .replace(/(CERTIFICATIONS?|CERTIFICATES?)(?=[\s\n])/gi, '\n\n=== CERTIFICATIONS SECTION ===\n')
      // Clean up excessive whitespace while preserving intentional breaks
      .replace(/[ \t]{2,}/g, ' ')
      .replace(/\n[ \t]+/g, '\n')
      .replace(/[ \t]+\n/g, '\n')
      .trim();

    // Check if we got meaningful content
    if (cleanText.length < 50) {
      throw new Error('PDF appears to contain very little text. Please ensure your resume has readable text (not scanned images).');
    }

    // Add formatting context for the AI
    const formattedText = `
=== RESUME CONTENT (Extracted from PDF) ===
Note: This text was extracted from a PDF resume. The original formatting may be lost during extraction, but the content structure has been preserved as much as possible.

${cleanText}

=== END OF RESUME CONTENT ===
    `.trim();

    console.log('Cleaned text (first 500 chars):', formattedText.substring(0, 500));
    
    return formattedText;

  } catch (error) {
    console.error('PDF parsing error:', error);
    
    if (error.message.includes('Invalid PDF')) {
      throw new Error('Invalid PDF file. Please upload a valid PDF resume.');
    } else if (error.message.includes('very little text')) {
      throw error;
    } else {
      throw new Error('Failed to extract text from PDF. The file might be corrupted or image-based. Try saving your resume as a new PDF with "Print to PDF" option.');
    }
  }
}

/**
 * Clean up uploaded file
 * @param {string} filePath - Path to the file to delete
 */
function cleanupFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Cleaned up file: ${filePath}`);
    }
  } catch (error) {
    console.error('Error cleaning up file:', error);
  }
}

/**
 * Validate and clean resume text input with better formatting preservation
 * @param {string} text - Raw resume text
 * @returns {string} - Cleaned and validated text
 */
function validateResumeText(text) {
  if (!text || typeof text !== 'string') {
    throw new Error('Resume text is required');
  }

  let cleanText = text.trim();
  
  if (cleanText.length < 50) {
    throw new Error('Resume text is too short. Please provide a more complete resume.');
  }

  if (cleanText.length > 15000) {
    throw new Error('Resume text is too long. Please provide a more concise resume (max 15,000 characters).');
  }

  // Preserve the user's formatting but clean up excessive whitespace
  cleanText = cleanText
    .replace(/\t/g, '    ') // Convert tabs to spaces
    .replace(/[ ]{3,}/g, '  ') // Reduce excessive spaces but keep intentional spacing
    .replace(/\n{4,}/g, '\n\n\n') // Limit excessive line breaks
    .trim();

  // Add context for better AI understanding
  const formattedText = `
=== RESUME CONTENT (Text Input) ===
Note: This is a resume that was pasted as text. The formatting has been preserved from the original input.

${cleanText}

=== END OF RESUME CONTENT ===
  `.trim();

  return formattedText;
}

module.exports = {
  extractTextFromPDF,
  cleanupFile,
  validateResumeText
};