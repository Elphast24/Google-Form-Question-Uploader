# Frontend Pages & Components — UI Documentation

This document provides a detailed breakdown of every page and component in the **AI Form Generator** frontend, including code structure, component hierarchy, styling, and integration points.

---

## Table of Contents

| # | Page | Route | Status |
|---|------|-------|--------|
| 1 | **Home** | `/` | Public — Landing page |
| 2 | **Preview** | `/preview` | Protected — Edit extracted questions |
| 3 | **Generated** | `/generated` | Protected — Form success |
| 4 | **My Forms** | `/my-forms` | Protected — List saved forms |
| 5 | **Drafts** | `/drafts` | Protected — List saved drafts |
| 6 | **AuthCallback** | `/auth/callback` | Public — OAuth redirect |
| 7 | **OAuthSuccess** | `/oauth-success` | Public — OAuth success page |
| 8 | **WorkspacePage** | `/editor` | Internal — Full editor |

---

## 1. Home Page (`src/pages/Home.tsx`)

### Purpose
Landing page where users upload a DOCX or TXT file and generate a Google Form.

### Code Structure

```tsx
// src/pages/Home.tsx
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import UploadBox from '@/components/UploadBox';
import Loader from '@/components/Loader';
import { uploadFile } from '@/services/api';
import { FileText, Sparkles, Zap } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animate } from 'animejs';
import { useGSAPAnimation } from '@/hooks/useGSAPAnimation';
```

### State Management

```tsx
const Home: React.FC = () => {
  const { user, signIn } = useAuth() as {
    user: User | null;
    signIn: () => Promise<void>;
  };
  const navigate = useNavigate();
  const [file, setFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { reduceMotion } = useGSAPAnimation();
```

### Animation Refs
```tsx
  const heroRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const uploadSectionRef = useRef<HTMLElement>(null);
```

### GSAP ScrollTrigger Animations
Three animation effects applied via `useEffect`:

1. **Hero section** — Children of `.home-hero-content` animate in with `opacity: 0 → 1`, `y: 30 → 0` with stagger `0.15s`
2. **Feature cards** — Each `.feature-card` animates via ScrollTrigger (start: `top 80%`)
3. **Upload section** — `.upload-box`, `.button-primary`, `.button-secondary` animate with stagger `0.1s`

```tsx
useEffect(() => {
  if (reduceMotion) return;

  const ctx = gsap.context(() => {
    // Hero content
    if (heroRef.current) {
      gsap.from(heroRef.current.querySelectorAll('.home-hero-content > *'), {
        opacity: 0, y: 30, stagger: 0.15, duration: 0.6, ease: 'power2.out',
      });
    }

    // Feature cards with ScrollTrigger
    if (featuresRef.current) {
      featuresRef.current.querySelectorAll('.feature-card').forEach((card) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
          opacity: 0, y: 30, duration: 0.5, ease: 'power2.out',
        });
      });
    }

    // Upload section
    if (uploadSectionRef.current) {
      gsap.from(
        uploadSectionRef.current.querySelectorAll('.upload-box, .button-primary, .button-secondary'),
        {
          scrollTrigger: { trigger: uploadSectionRef.current, start: 'top 80%', toggleActions: 'play none none reverse' },
          opacity: 0, y: 20, stagger: 0.1, duration: 0.5, ease: 'power2.out',
        }
      );
    }
  });

  return () => ctx.revert();
}, [reduceMotion]);
```

### Anime.js Micro-interaction
Subtle breathing pulse on the hero title using animejs:

```tsx
useEffect(() => {
  if (reduceMotion) return;

  const titleEl = document.querySelector('.home-title');
  if (!titleEl) return;

  animate(titleEl, {
    scale: [1, 1.02, 1],
    duration: 6000,
    easing: 'easeInOutSine',
    direction: 'alternate',
    loop: true,
  });
}, [reduceMotion]);
```

### Handlers

