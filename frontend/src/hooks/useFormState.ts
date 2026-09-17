import { useReducer, useCallback } from 'react';
import type {
  Question,
  QuestionType,
  FormState,
  FormStateActions,
  ParsingStage,
} from '@/types/form';
import { QUESTION_TYPES, QUESTION_TYPE_LABELS } from '@/types/form';

type State = FormState;

type Action =
  | { type: 'SET_FILE'; payload: File | null }
  | { type: 'SET_TITLE'; payload: string }
  | { type: 'SET_QUESTIONS'; payload: Question[] }
  | { type: 'ADD_QUESTION'; payload?: Partial<Question> }
  | { type: 'UPDATE_QUESTION'; payload: { id: string; patch: Partial<Question> } }
  | { type: 'DELETE_QUESTION'; payload: string }
  | { type: 'SET_PARSING_STAGE'; payload: ParsingStage }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PARSING_MILESTONE'; payload: string }
  | { type: 'RESET' };

const createEmptyQuestion = (overrides: Partial<Question> = {}): Question => ({
  id: crypto.randomUUID(),
  question_text: '',
  question_type: 'SHORT_ANSWER',
  required: false,
  options: [],
  ...overrides,
});

const initialState: State = {
  title: '',
  questions: [],
  file: null,
  parsingStage: 'idle',
  parsingMilestone: '',
  error: null,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_FILE':
      return {
        ...state,
        file: action.payload,
        title: action.payload
          ? action.payload.name.replace(/\.(docx|txt)$/i, '')
          : '',
        questions: [],
        parsingStage: 'idle',
        error: null,
      };

    case 'SET_TITLE':
      return { ...state, title: action.payload };

    case 'SET_QUESTIONS':
      return { ...state, questions: action.payload };

    case 'ADD_QUESTION':
      return {
        ...state,
        questions: [...state.questions, createEmptyQuestion(action.payload)],
      };

    case 'UPDATE_QUESTION':
      return {
        ...state,
        questions: state.questions.map((q) =>
          q.id === action.payload.id
            ? { ...q, ...action.payload.patch }
            : q
        ),
      };

    case 'DELETE_QUESTION':
      return {
        ...state,
        questions: state.questions.filter((q) => q.id !== action.payload),
      };

    case 'SET_PARSING_STAGE':
      return { ...state, parsingStage: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'SET_PARSING_MILESTONE':
      return { ...state, parsingMilestone: action.payload };

    case 'RESET':
      return { ...initialState };

    default:
      return state;
  }
};

export const useFormState = (): [State, FormStateActions] => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setFile = useCallback((file: File | null) => {
    dispatch({ type: 'SET_FILE', payload: file });
  }, []);

  const setTitle = useCallback((title: string) => {
    dispatch({ type: 'SET_TITLE', payload: title });
  }, []);

  const setQuestions = useCallback((questions: Question[]) => {
    dispatch({ type: 'SET_QUESTIONS', payload: questions });
  }, []);

  const addQuestion = useCallback((patch?: Partial<Question>) => {
    dispatch({ type: 'ADD_QUESTION', payload: patch });
  }, []);

  const updateQuestion = useCallback(
    (id: string, patch: Partial<Question>) => {
      dispatch({ type: 'UPDATE_QUESTION', payload: { id, patch } });
    },
    []
  );

  const deleteQuestion = useCallback((id: string) => {
    dispatch({ type: 'DELETE_QUESTION', payload: id });
  }, []);

  const setParsingStage = useCallback((stage: ParsingStage) => {
    dispatch({ type: 'SET_PARSING_STAGE', payload: stage });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const actions: FormStateActions = {
    setFile,
    setTitle,
    setQuestions,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    setParsingStage,
    setError,
    reset,
  };

  return [state, actions];
};

export const QUESTION_TYPE_OPTIONS: { value: QuestionType; label: string }[] =
  QUESTION_TYPES.map((type) => ({
    value: type,
    label: QUESTION_TYPE_LABELS[type],
  }));
