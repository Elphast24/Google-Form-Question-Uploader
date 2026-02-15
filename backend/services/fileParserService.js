const mammoth = require('mammoth');

/**
 * Parse uploaded file based on MIME type
 */
const parseFile = async (file) => {
  try {
    const mimeType = file.mimetype;

    if (mimeType === 'text/plain') {
      // Parse TXT file
      return file.buffer.toString('utf-8');
    } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // Parse DOCX file
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      return result.value;
    } else {
      throw new Error('Unsupported file type');
    }
  } catch (error) {
    console.error('File parsing error:', error);
    throw new Error('Failed to parse file');
  }
};

module.exports = {
  parseFile
};