import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  Stack,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Save as SaveIcon,
  CloudDone as CloudDoneIcon,
} from '@mui/icons-material';
import QuestionItem, { QuestionLike } from '../components/QuestionItem';
import LoadingScreen from '../components/Loader';
import { generateForm, saveDraft } from '../services/api';
import type { ParsedQuestion } from '@/types/api';
import '../styles/global.css';

interface LocationState {
  questions: ParsedQuestion[];
  fileName?: string;
  draftId?: string | null;
}

const Preview = () => {
  const navigate = useNavigate();
  const location = useLocation() as { state: LocationState | null };
  const [questions, setQuestions] = useState<ParsedQuestion[]>([]);
  const [title, setTitle] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [autoSaveEnabled] = useState(true);

  const handleQuestionUpdate = (index: number, updatedQuestion: QuestionLike) => {
    const newQuestions = [...questions];
    newQuestions[index] = updatedQuestion;
    setQuestions(newQuestions);
  };

  const handleQuestionDelete = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleAddQuestion = () => {
    const newQuestion: ParsedQuestion = {
      question_text: '',
      question_type: 'SHORT_ANSWER',
      required: false,
      options: [],
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleSaveDraft = useCallback(async (silent = false) => {
    if (!title || !title.trim()) {
      if (!silent) setError('Please enter a form title');
      return;
    }

    if (questions.length === 0) {
      if (!silent) setError('Please add at least one question');
      return;
    }

    setSaving(true);
    if (!silent) setError(null);

    try {
      const response = await saveDraft({
        title: title.trim(),
        questions: questions,
        draftId: draftId
      });

      if (!draftId) {
        setDraftId(response.draftId);
      }

      if (!silent) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
      
      console.log('✅ Draft saved successfully');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      console.error('Failed to save draft:', err);
      if (!silent) {
        setError(error.message || 'Failed to save draft');
      }
    } finally {
      setSaving(false);
    }
  }, [title, questions, draftId]);

  useEffect(() => {
    if (location.state?.questions) {
      setQuestions(location.state.questions);
      const fileName = location.state.fileName || 'Untitled Form';
      setTitle(fileName.replace(/\.(docx|txt)$/i, ''));
      setDraftId(location.state.draftId || null);
    } else {
      navigate('/');
    }
  }, [location, navigate]);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (!autoSaveEnabled || !title || questions.length === 0) return;

    const autoSaveTimer = setInterval(() => {
      handleSaveDraft(true); // silent save
    }, 30000); // 30 seconds

    return () => clearInterval(autoSaveTimer);
  }, [title, questions, autoSaveEnabled, handleSaveDraft]);

  const handleCreateForm = async () => {
    if (!title || !title.trim()) {
      setError('Please enter a form title');
      return;
    }

    if (questions.length === 0) {
      setError('Please add at least one question');
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      if (!questions[i]?.question_text || !questions[i].question_text.trim()) {
        setError(`Question ${i + 1} is empty`);
        return;
      }
    }

    setGenerating(true);
    setError(null);

    try {
      const response = await generateForm({
        title: title,
        questions: questions,
        draftId: draftId
      });

      navigate('/generated', {
        state: {
          formData: response,
          title: title,
        },
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error.message || 'Failed to create form. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  if (!questions.length && !location.state) {
    return <LoadingScreen text="Loading questions..." />;
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: 'calc(100vh - 200px)' }}>
      <Container maxWidth="md" sx={{ py: 6 }}>
        {/* Header */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h3" gutterBottom fontWeight={600}>
            Preview & Edit Questions
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Review and customize your questions before creating the Google Form
          </Typography>
        </Box>

        {/* Form Title */}
        <Box sx={{ mb: 4 }}>
            <TextField
            fullWidth
            label="Form Title"
            value={title || ''}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter form title"
            required
          />
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Questions List */}
        <Stack spacing={3} sx={{ mb: 3 }}>
          {questions.map((question, index) => (
             <QuestionItem
              key={index}
              question={question}
              index={index}
              onUpdate={handleQuestionUpdate}
              onDelete={handleQuestionDelete}
            />
          ))}
        </Stack>

        {/* Add Question Button */}
        <Button
          variant="outlined"
          fullWidth
          startIcon={<AddIcon />}
          onClick={handleAddQuestion}
          sx={{ mb: 4 }}
        >
          Add Question
        </Button>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          {/* Save Draft Button */}
          <Button
            variant="outlined"
            size="large"
            startIcon={saving ? <CloudDoneIcon /> : <SaveIcon />}
            onClick={() => handleSaveDraft(false)}
            disabled={saving || generating}
            sx={{ minWidth: 200 }}
          >
            {saving ? 'Saving...' : draftId ? 'Update Draft' : 'Save Draft'}
          </Button>

          {/* Create Form Button */}
          <Button
            variant="contained"
            size="large"
            startIcon={generating ? null : <SaveIcon />}
            onClick={handleCreateForm}
            disabled={generating || saving}
            sx={{ minWidth: 200 }}
          >
            {generating ? <LoadingScreen text="" /> : 'Create Google Form'}
          </Button>
        </Box>

        {/* Auto-save indicator */}
        {draftId && (
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ display: 'block', textAlign: 'center', mt: 2 }}
          >
            {autoSaveEnabled ? '✓ Auto-saving enabled' : 'Auto-save disabled'}
          </Typography>
        )}
      </Container>

      {/* Success Snackbar */}
      <Snackbar
        open={saveSuccess}
        autoHideDuration={3000}
        onClose={() => setSaveSuccess(false)}
        message="Draft saved successfully"
      />
    </Box>
  );
};

export default Preview;