```tsx
const handleFileSelect = (selectedFile: File | null) => {
  setFile(selectedFile);
  setError(null);
};

const handleGenerateForm = async () => {
  if (!user) {
    try { await signIn(); }
    catch { setError('Please sign in to continue'); return; }
  }

  if (!file) {
    setError('Please select a file first');
    return;
  }

  setUploading(true);
  setError(null);

  try {
    const response: UploadResponse = await uploadFile(file);
    navigate('/preview', {
      state: {
        questions: response.questions,
        fileName: file.name,
      },
    });
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to process file.');
  } finally {
    setUploading(false);
  }
};
```

### JSX Structure

```tsx
return (
  <div className="page-container">
    <main className="home-page">
      {/* Hero Section */}
      <section className="home-hero" ref={heroRef}>
        <div className="home-hero-content">
          <h1 className="home-title">
            Transform Documents into
            <span className="gradient-text"> Google Forms</span>
          </h1>
          <p className="home-subtitle">
            Upload your DOCX or TXT file and let AI extract questions automatically.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="home-features" ref={featuresRef}>
          <div className="feature-card">
            <div className="feature-icon" style={{ background: '#E8F0FE' }}>
              <Sparkles size={24} color="#4285F4" />
            </div>
            <h3>AI-Powered</h3>
            <p>Gemini AI intelligently extracts questions from your documents</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{ background: '#FEE8E7' }}>
              <Zap size={24} color="#DB4437" />
            </div>
            <h3>Lightning Fast</h3>
            <p>Generate forms in seconds, not hours</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{ background: '#E6F4EA' }}>
              <FileText size={24} color="#0F9D58" />
            </div>
            <h3>Multiple Formats</h3>
            <p>Support for DOCX and TXT file formats</p>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section className="home-upload-section" ref={uploadSectionRef}>
        <UploadBox onFileSelect={handleFileSelect} disabled={uploading} />
        {error && <div className="error-message">{error}</div>}
        <button onClick={handleGenerateForm} disabled={!file || uploading} className="button-primary button-large">
          {uploading ? (
            <>
              <Loader text="" />
              Processing...
            </>
          ) : (
            <>
              <Sparkles size={20} />
              Generate Form
            </>
          )}
        </button>
      </section>
    </main>

    {/* Inline Footer */}
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <p className="footer-text">
            © {new Date().getFullYear()} AI Form Generator. Powered by Gemini AI & Google Forms API.
          </p>
          <div className="footer-links">
            <a href="https://github.com" ... className="footer-link">GitHub</a>
            <span className="footer-divider">•</span>
            <a href="https://docs.google.com/forms" ... className="footer-link">Google Forms</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
);
```

### CSS Classes (from `global.css`)
| Class | Description |
|-------|-------------|
| `.page-container` | Full-height flex column container, grey background |
| `.home-page` | Centered content (max-width 1200px, padding 48px) |
| `.home-hero` | Centered text, margin-bottom 48px |
| `.home-hero-content` | Max-width 800px content block |
| `.home-title` | 48px font, weight 700, grey-900 |
| `.gradient-text` | Gradient from primary to success |
| `.home-subtitle` | 18px muted text |
| `.home-features` | Grid of feature cards |
| `.feature-card` | White card, shadow, border-radius |
| `.feature-icon` | 56px icon container with background |
| `.home-upload-section` | Centered upload area |
| `.error-message` | Red alert banner |
| `.button-primary` | Primary blue button |

---

## 2. Preview Page (`src/pages/Preview.tsx`)

### Purpose
Allows users to review and edit AI-extracted questions before generating the final Google Form. Uses **Material-UI** components.

### Code Structure

```tsx
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Box, Typography, Button, TextField, Stack, Alert, Snackbar } from '@mui/material';
import { Add as AddIcon, Save as SaveIcon, CloudDone as CloudDoneIcon } from '@mui/icons-material';
import QuestionItem, { QuestionLike } from '@/components/QuestionItem';
import LoadingScreen from '@/components/Loader';
import { generateForm, saveDraft } from '@/services/api';
import type { ParsedQuestion } from '@/types/api';
```

