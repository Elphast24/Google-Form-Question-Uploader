const express = require('express');
const formController = require('../controllers/formController');
const authenticateUser = require('../middleware/auth');

const router = express.Router();

router.post('/drafts', authenticateUser, formController.saveDraft);
router.get('/drafts', authenticateUser, formController.getUserDrafts);
router.get('/drafts/:draftId', authenticateUser, formController.getDraftById);
router.delete('/drafts/:draftId', authenticateUser, formController.deleteDraft);


/**
 * POST /api/forms/generate
 * Generate Google Form from parsed questions
 * Request: { title: string, questions: Array }
 * Response: { formId, viewUrl, editUrl }
 */
router.post('/generate', authenticateUser, formController.generateForm);

/**
 * GET /api/forms
 * Get all forms created by authenticated user
 * Response: { forms: Array }
 */
router.get('/', authenticateUser, formController.getUserForms);

module.exports = router;