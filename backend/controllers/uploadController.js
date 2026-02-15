const fileParserService = require('../services/fileParserService');
const geminiService = require('../services/geminiService');

/**
 * Upload file and parse questions using Gemini AI
 */
const uploadAndParse = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('📂 Received file:', req.file.originalname);

    // Parse file content (DOCX, PDF, TXT, etc.)
    const fileContent = await fileParserService.parseFile(req.file);

    console.log('📝 Parsed file content (first 200 chars):', fileContent.slice(0, 200));

    // Extract questions using Gemini AI
    const questions = await geminiService.extractQuestions(fileContent);

    console.log('✅ Questions extracted:', questions.length);

    return res.status(200).json({
      success: true,
      questions,
      message: questions.length > 0
        ? 'File processed successfully'
        : 'File processed but no questions were extracted'
    });

  } catch (error) {
    console.error('❌ Upload and parse error:', error);
    return res.status(500).json({ error: 'Failed to extract questions' });
  }
};

module.exports = {
  uploadAndParse
};