### State

```tsx
const [questions, setQuestions] = useState<ParsedQuestion[]>([]);
const [title, setTitle] = useState('');
const [generating, setGenerating] = useState(false);
const [error, setError] = useState<string | null>(null);
const [draftId, setDraftId] = useState<string | null>(null);
const [saving, setSaving] = useState(false);
const [saveSuccess, setSaveSuccess] = useState(false);
const [autoSaveEnabled] = useState(true);
```

### Navigation State

```tsx
interface LocationState {
  questions: ParsedQuestion[];
  fileName?: string;
  draftId?: string | null;
}
```

### Handlers

**Update question** — Replaces the question at `index` with an updated version:
```tsx
const handleQuestionUpdate = (index: number, updatedQuestion: QuestionLike) => {
  const newQuestions = [...questions];
  newQuestions[index] = updatedQuestion;
  setQuestions(newQuestions);
};
```

**Delete question** — Removes the question at `index`:
```tsx
const handleQuestionDelete = (index: number) => {
  setQuestions(questions.filter((_, i) => i !== index));
};
```

**Add question** — Appends a blank short-answer question:
```tsx
const handleAddQuestion = () => {
  const newQuestion: ParsedQuestion = {
    question_text: '',
    question_type: 'SHORT_ANSWER',
    required: false,
    options: [],
  };
  setQuestions([...questions, newQuestion]);
};
```

**Save Draft** — Auto-save every 30s, also manual save:
```tsx
const handleSaveDraft = useCallback(async (silent = false) => {
  if (!title || !title.trim()) { if (!silent) setError('Please enter a form title'); return; }
  if (questions.length === 0) { if (!silent) setError('Please add at least one question'); return; }

  setSaving(true);
  if (!silent) setError(null);

  try {
    const response = await saveDraft({ title: title.trim(), questions, draftId });
    if (!draftId) setDraftId(response.draftId);
    if (!silent) { setSaveSuccess(true); setTimeout(() => setSaveSuccess(false), 3000); }
  } catch (err) {
    if (!silent) setError(err instanceof Error ? err.message : 'Failed to save draft');
  } finally {
    setSaving(false);
  }
}, [title, questions, draftId]);
```

**Auto-save Effect** — 30-second interval:
```tsx
useEffect(() => {
  if (!autoSaveEnabled || !title || questions.length === 0) return;
  const autoSaveTimer = setInterval(() => handleSaveDraft(true), 30000);
  return () => clearInterval(autoSaveTimer);
}, [title, questions, autoSaveEnabled, handleSaveDraft]);
```

**Create Form** — Calls the backend to generate the Google Form:
```tsx
const handleCreateForm = async () => {
  // Validation...
  setGenerating(true);
  try {
    const response = await generateForm({ title, questions, draftId });
    navigate('/generated', { state: { formData: response, title } });
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to create form.');
  } finally {
    setGenerating(false);
  }
};
```

### JSX Structure (MUI-based)

```tsx
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
        <TextField fullWidth label="Form Title" value={title || ''}
          onChange={(e) => setTitle(e.target.value)} placeholder="Enter form title" required />
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Questions List */}
      <Stack spacing={3} sx={{ mb: 3 }}>
        {questions.map((question, index) => (
          <QuestionItem key={index} question={question} index={index}
            onUpdate={handleQuestionUpdate} onDelete={handleQuestionDelete} />
        ))}
      </Stack>

      {/* Add Question Button */}
      <Button variant="outlined" fullWidth startIcon={<AddIcon />}
        onClick={handleAddQuestion} sx={{ mb: 4 }}>
        Add Question
      </Button>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button variant="outlined" size="large" startIcon={saving ? <CloudDoneIcon /> : <SaveIcon />}
          onClick={() => handleSaveDraft(false)} disabled={saving || generating}>
          {saving ? 'Saving...' : draftId ? 'Update Draft' : 'Save Draft'}
        </Button>
        <Button variant="contained" size="large" startIcon={generating ? null : <SaveIcon />}
          onClick={handleCreateForm} disabled={generating || saving}>
          {generating ? <LoadingScreen text="" /> : 'Create Google Form'}
        </Button>
      </Box>

      {/* Auto-save indicator */}
      {draftId && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 2 }}>
          ✓ Auto-saving enabled
        </Typography>
      )}
    </Container>

    {/* Snackbar */}
    <Snackbar open={saveSuccess} autoHideDuration={3000}
      onClose={() => setSaveSuccess(false)} message="Draft saved successfully" />
  </Box>
);
```

