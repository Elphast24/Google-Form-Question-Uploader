export type QuestionType =
  | 'SHORT_ANSWER'
  | 'PARAGRAPH'
  | 'MULTIPLE_CHOICE'
  | 'CHECKBOX'
  | 'DROPDOWN'
  | 'LINEAR_SCALE';

export interface Question {
  id: string;
  question_text: string;
  question_type: QuestionType;
  required: boolean;
  options: string[];
  scale_min?: number;
  scale_max?: number;
}

export type ParsingStage = 'idle' | 'uploading' | 'parsing' | 'ready' | 'error';

export interface FormState {
  title: string;
  questions: Question[];
  file: File | null;
  parsingStage: ParsingStage;
  parsingMilestone: string;
  error: string | null;
}

export interface FormStateActions {
  setFile: (file: File | null) => void;
  setTitle: (title: string) => void;
  setQuestions: (questions: Question[]) => void;
  addQuestion: (question?: Partial<Question>) => void;
  updateQuestion: (id: string, patch: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
  setParsingStage: (stage: ParsingStage) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  SHORT_ANSWER: 'Short Answer',
  PARAGRAPH: 'Paragraph',
  MULTIPLE_CHOICE: 'Multiple Choice',
  CHECKBOX: 'Checkboxes',
  DROPDOWN: 'Dropdown',
  LINEAR_SCALE: 'Linear Scale',
};

export const QUESTION_TYPES: QuestionType[] = [
  'SHORT_ANSWER',
  'PARAGRAPH',
  'MULTIPLE_CHOICE',
  'CHECKBOX',
  'DROPDOWN',
  'LINEAR_SCALE',
];

export const TYPES_REQUIRING_OPTIONS: QuestionType[] = [
  'MULTIPLE_CHOICE',
  'CHECKBOX',
  'DROPDOWN',
];
