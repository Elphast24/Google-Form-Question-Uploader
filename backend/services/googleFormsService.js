const { google } = require('googleapis');
const { oauth2Client } = require('../config/googleAuth');

/**
 * Create Google Form from questions
 */
const createForm = async (title, questions, accessToken, refreshToken) => {
  try {
    // Set OAuth2 credentials
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken
    });

    const forms = google.forms({ version: 'v1', auth: oauth2Client });

    // Create new form
    const createResponse = await forms.forms.create({
      requestBody: {
        info: {
          title: title
        }
      }
    });

    const formId = createResponse.data.formId;

    // Build batch update requests for questions
    const requests = questions.map((q, index) => {
      const request = {
        createItem: {
          item: {
            title: q.question_text,
            questionItem: {
              question: {
                required: q.required || false
              }
            }
          },
          location: {
            index: index
          }
        }
      };

      // Set question type and options
      switch (q.question_type) {
        case 'MULTIPLE_CHOICE':
          request.createItem.item.questionItem.question.choiceQuestion = {
            type: 'RADIO',
            options: (q.options || []).map(opt => ({ value: opt }))
          };
          break;

        case 'CHECKBOX':
          request.createItem.item.questionItem.question.choiceQuestion = {
            type: 'CHECKBOX',
            options: (q.options || []).map(opt => ({ value: opt }))
          };
          break;

        case 'DROPDOWN':
          request.createItem.item.questionItem.question.choiceQuestion = {
            type: 'DROP_DOWN',
            options: (q.options || []).map(opt => ({ value: opt }))
          };
          break;

        case 'SHORT_ANSWER':
          request.createItem.item.questionItem.question.textQuestion = {
            paragraph: false
          };
          break;

        case 'PARAGRAPH':
          request.createItem.item.questionItem.question.textQuestion = {
            paragraph: true
          };
          break;

        case 'LINEAR_SCALE':
          request.createItem.item.questionItem.question.scaleQuestion = {
            low: q.scale_min || 1,
            high: q.scale_max || 5
          };
          break;

        default:
          request.createItem.item.questionItem.question.textQuestion = {
            paragraph: false
          };
      }

      return request;
    });

    // Batch update form with questions
    if (requests.length > 0) {
      await forms.forms.batchUpdate({
        formId: formId,
        requestBody: {
          requests: requests
        }
      });
    }

    // Generate URLs
    const viewUrl = `https://docs.google.com/forms/d/${formId}/viewform`;
    const editUrl = `https://docs.google.com/forms/d/${formId}/edit`;

    return {
      formId: formId,
      viewUrl: viewUrl,
      editUrl: editUrl
    };
  } catch (error) {
    console.error('Google Forms API error:', error);
    throw new Error('Failed to create Google Form');
  }
};

module.exports = {
  createForm
};