---

## 3. Generated Page (`src/pages/Generated.tsx`)

### Purpose
Success page displaying the generated Google Form's view/edit links. Uses MUI.

### Code Structure

```tsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Box, Typography, Button, Paper, TextField, InputAdornment, IconButton, Stack } from '@mui/material';
import { CheckCircle as CheckIcon, ContentCopy as CopyIcon, OpenInNew as OpenIcon, Description as FileIcon } from '@mui/icons-material';
import type { GenerateFormResponse } from '@/types/api';
```

### State

```tsx
const [formData] = useState<GenerateFormResponse | null>(() => location.state?.formData ?? null);
const [copiedView, setCopiedView] = useState(false);
const [copiedEdit, setCopiedEdit] = useState(false);
```

### Helper

```tsx
const copyToClipboard = async (text: string, type: 'view' | 'edit') => {
  try {
    await navigator.clipboard.writeText(text);
    if (type === 'view') { setCopiedView(true); setTimeout(() => setCopiedView(false), 2000); }
    else { setCopiedEdit(true); setTimeout(() => setCopiedEdit(false), 2000); }
  } catch {
    alert('Failed to copy link');
  }
};
```

### JSX Structure

```tsx
return (
  <Box sx={{ bgcolor: 'background.default', minHeight: 'calc(100vh - 200px)' }}>
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* Success Animation */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <CheckIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        <Typography variant="h3" gutterBottom fontWeight={600}>
          Form Created Successfully!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your Google Form has been generated and is ready to share
        </Typography>
      </Box>

      {/* Form Info Card */}
      <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
        {/* Form Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pb: 3,
          borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Box sx={{ width: 56, height: 56, borderRadius: 2, bgcolor: 'primary.50',
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileIcon sx={{ fontSize: 32, color: 'primary.main' }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" fontWeight={600}>{location.state?.title}</Typography>
            <Typography variant="body2" color="text.secondary">Form ID: {formData.formId}</Typography>
          </Box>
        </Box>

        {/* Links Section */}
        <Stack spacing={3}>
          {/* Public View Link */}
          <Box>
            <Typography variant="subtitle2" gutterBottom fontWeight={600}>Public View Link</Typography>
            <TextField fullWidth value={formData.viewUrl} InputProps={{
              readOnly: true,
              endAdornment: (<InputAdornment position="end">
                <IconButton onClick={() => copyToClipboard(formData.viewUrl, 'view')} edge="end">
                  {copiedView ? <CheckIcon color="success" /> : <CopyIcon />}
                </IconButton>
                <IconButton onClick={() => window.open(formData.viewUrl, '_blank')} edge="end">
                  <OpenIcon />
                </IconButton>
              </InputAdornment>),
            }} />
          </Box>

          {/* Edit Link */}
          <Box>
            <Typography variant="subtitle2" gutterBottom fontWeight={600}>Edit Link (Creator Only)</Typography>
            <TextField fullWidth value={formData.editUrl} InputProps={{
              readOnly: true,
              endAdornment: (<InputAdornment position="end">
                <IconButton onClick={() => copyToClipboard(formData.editUrl, 'edit')} edge="end">
                  {copiedEdit ? <CheckIcon color="success" /> : <CopyIcon />}
                </IconButton>
                <IconButton onClick={() => window.open(formData.editUrl, '_blank')} edge="end">
                  <OpenIcon />
                </IconButton>
              </InputAdornment>),
            }} />
          </Box>
        </Stack>
      </Paper>

      {/* Action Buttons */}
      <Stack spacing={2} sx={{ maxWidth: 500, mx: 'auto' }}>
        <Button variant="contained" size="large" fullWidth startIcon={<OpenIcon />}
          onClick={() => window.open(formData.viewUrl, '_blank')}>
          Open in Google Forms
        </Button>
        <Button variant="outlined" size="large" fullWidth onClick={() => navigate('/')}>
          Generate Another Form
        </Button>
        <Button variant="outlined" size="large" fullWidth onClick={() => navigate('/my-forms')}>
          View My Forms
        </Button>
      </Stack>
    </Container>
  </Box>
);
```

