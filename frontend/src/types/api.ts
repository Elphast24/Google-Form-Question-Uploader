export interface ParsedQuestion {
  question_text: string;
  question_type: string;
  item_type?: string;
  required?: boolean;
  options?: string[];
  scale_min?: number;
  scale_max?: number;
}

export interface UploadResponse {
  success: boolean;
  questions: ParsedQuestion[];
  message: string;
  fileName?: string;
  draftId?: string | null;
}

export interface SaveDraftPayload {
  title: string;
  questions: ParsedQuestion[];
  draftId?: string | null;
}

export interface SaveDraftResponse {
  draftId: string;
}

export interface GenerateFormPayload {
  title: string;
  questions: ParsedQuestion[];
  draftId?: string | null;
}

export interface GenerateFormResponse {
  formId: string;
  viewUrl: string;
  editUrl: string;
}

export interface UserForm {
  id: string;
  title: string;
  formId: string;
  viewUrl: string;
  editUrl: string;
  createdAt: string;
}

export interface UserDraft {
  id: string;
  title: string;
  questions: ParsedQuestion[];
  questionCount: number;
  updatedAt: string;
}
