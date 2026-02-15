const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Extract questions from file content using Gemini AI
 */
const extractQuestions = async (fileContent) => {
  try {
    if (!fileContent || fileContent.trim().length === 0) {
      console.warn('⚠️ Empty file content passed to Gemini');
      return [];
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
You are a highly specialized AI assistant for Google Forms API data preparation. Your task is to analyze the provided recruitment form text and extract all discernible questions and section headers, structuring the output as a single JSON array of objects.

For each extracted item, determine if it is a **Question** or a **Section Header**.

### For Question Items:
Include the following keys:
1.  **question_text**: The full text of the question.
2.  **question_type**: Map the field type to one of the following Google Forms API equivalents:
    * **SHORT_ANSWER** (for single-line text inputs like Name, Email, Phone)
    * **PARAGRAPH** (for multi-line text inputs like Address, Descriptions, Explanations)
    * **MULTIPLE_CHOICE** (for radio buttons/single selections with options)
    * **CHECKBOX** (for multiple selections with options)
    * **DATE** (for date inputs like Date of Birth, Start Date)
    * **FILE_UPLOAD** (for file attachments like Resume, Portfolio)
3.  **options**: An array of strings containing all provided choices (only for MULTIPLE_CHOICE and CHECKBOX). If an "Other" option is present, include it as an option.
4.  **required**: Boolean (true/false). Assume a question is required unless explicitly labeled (e.g., "Optional").

### For Section Header Items:
Include the following keys:
1.  **item_type**: Always "SECTION_HEADER".
2.  **title**: The title of the section (e.g., "Section 1: Personal Information").

**Instructions:**
* Treat all numbered items as questions.
* Treat the text preceding each numbered group (e.g., "Section 1: Personal Information") as a section header.
* **Crucially, do not include fields for scale_min or scale_max as they are not applicable to the provided source text.**
* Return **ONLY** a valid JSON array, without any surrounding markdown (e.g., json fence) or extra explanation.

**Text to analyze:**
${fileContent}

**Expected JSON format snippet:**
[
  {
    "item_type": "SECTION_HEADER",
    "title": "Section 1: Personal Information"
  },
  {
    "question_text": "1. Full Name:",
    "question_type": "SHORT_ANSWER",
    "required": true
  },
  {
    "question_text": "10. What are your strongest professional skills?",
    "question_type": "CHECKBOX",
    "options": ["Teamwork", "Communication", "Problem-solving", "Technical expertise", "Leadership", "Other"],
    "required": true
  }
]
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    // Clean JSON
    let jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    // Parse JSON safely
    let questions;
    try {
      questions = JSON.parse(jsonText);
    } catch (err) {
      console.error('❌ Failed to parse Gemini JSON:', jsonText);
      return [];
    }

    if (!Array.isArray(questions)) {
      console.warn('⚠️ Gemini returned non-array, forcing empty array');
      return [];
    }

    return questions;

  } catch (error) {
    console.error('❌ Gemini AI error:', error);
    return [];
  }
};

module.exports = {
  extractQuestions
};