---

## 4. My Forms Page (`src/pages/MyForms.tsx`)

### Purpose
Displays all Google Forms the authenticated user has generated, with search and copy-to-clipboard functionality.

### Code Structure

```tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button, TextField, InputAdornment,
  Card, CardContent, IconButton, Chip, Alert } from '@mui/material';
import { Search as SearchIcon, ContentCopy as CopyIcon, OpenInNew as OpenIcon,
  Description as FileIcon, CalendarToday as CalendarIcon, Add as AddIcon } from '@mui/icons-material';
import LoadingScreen from '@/components/Loader';
import { getUserForms } from '@/services/api';
import type { UserForm } from '@/types/api';
```

### State

```tsx
const [forms, setForms] = useState<UserForm[]>([]);
const [filteredForms, setFilteredForms] = useState<UserForm[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [searchQuery, setSearchQuery] = useState('');
const [copiedId, setCopiedId] = useState<string | null>(null);
```

### Data Fetching
```tsx
useEffect(() => { fetchForms(); }, []);

const fetchForms = async () => {
  try {
    setLoading(true);
    const response = await getUserForms();
    setForms(response.forms || []);
    setFilteredForms(response.forms || []);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to load forms');
  } finally {
    setLoading(false);
  }
};
```

### Search Filter
```tsx
useEffect(() => {
  if (searchQuery.trim()) {
    const filtered = forms.filter((form) =>
      form.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredForms(filtered);
  } else {
    setFilteredForms(forms);
  }
}, [searchQuery, forms]);
```

### JSX Structure — Form Card Layout

```tsx
{forms.length > 0 && (
  <TextField fullWidth placeholder="Search forms by title..." value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)} sx={{ mb: 4, maxWidth: 600 }}
    InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }} />
)}

{filteredForms.length > 0 ? (
  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
    {filteredForms.map((form) => (
      <Box key={form.id} sx={{ flex: '1 1 calc(33.333% - 24px)', minWidth: '280px' }}>
        <Card elevation={1} sx={{ height: '100%', display: 'flex', flexDirection: 'column',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': { transform: 'translateY(-4px)', boxShadow: 3 } }}>
          <CardContent sx={{ flex: 1, p: 3 }}>
            {/* Card Header (icon + date chip) */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: 1, bgcolor: 'primary.50', ... }}>
                <FileIcon sx={{ color: 'primary.main' }} />
              </Box>
              <Chip icon={<CalendarIcon sx={{ fontSize: 14 }} />} label={formatDate(form.createdAt)}
                size="small" variant="outlined" />
            </Box>

            {/* Title + ID */}
            <Typography variant="h6" gutterBottom fontWeight={600>{form.title}</Typography>
            <Typography variant="caption" color="text.secondary">ID: {form.formId}</Typography>

            {/* Links */}
            <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="caption" color="text.secondary">View Link</Typography>
                <Box>
                  <IconButton size="small" onClick={() => copyToClipboard(form.viewUrl, `view-${form.id}`)}>
                    {copiedId === `view-${form.id}` ? <FileIcon color="success" fontSize="small" /> : <CopyIcon fontSize="small" />}
                  </IconButton>
                  <IconButton size="small" onClick={() => window.open(form.viewUrl, '_blank')}>
                    <OpenIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
              {/* Same pattern for Edit Link... */}
            </Box>
          </CardContent>
        </Card>
      </Box>
    ))}
  </Box>
) : (
  <Box sx={{ textAlign: 'center', py: 10 }}>
    <FileIcon sx={{ fontSize: 80, color: 'grey.300', mb: 2 }} />
    <Typography variant="h5" gutterBottom fontWeight={600}>
      {searchQuery ? 'No forms found' : 'No forms yet'}
    </Typography>
    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
      {searchQuery ? 'Try adjusting your search' : 'Create your first Google Form by uploading a document'}
    </Typography>
    {!searchQuery && (
      <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/')}>
        Create Your First Form
      </Button>
    )}
  </Box>
)}
```

