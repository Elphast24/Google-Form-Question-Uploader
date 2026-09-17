import {
  useRef,
  useState,
  useCallback,
} from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Sparkles, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useGSAPAnimation } from '@/hooks/useGSAPAnimation';
import { useFormState } from '@/hooks/useFormState';
import { useParsingProgress } from '@/hooks/useParsingProgress';
import { VALID_FILE_TYPES, MAX_FILE_SIZE } from '@/hooks/useFileUpload';
import { uploadFile, generateForm } from '@/services/api';
import { sanitizeParsedText } from '@/lib/sanitization';
import type { Question, QuestionType, ParsingStage } from '@/types/form';
import type { ParsedQuestion, UploadResponse, GenerateFormResponse } from '@/types/api';
import { TYPES_REQUIRING_OPTIONS } from '@/types/form';
import { Button } from '@/components/shared/Button';
import { Spinner } from '@/components/shared/Spinner';
import { ErrorBanner } from '@/components/shared/ErrorBanner';
import { SplitPane } from '@/components/layout/SplitPane';
import { LeftPane } from '@/components/layout/LeftPane';
import { RightPane } from '@/components/layout/RightPane';
import { WorkspaceHeader } from '@/components/layout/WorkspaceHeader';
import { WorkspaceFooter } from '@/components/layout/WorkspaceFooter';
import { DropZone } from '@/components/upload/DropZone';
import { FilePreview } from '@/components/upload/FilePreview';
import { DocViewer } from '@/components/document/DocViewer';
import { FormPreview } from '@/components/form/FormPreview';
import { ParsingProgress } from '@/components/progress/ParsingProgress';
import { PARSING_MILESTONES } from '@/lib/constants';

const validateFile = (file: File): string | null => {
  if (!VALID_FILE_TYPES.has(file.type)) {
    return 'Please upload only DOCX or TXT files';
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'File size must be less than 10MB';
  }
  return null;
};

const parseBackendQuestions = (raw: ParsedQuestion[]): Question[] => {
  return raw
    .filter((q) => q.item_type !== 'SECTION_HEADER')
    .map((q) => ({
      id: crypto.randomUUID(),
      question_text: q.question_text || '',
      question_type: (q.question_type?.toUpperCase() as QuestionType) ?? 'SHORT_ANSWER',
      required: q.required ?? false,
      options: q.options ?? [],
      scale_min: q.scale_min,
      scale_max: q.scale_max,
    }));
};

const readTextFile = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string ?? '');
    reader.readAsText(file);
  });
};

