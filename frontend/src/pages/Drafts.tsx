import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { getUserDrafts, deleteDraft } from '../services/api';
import type { UserDraft } from '@/types/api';
import LoadingScreen from '../components/Loader';

interface DeleteDialogState {
  open: boolean;
  draftId: string | null;
}

const Drafts = () => {
  const navigate = useNavigate();
  const [drafts, setDrafts] = useState<UserDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({ open: false, draftId: null });

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

  const handleEdit = (draft: UserDraft) => {
    navigate('/preview', {
      state: {
        questions: draft.questions,
        fileName: draft.title,
        draftId: draft.id
      }
    });
  };

  const handleDelete = async (draftId: string) => {
    try {
      await deleteDraft(draftId);
      setDrafts(drafts.filter(d => d.id !== draftId));
      setDeleteDialog({ open: false, draftId: null });
    } catch (error) {
      console.error('Failed to delete draft:', error);
    }
  };

  if (loading) {
    return <LoadingScreen text="Loading drafts..." />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" gutterBottom fontWeight={600}>
        My Drafts
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Continue working on your saved drafts
      </Typography>

      {drafts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <DescriptionIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No drafts yet
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {drafts.map((draft) => (
            <Box key={draft.id} sx={{ flex: '1 1 calc(33.333% - 24px)', minWidth: '280px' }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {draft.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {draft.questionCount} question{draft.questionCount !== 1 ? 's' : ''}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Last updated: {new Date(draft.updatedAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(draft)}
                  >
                    Edit
                  </Button>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => setDeleteDialog({ open: true, draftId: draft.id })}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Box>
          ))}
        </Box>
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
          <Button
            color="error"
            onClick={() => handleDelete(deleteDialog.draftId!)}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Drafts;