---

## 5. Drafts Page (`src/pages/Drafts.tsx`)

### Purpose
Lists saved form drafts with edit and delete actions. Uses MUI.

### Code Structure

```tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Card, CardContent, CardActions,
  Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Description as DescriptionIcon } from '@mui/icons-material';
import { getUserDrafts, deleteDraft } from '@/services/api';
import type { UserDraft } from '@/types/api';
import LoadingScreen from '@/components/Loader';
```

### State

```tsx
const [drafts, setDrafts] = useState<UserDraft[]>([]);
const [loading, setLoading] = useState(true);
const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; draftId: string | null }>({
  open: false, draftId: null
});
```

### JSX Structure

```tsx
return (
  <Container maxWidth="lg" sx={{ py: 6 }}>
    <Typography variant="h3" gutterBottom fontWeight={600}>My Drafts</Typography>
    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
      Continue working on your saved drafts
    </Typography>

    {drafts.length === 0 ? (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <DescriptionIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">No drafts yet</Typography>
      </Box>
    ) : (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {drafts.map((draft) => (
          <Box key={draft.id} sx={{ flex: '1 1 calc(33.333% - 24px)', minWidth: '280px' }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>{draft.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {draft.questionCount} question{draft.questionCount !== 1 ? 's' : ''}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Last updated: {new Date(draft.updatedAt).toLocaleDateString()}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" startIcon={<EditIcon />}
                  onClick={() => handleEdit(draft)}>Edit</Button>
                <IconButton size="small" color="error"
                  onClick={() => setDeleteDialog({ open: true, draftId: draft.id })}>
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Box>
        ))}
      </Box>
    )}

    {/* Delete Confirmation Dialog */}
    <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, draftId: null })}>
      <DialogTitle>Delete Draft?</DialogTitle>
      <DialogContent>Are you sure you want to delete this draft? This action cannot be undone.</DialogContent>
      <DialogActions>
        <Button onClick={() => setDeleteDialog({ open: false, draftId: null })}>Cancel</Button>
        <Button color="error" onClick={() => handleDelete(deleteDialog.draftId!)}>Delete</Button>
      </DialogActions>
    </Dialog>
  </Container>
);
```

---

## 6. AuthCallback Page (`src/pages/AuthCallback.tsx`)

### Purpose
Handles Google OAuth callback after authentication redirect. Shows status screens.

### Code Structure

```tsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert, Container } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
```

### State

```tsx
const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
const [message, setMessage] = useState('Connecting your Google account...');
```

### Logic

```tsx
useEffect(() => {
  const handleCallback = async () => {
    const success = searchParams.get('success');
    const error = searchParams.get('error');

    if (error) {
      setStatus('error');
      setMessage(decodeURIComponent(error));
      setTimeout(() => navigate('/'), 3000);
    } else if (success === 'true') {
      setStatus('success');
      setMessage('Google account connected successfully!');
      const redirectTo = localStorage.getItem('oauth_redirect') || '/preview';
      localStorage.removeItem('oauth_redirect');
      setTimeout(() => navigate(redirectTo, { state: { googleConnected: true }, replace: true }), 2000);
    } else {
      setStatus('error');
      setMessage('Invalid callback parameters');
      setTimeout(() => navigate('/'), 3000);
    }
  };
  handleCallback();
}, [searchParams, navigate]);
```

