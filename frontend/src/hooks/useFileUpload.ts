import { useState, useCallback } from 'react';
import { uploadFile } from '@/services/api';
import type { UploadResponse, ParsedQuestion } from '@/types/api';
import type { Question, QuestionType } from '@/types/form';
import { QUESTION_TYPE_LABELS, QUESTION_TYPES } from '@/types/form';

export interface UploadedQuestion {
  question_text: string;
  question_type: QuestionType;
  required?: boolean;
  options?: string[];
  scale_min?: number;
  scale_max?: number;
}

export const VALID_FILE_TYPES: ReadonlySet<string> = new Set([
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
]);

export const MAX_FILE_SIZE = 10 * 1024 * 1024;

export interface UseFileUploadReturn {
  file: File | null;
  uploading: boolean;
  error: string | null;
  dragActive: boolean;
  setDragActive: (active: boolean) => void;
  handleFileSelect: (file: File) => boolean;
  handleRemoveFile: () => void;
  reset: () => void;
}

export const useFileUpload = (
  onUploadStart?: (file: File) => void,
  onUploadComplete?: (questions: Question[], fileName: string) => void,
  onUploadError?: (error: string) => void
): UseFileUploadReturn => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const validateFile = useCallback((selectedFile: File): string | null => {
    if (!VALID_FILE_TYPES.has(selectedFile.type)) {
      return 'Please upload only DOCX or TXT files';
    }
    if (selectedFile.size > MAX_FILE_SIZE) {
      return 'File size must be less than 10MB';
    }
    return null;
  }, []);

  const parseQuestions = useCallback(
    (raw: ParsedQuestion[]): Question[] => {
      return raw.map((q) => ({
        id: crypto.randomUUID(),
        question_text: q.question_text || '',
        question_type: (q.question_type?.toUpperCase() as QuestionType) || 'SHORT_ANSWER',
        required: q.required ?? false,
        options: q.options ?? [],
        scale_min: q.scale_min,
        scale_max: q.scale_max,
      }));
    },
    []
  );

  const handleFileSelect = useCallback(
    (selectedFile: File): boolean => {
      const validationError = validateFile(selectedFile);
      if (validationError) {
        setError(validationError);
        onUploadError?.(validationError);
        return false;
      }

      setError(null);
      setFile(selectedFile);
      setUploading(true);
      setDragActive(false);
      onUploadStart?.(selectedFile);

      uploadFile(selectedFile)
        .then((response: UploadResponse) => {
          const questions = parseQuestions(response.questions || []);
          const fileName = response.fileName || selectedFile.name;
          onUploadComplete?.(questions, fileName);
        })
        .catch((err: Error) => {
          const msg = err.message || 'Failed to process file. Please try again.';
          setError(msg);
          onUploadError?.(msg);
        })
        .finally(() => {
          setUploading(false);
        });

      return true;
    },
    [validateFile, parseQuestions, onUploadStart, onUploadComplete, onUploadError]
  );

  const handleRemoveFile = useCallback(() => {
    setFile(null);
    setError(null);
    setUploading(false);
  }, []);

  const reset = useCallback(() => {
    setFile(null);
    setError(null);
    setUploading(false);
    setDragActive(false);
  }, []);

  return {
    file,
    uploading,
    error,
    dragActive,
    setDragActive,
    handleFileSelect,
    handleRemoveFile,
    reset,
  };
};
