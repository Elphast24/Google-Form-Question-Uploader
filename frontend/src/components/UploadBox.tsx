import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, File, X } from 'lucide-react';
import '../styles/global.css';

interface UploadBoxProps {
  onFileSelect: (file: File | null) => void;
  disabled?: boolean;
  variant?: 'default' | 'compact-dark';
}

const UploadBox = ({ onFileSelect, disabled = false, variant = 'default' }: UploadBoxProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const validTypes: string[] = [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ];
  const maxSize = 10 * 1024 * 1024;

  const handleFile = (file: File) => {
    if (!validTypes.includes(file.type)) {
      alert('Please upload only DOCX or TXT files');
      return;
    }

    if (file.size > maxSize) {
      alert('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  if (variant === 'compact-dark') {
    return (
      <div className="upload-box-container">
        <div
          className={`upload-box-compact ${dragActive ? 'drag-active' : ''} ${disabled ? 'disabled' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".docx,.txt"
            onChange={handleChange}
            style={{ display: 'none' }}
            disabled={disabled}
          />

          {!selectedFile ? (
            <>
              <Upload size={24} className="upload-icon" />
              <span className="upload-title">Drop your file or click to browse</span>
            </>
          ) : (
            <div className="upload-file-info">
              <File size={24} className="file-icon" />
              <div className="file-details">
                <span className="file-name">{selectedFile.name}</span>
                <span className="file-size">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile();
                }}
                className="file-remove-button"
                disabled={disabled}
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="upload-box-container">
      <div
        className={`upload-box ${dragActive ? 'drag-active' : ''} ${disabled ? 'disabled' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".docx,.txt"
          onChange={handleChange}
          style={{ display: 'none' }}
          disabled={disabled}
        />

        {!selectedFile ? (
          <>
            <Upload size={48} className="upload-icon" />
            <h3 className="upload-title">Upload your file</h3>
            <p className="upload-description">
              Drag and drop your DOCX or TXT file here, or click to browse
            </p>
            <p className="upload-info">Maximum file size: 10MB</p>
          </>
        ) : (
          <div className="upload-file-info">
            <File size={48} className="file-icon" />
            <div className="file-details">
              <h4 className="file-name">{selectedFile.name}</h4>
              <p className="file-size">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFile();
              }}
              className="file-remove-button"
              disabled={disabled}
            >
              <X size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

UploadBox.displayName = 'UploadBox';

export default UploadBox;