### JSX — Three Status States

**Processing:**
```tsx
<Box sx={{ textAlign: 'center', p: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
  <CircularProgress size={60} sx={{ mb: 3 }} />
  <Typography variant="h5" gutterBottom>Connecting Google Account</Typography>
  <Typography color="text.secondary">{message}</Typography>
</Box>
```

**Success:**
```tsx
<CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
<Typography variant="h5" gutterBottom color="success.main">Success!</Typography>
<Typography color="text.secondary">{message}</Typography>
<Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Redirecting...</Typography>
```

**Error:**
```tsx
<ErrorIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
<Typography variant="h5" gutterBottom color="error.main">Connection Failed</Typography>
<Alert severity="error" sx={{ mt: 2, mb: 2 }}>{message}</Alert>
<Typography variant="body2" color="text.secondary">Redirecting to home...</Typography>
```

---

## 7. OAuthSuccess Page (`src/pages/OAuthSuccess.tsx`)

### Purpose
Simple success page used during OAuth flow — redirects to `/preview` after 2 seconds.

### Code

```tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';

const OAuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/preview', { replace: true });
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <CircularProgress sx={{ mb: 2 }} />
      <Typography variant="h5">Google Account Connected!</Typography>
      <Typography color="text.secondary">Redirecting...</Typography>
    </Box>
  );
};
```

---

## 8. WorkspacePage (`src/pages/WorkspacePage.tsx`)

### Status
This page exists in the codebase but is **not currently routed** in `App.tsx`. It was originally used as a full-screen editor workspace. Contains file upload, question editing, and form preview logic. Kept for potential future use.

### Key Imports
```tsx
import { SplitPane, LeftPane, RightPane } from '@/components/layout/...';
import { DropZone, FilePreview } from '@/components/upload/...';
import { DocViewer } from '@/components/document/...';
import { FormPreview } from '@/components/form/...';
import { ParsingProgress } from '@/components/progress/...';
```

---

## Shared Components

### UploadBox (`src/components/UploadBox.tsx`)

File upload component with drag-and-drop support.

```tsx
interface UploadBoxProps {
  onFileSelect: (file: File | null) => void;
  disabled?: boolean;
}
```

**Features:**
- Drag & drop (dragover, dragenter, dragleave, drop handlers)
- File type validation (DOCX or TXT only)
- File size check (10MB max)
- File display with remove button
- Disabled state support

**CSS classes:** `.upload-box-container`, `.upload-box`, `.drag-active`, `.disabled`, `.upload-icon`, `.upload-title`, `.upload-description`, `.upload-info`

### Loader (`src/components/Loader.tsx`)

```tsx
interface LoaderProps { text?: string; }
```

Renders a CSS spinning circle + optional text. Used throughout for loading states.

**CSS classes:** `.loader-container`, `.loader` (with `@keyframes spin`), `.loader-text`

### QuestionItem (`src/components/QuestionItem.tsx`)

Dynamic question editor with support for multiple question types.

```tsx
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
```

**Question types supported:**
- `SHORT_ANSWER`
- `PARAGRAPH`
- `MULTIPLE_CHOICE`
- `CHECKBOX`
- `DROPDOWN`
- `LINEAR_SCALE`

**Features:**
- Drag handle icon (GripVertical)
- Question text input
- Type selector dropdown
- Required checkbox
- Dynamic options (add/remove for MULTIPLE_CHOICE, CHECKBOX, DROPDOWN)
- Scale min/max inputs (for LINEAR_SCALE)

