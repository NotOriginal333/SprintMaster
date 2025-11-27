import { styled } from '@mui/material/styles';
import { Dialog, Box, Chip } from '@mui/material';

export const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.shape.borderRadius * 2,
    padding: theme.spacing(2),
    minWidth: 500,
  },
}));

export const HeaderBox = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: 16,
});

export const SectionTitle = styled('div')(({ theme }) => ({
  fontSize: '0.85rem',
  fontWeight: 'bold',
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
  marginTop: theme.spacing(2),
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}));