export const WorkspacePage = () => {
  const navigate = useNavigate();
  const [formState, formActions] = useFormState();
  const { status: parseStatus, activeIndex, start: startParsing, cancel: cancelParsing } = useParsingProgress(PARSING_MILESTONES);
  const { reduceMotion } = useGSAPAnimation();
  const { user, signIn } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const [docContent, setDocContent] = useState('');
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const file = formState.file;
  const questions = formState.questions;
  const title = formState.title;
  const formError = formState.error;
  const parsingStage = formState.parsingStage;

  const isParsing = parsingStage === 'parsing';
  const isReady = parsingStage === 'ready';
  const isIdle = parsingStage === 'idle' && !file;

  useGSAP(() => {
    if (!containerRef.current || reduceMotion) return;
    const ctx = gsap.context(() => {}, containerRef);
    gsap.from(containerRef.current, {
      opacity: 0,
      y: 24,
      duration: 0.5,
      ease: 'power2.out',
    });
    return () => ctx.revert();
  }, [reduceMotion]);

  const handleFileSelect = useCallback(
    async (selectedFile: File) => {
      const validationError = validateFile(selectedFile);
      if (validationError) {
        formActions.setError(validationError);
        return;
      }

      if (!user) {
        try {
          await signIn();
        } catch {
          formActions.setError('Please sign in to continue');
          return;
        }
      }

      formActions.setFile(selectedFile);
      formActions.setParsingStage('parsing');
      formActions.setError(null);
      setUploading(true);
      startParsing();

      try {
        if (selectedFile.type === 'text/plain') {
          const text = await readTextFile(selectedFile);
          setDocContent(text);
        } else {
          setDocContent('[DOCX document — text extracted by Gemini AI backend]');
        }

        const response: UploadResponse = await uploadFile(selectedFile);
        const parsedQuestions = parseBackendQuestions(response.questions || []);
        const fileTitle = response.fileName
          ? response.fileName.replace(/\.(docx|txt)$/i, '')
          : selectedFile.name.replace(/\.(docx|txt)$/i, '');

        formActions.setQuestions(parsedQuestions);
        formActions.setTitle(fileTitle);
        formActions.setParsingStage('ready');
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to process file. Please try again.';
        formActions.setError(msg);
        formActions.setParsingStage('error');
      } finally {
        setUploading(false);
        cancelParsing();
      }
    },
    [formActions, startParsing, cancelParsing, user, signIn]
  );

  const handleRemoveFile = useCallback(() => {
    formActions.setFile(null);
    formActions.setQuestions([]);
    formActions.setTitle('');
    formActions.setParsingStage('idle');
    formActions.setError(null);
    setDocContent('');
    cancelParsing();
  }, [formActions, cancelParsing]);

  const handleTitleChange = useCallback(
    (newTitle: string) => {
      formActions.setTitle(newTitle);
    },
    [formActions]
  );

  const handleUpdateQuestion = useCallback(
    (id: string, patch: Partial<Question>) => {
      formActions.updateQuestion(id, patch);
    },
    [formActions]
  );

  const handleDeleteQuestion = useCallback(
    (id: string) => {
      formActions.deleteQuestion(id);
    },
    [formActions]
  );

  const handleAddQuestion = useCallback(() => {
    formActions.addQuestion();
  }, [formActions]);

  const handleGenerateForm = useCallback(async () => {
    if (!title.trim() || questions.length === 0) return;

    for (const q of questions) {
      if (!q.question_text.trim()) {
        formActions.setError('All questions must have text');
        return;
      }
    }

    setGenerating(true);
    formActions.setError(null);

    try {
      const response: GenerateFormResponse = await generateForm({
        title: title,
        questions: questions.map((q) => ({
          question_text: q.question_text,
          question_type: q.question_type,
          required: q.required,
          options: q.options,
          scale_min: q.scale_min,
          scale_max: q.scale_max,
        })),
        draftId: null,
      });

      navigate('/generated', {
        state: {
          formData: response,
          title: title,
        },
      });
    } catch (err) {
      formActions.setError(
        err instanceof Error ? err.message : 'Failed to create form. Please try again.'
      );
    } finally {
      setGenerating(false);
    }
  }, [title, questions, formActions, navigate]);

  const leftPaneContent = (
    <>
      {isIdle && (
        <DropZone
          file={null}
          parsingStage={parsingStage}
          disabled={uploading}
          dragActive={dragActive}
          setDragActive={setDragActive}
          onDropFile={handleFileSelect}
          onRemoveFile={handleRemoveFile}
        />
      )}

      {(isParsing || uploading) && file && (
        <>
          <DropZone
            file={file}
            parsingStage={parsingStage}
            disabled={uploading}
            dragActive={dragActive}
            setDragActive={setDragActive}
            onDropFile={handleFileSelect}
            onRemoveFile={handleRemoveFile}
          />
          <ParsingProgress
            milestones={PARSING_MILESTONES}
            activeIndex={activeIndex}
            status={parseStatus === 'idle' ? 'in-progress' : parseStatus}
          />
        </>
      )}

      {isReady && file && (
        <DocViewer
          fileName={file.name}
          content={docContent || sanitizeParsedText(file.name)}
          isLoading={false}
        />
      )}
    </>
  );

  const rightPaneContent = (
    <>
      {(isParsing || uploading) && (
        <ParsingProgress
          milestones={PARSING_MILESTONES}
          activeIndex={activeIndex}
          status={parseStatus === 'idle' ? 'in-progress' : parseStatus}
        />
      )}

      {isReady && (
        <FormPreview
          title={title}
          questions={questions}
          onTitleChange={handleTitleChange}
          onUpdateQuestion={handleUpdateQuestion}
          onDeleteQuestion={handleDeleteQuestion}
          onAddQuestion={handleAddQuestion}
        />
      )}

      {isIdle && (
        <div className="form-preview-placeholder" aria-live="polite">
          <FileText size={48} className="form-preview-placeholder__icon" />
          <p className="form-preview-placeholder__text">
            Upload a document to see the form preview here.
          </p>
        </div>
      )}
    </>
  );

  const canGenerate = title.trim().length > 0 && questions.length > 0;

  return (
    <div
      ref={containerRef}
      className="workspace-page"
      role="main"
      aria-label="Form generator workspace"
    >
      <WorkspaceHeader
        title="Transform Documents into Google Forms"
        subtitle="Upload your DOCX or TXT file and let AI extract questions automatically."
      />

      {formError && (
        <ErrorBanner
          message={formError}
          onClose={() => formActions.setError(null)}
        />
      )}

      <SplitPane
        leftPane={
          <LeftPane
            file={file}
            parsingStage={parsingStage}
            aria-label="Document workspace"
          >
            {leftPaneContent}
          </LeftPane>
        }
        rightPane={
          <RightPane parsingStage={parsingStage} aria-label="Form preview workspace">
            {rightPaneContent}
          </RightPane>
        }
      />

      <WorkspaceFooter
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => navigate('/my-forms')}
              aria-label="View my forms"
            >
              My Forms
            </Button>

            <Button
              variant="primary"
              onClick={handleGenerateForm}
              loading={generating}
              disabled={!canGenerate || generating || uploading}
              leftIcon={<Sparkles size={20} />}
            >
              {generating ? 'Creating…' : 'Generate Form'}
            </Button>
          </>
        }
      />
    </div>
  );
};

WorkspacePage.displayName = 'WorkspacePage';

export default WorkspacePage;
