import { useState, useEffect, useRef, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Container } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Description as DescriptionIcon, CalendarToday as CalendarIcon } from '@mui/icons-material';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getUserDrafts, deleteDraft } from '@/services/api';
import type { UserDraft } from '@/types/api';
import LoadingScreen from '@/components/Loader';
import { useGSAPAnimation } from '@/hooks/useGSAPAnimation';
import '../styles/global.css';

gsap.registerPlugin(ScrollTrigger);

interface DeleteDialogState {
  open: boolean;
  draftId: string | null;
}

const Drafts = () => {
  const navigate = useNavigate();
  const [drafts, setDrafts] = useState<UserDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
    open: false,
    draftId: null,
  });
  const { reduceMotion } = useGSAPAnimation();
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const response = await getUserDrafts();
        setDrafts(response.drafts);
      } catch (error) {
        console.error('Failed to fetch drafts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDrafts();
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      if (boardRef.current) {
        const notes = boardRef.current.querySelectorAll('.folder-card');
        gsap.from(notes, {
          scrollTrigger: {
            trigger: boardRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
          y: 40,
          opacity: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power2.out',
        });
      }
    });

    return () => ctx.revert();
  }, [reduceMotion]);

  const handleEdit = (draft: UserDraft) => {
    navigate('/preview', {
      state: {
        questions: draft.questions,
        fileName: draft.title,
        draftId: draft.id,
      },
    });
  };

  const handleDelete = async (draftId: string) => {
    try {
      await deleteDraft(draftId);
      setDrafts(drafts.filter((d) => d.id !== draftId));
      setDeleteDialog({ open: false, draftId: null });
    } catch (error) {
      console.error('Failed to delete draft:', error);
    }
  };

  if (loading) {
    return <LoadingScreen text="Loading drafts..." />;
  }

  return (
    <div className="page-maritime">
      <Container maxWidth="lg" sx={{ py: 6, position: 'relative', zIndex: 2 }}>
        <Typography variant="h3" gutterBottom fontWeight={600}>
          My Drafts
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Continue working on your saved drafts
        </Typography>

        {drafts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <DescriptionIcon sx={{ fontSize: 80, color: 'grey.300', mb: 2 }} />
            <Typography variant="h5" gutterBottom fontWeight={600}>
              No drafts yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Start creating a form and save progress as you go
            </Typography>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => navigate('/')}
            >
              Create New Form
            </Button>
          </Box>
        ) : (
          <div className="cabinet-grid" ref={boardRef}>
            {drafts.map((draft) => (
              <Box
                key={draft.id}
                sx={{ flex: '1 1 calc(33.333% - 24px)', minWidth: '280px' }}
              >
                <div
                  className="folder-card"
                  style={
                    {
                      '--r': `${(Math.random() - 0.5) * 10}deg`,
                    } as CSSProperties
                  }
                >
                  <div className="folder-card-header">
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 2,
                      }}
                    >
                      <div className="form-thumb">
                        <DescriptionIcon sx={{ fontSize: 24, color: 'coral' }} />
                      </div>
                      <Box className="form-card-date" sx={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'grey.700' }}>
                        <CalendarIcon sx={{ fontSize: 14 }} />
                        {new Date(draft.updatedAt).toLocaleDateString()}
                      </Box>
                    </Box>

                    <Typography
                      variant="h6"
                      fontWeight={600}
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {draft.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {draft.questionCount} question{draft.questionCount !== 1 ? 's' : ''}
                    </Typography>

                    <div className="form-card-links">
                      <div className="form-card-link-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--navy-900)' }}>
                        <span>Edit Draft</span>
                        <div className="form-card-link-actions" style={{ display: 'flex', gap: 8 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(draft)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => setDeleteDialog({ open: true, draftId: draft.id })}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Box>
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, draftId: null })}
        >
          <DialogTitle>Delete Draft?</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this draft? This action cannot be undone.
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog({ open: false, draftId: null })}>
              Cancel
            </Button>
            <Button color="error" onClick={() => handleDelete(deleteDialog.draftId!)}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
};

export default Drafts;