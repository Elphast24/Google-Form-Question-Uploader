import { Trash2, GripVertical } from 'lucide-react';
import type { QuestionType } from '@/types/form';
import '../styles/global.css';

export interface QuestionLike {
  id?: string;
  question_text: string;
  question_type: string;
  required?: boolean;
  options?: string[];
  scale_min?: number;
  scale_max?: number;
}

interface QuestionItemProps {
  question: QuestionLike;
  index: number;
  onUpdate: (index: number, updatedQuestion: QuestionLike) => void;
  onDelete: (index: number) => void;
}

const QuestionItem = ({ question, index, onUpdate, onDelete }: QuestionItemProps) => {
  const questionTypes: { value: QuestionType; label: string }[] = [
    { value: 'SHORT_ANSWER', label: 'Short Answer' },
    { value: 'PARAGRAPH', label: 'Paragraph' },
    { value: 'MULTIPLE_CHOICE', label: 'Multiple Choice' },
    { value: 'CHECKBOX', label: 'Checkboxes' },
    { value: 'DROPDOWN', label: 'Dropdown' },
    { value: 'LINEAR_SCALE', label: 'Linear Scale' }
  ];

  const needsOptions = ['MULTIPLE_CHOICE', 'CHECKBOX', 'DROPDOWN'].includes(question.question_type);
  const isScale = question.question_type === 'LINEAR_SCALE';

  const handleQuestionChange = (field: keyof QuestionLike, value: unknown) => {
    onUpdate(index, { ...question, [field]: value } as QuestionLike);
  };

  const handleOptionChange = (optionIndex: number, value: string) => {
    const newOptions = [...(question.options || [])];
    newOptions[optionIndex] = value;
    handleQuestionChange('options', newOptions);
  };

  const addOption = () => {
    const newOptions = [...(question.options || []), ''];
    handleQuestionChange('options', newOptions);
  };

  const removeOption = (optionIndex: number) => {
    const newOptions = (question.options || []).filter((_, i) => i !== optionIndex);
    handleQuestionChange('options', newOptions);
  };

  return (
    <div className="question-item">
      <div className="question-header">
        <GripVertical size={20} className="question-drag-handle" />
        <span className="question-number">Question {index + 1}</span>
        <button
          onClick={() => onDelete(index)}
          className="question-delete-button"
          title="Delete question"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="question-content">
        <div className="form-group">
          <label className="form-label">Question Text *</label>
          <input
            type="text"
            value={question.question_text}
            onChange={(e) => handleQuestionChange('question_text', e.target.value)}
            className="form-input"
            placeholder="Enter your question"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Question Type *</label>
            <select
              value={question.question_type}
              onChange={(e) => handleQuestionChange('question_type', e.target.value as QuestionType)}
              className="form-select"
            >
              {questionTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Required</label>
            <label className="form-checkbox-label">
              <input
                type="checkbox"
                checked={question.required || false}
                onChange={(e) => handleQuestionChange('required', e.target.checked)}
                className="form-checkbox"
              />
              <span>This question is required</span>
            </label>
          </div>
        </div>

        {needsOptions && (
          <div className="form-group">
            <label className="form-label">Options</label>
            <div className="question-options">
              {(question.options || []).map((option, optionIndex) => (
                <div key={optionIndex} className="question-option">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(optionIndex, e.target.value)}
                    className="form-input"
                    placeholder={`Option ${optionIndex + 1}`}
                  />
                  {(question.options?.length || 0) > 1 && (
                    <button
                      onClick={() => removeOption(optionIndex)}
                      className="option-remove-button"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button onClick={addOption} className="button-secondary">
                Add Option
              </button>
            </div>
          </div>
        )}

        {isScale && (
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Minimum Value</label>
              <input
                type="number"
                value={question.scale_min || 1}
                onChange={(e) => handleQuestionChange('scale_min', parseInt(e.target.value, 10))}
                className="form-input"
                min="0"
                max="10"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Maximum Value</label>
              <input
                type="number"
                value={question.scale_max || 5}
                onChange={(e) => handleQuestionChange('scale_max', parseInt(e.target.value, 10))}
                className="form-input"
                min="0"
                max="10"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionItem;
