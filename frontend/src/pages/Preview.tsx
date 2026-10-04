import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Cloud, Save, Plus } from 'lucide-react';
import gsap from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { useGSAPAnimation } from '@/hooks/useGSAPAnimation';
import QuestionItem from '@/components/QuestionItem';
import LoadingScreen from '@/components/Loader';
import { generateForm, saveDraft } from '@/services/api';
import type { ParsedQuestion } from '@/types/api';
import '../styles/global.css';

gsap.registerPlugin(MorphSVGPlugin);

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
  const [_saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [autoSaveEnabled] = useState(true);
  const { reduceMotion } = useGSAPAnimation();
  const clipboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!reduceMotion && clipboardRef.current) {
      gsap.from(clipboardRef.current, {
        y: -100,
        rotateZ: -3,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });
      gsap.from('.clip-metal', {
        scale: 0,
        rotateZ: 180,
        duration: 0.6,
        ease: 'back.out(2)',
        delay: 0.5,
      });
    }
  }, [reduceMotion]);

  const handleQuestionUpdate = (index: number, updatedQuestion: ParsedQuestion) => {
    const newQuestions = [...questions];
    newQuestions[index] = updatedQuestion;
    setQuestions(newQuestions);
  };

  const handleQuestionDelete = (index: number) => {
    if (!reduceMotion) {
      const card = document.querySelector(`[data-q="${index}"]`);
      if (card) {
        gsap.to(card, {
          scale: 0.3,
          rotateZ: 15,
          x: 200,
          opacity: 0,
          duration: 0.5,
          ease: 'power2.in',
          onComplete: () => {
            setQuestions(questions.filter((_, i) => i !== index));
          },
        });
        return;
      }
    }
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
        draftId: draftId,
      });

      if (!draftId) {
        setDraftId(response.draftId);
      }

      if (!silent) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      if (!silent) {
        setError(err instanceof Error ? err.message : 'Failed to save draft');
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

  useEffect(() => {
    if (!autoSaveEnabled || !title || questions.length === 0) return;

    const autoSaveTimer = setInterval(() => {
      handleSaveDraft(true);
    }, 30000);

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
      if (!questions[i]?.question_text || !questions[i]?.question_text.trim()) {
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
        draftId: draftId,
      });

      navigate('/generated', {
        state: {
          formData: response,
          title: title,
        },
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create form. Please try again.'
      );
    } finally {
      setGenerating(false);
    }
  };

  if (!questions.length && !location.state) {
    return <LoadingScreen text="Loading questions..." />;
  }

  return (
    <div className="page-maritime">
      <div className="preview-page">
        <div className="preview-rail" />
        <main className="home-page">
          <div className="clipboard" ref={clipboardRef}>
            <div className="clip-metal" />

            <div className="action-header">
              <h2 className="action-title">Preview & Edit Questions</h2>
              <p className="action-subtitle">Review and customize your questions before creating the Google Form</p>
            </div>

            <div className="form-title-row">
              <input
                type="text"
                value={title || ''}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter form title"
                required
                className="form-input form-title-input"
              />
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="question-form-grid">
              {questions.map((question, index) => (
                <QuestionItem
                  key={index}
                  question={question}
                  index={index}
                  onUpdate={handleQuestionUpdate}
                  onDelete={handleQuestionDelete}
                />
              ))}
            </div>

            <div className="action-buttons-ct">
              <button
                className="btn-pill btn-pill-white"
                onClick={handleAddQuestion}
                disabled={generating || saveSuccess}
              >
                Add Question
              </button>

              <button
                className="btn-pill btn-pill-coral"
                onClick={() => handleSaveDraft(false)}
                disabled={saveSuccess}
              >
                {saveSuccess ? 'Saved' : 'Save Draft'}
              </button>

              <button
                className="btn-pill btn-pill-outline"
                onClick={handleCreateForm}
                disabled={generating || saveSuccess}
              >
                {generating ? 'PROCESSING...' : 'Create Google Form'}
              </button>
            </div>
          </div>
        </main>
      </div>

      <div className="snackbar-banner" />
    </div>
  );
};

export default Preview;