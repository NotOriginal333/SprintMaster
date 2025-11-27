import { styled } from '@mui/material/styles';
import { Box, Paper } from '@mui/material';

export const BoardContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(3),
  overflowX: 'auto',
  paddingBottom: theme.spacing(2),
  minHeight: 'calc(100vh - 200px)', // На всю висоту
}));

export const KanbanColumn = styled(Paper)(({ theme }) => ({
  minWidth: 300,
  width: 300,
  backgroundColor: theme.palette.grey[100],
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export const TaskCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: '#fff',
  cursor: 'grab',
  borderLeft: `4px solid ${theme.palette.primary.main}`,
  '&:hover': {
    boxShadow: theme.shadows[3],
  },
  '&:active': {
    cursor: 'grabbing',
  },
}));