**CSS classes:** `.question-item`, `.question-header`, `.question-drag-handle`, `.question-number`, `.question-delete-button`, `.question-content`, `.form-group`, `.form-label`, `.form-input`, `.form-select`, `.form-checkbox-label`

### Navbar (`src/components/Navbar.tsx`)

Sticky navigation bar with auth integration.

```tsx
interface User {
  uid: string;
  name: string | null;
  email: string | null;
  picture: string | null;
}

interface AuthContext {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}
```

**Features:**
- Google SVG logo + "AI Form Generator" text
- Desktop menu: "My Forms" link (when authenticated), sign-in/sign-out button
- User avatar display (when authenticated)
- Mobile menu toggle (Menu/X icons)
- GSAP entrance animation (slide down + fade in)

**CSS classes:** `.navbar`, `.navbar-container`, `.navbar-logo`, `.navbar-menu`, `.navbar-link`, `.navbar-user`, `.navbar-user-avatar`, `.navbar-user-name`, `.navbar-button-primary`, `.navbar-button-secondary`, `.navbar-mobile-toggle`, `.navbar-mobile-menu`, `.navbar-mobile-link`, `.navbar-mobile-user`

### Footer (`src/components/Footer.tsx`)

```tsx
const Footer: React.FC = () => {
  // Inline footer with copyright + links
};
```

**CSS classes:** `.footer`, `.footer-container`, `.footer-content`, `.footer-text`, `.footer-links`, `.footer-link`, `.footer-divider`

---

## Routing (`src/App.tsx`)

```tsx
<AuthProvider>
  <div className="app">
    <Navbar />
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/preview" element={<ProtectedRoute><Preview /></ProtectedRoute>} />
        <Route path="/generated" element={<ProtectedRoute><Generated /></ProtectedRoute>} />
        <Route path="/my-forms" element={<ProtectedRoute><MyForms /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
    <Footer />
  </div>
</AuthProvider>
```

### ProtectedRoute

Wraps routes that require authentication. Shows loading spinner while checking auth state, redirects to `/` if not authenticated.

### Main Entry (`src/main.tsx`)

```tsx
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/global.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

---

## Animation System

### GSAP ScrollTrigger
- Registered in `Home.tsx` via `gsap.registerPlugin(ScrollTrigger)`
- Applied to each section (hero, features, upload area)
- Configured with `start: 'top 80%'`, `toggleActions: 'play none none reverse'`
- Cleanup handled via `gsap.context()` revert

### Anime.js
- Used for the hero title breathing pulse effect on Home page
- Imported as `{ animate }` from `animejs`

### Reduced Motion
- `useGSAPAnimation()` hook checks `prefers-reduced-motion` media query
- All animations are skipped when `reduceMotion` is `true`

---

## Type System

### `src/types/api.ts`
| Interface | Description |
|-----------|-------------|
| `ParsedQuestion` | Question extracted from document |
| `UploadResponse` | Response from file upload API |
| `GenerateFormResponse` | Response from form generation API |
| `UserForm` | User's saved Google Form |
| `UserDraft` | Saved draft with questions |

### `src/types/form.ts`
| Type | Values |
|------|--------|
| `QuestionType` | `SHORT_ANSWER`, `PARAGRAPH`, `MULTIPLE_CHOICE`, `CHECKBOX`, `DROPDOWN`, `LINEAR_SCALE` |
| `ParsingStage` | `idle`, `uploading`, `parsing`, `ready`, `error` |

---

## CSS Architecture

All styles are in `src/styles/global.css` using CSS custom properties for theme variables. No Tailwind — the styling is purely CSS custom properties + vanilla CSS.

**Root variables:**
```css
:root {
  --primary: #4285F4;     /* Google Blue */
  --danger: #DB4437;      /* Google Red */
  --success: #0F9D58;     /* Google Green */
  --warning: #F4B400;     /* Google Yellow */
  --grey-50 through --grey-900
  --shadow-sm, --shadow-md, --shadow-lg
  --radius-sm, --radius-md, --radius-lg, --radius-xl
}
```
