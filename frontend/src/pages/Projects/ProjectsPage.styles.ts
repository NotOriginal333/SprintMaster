import { styled } from '@mui/material/styles';
import { Box, Paper } from '@mui/material';

export const PageHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
}));

export const ProjectCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s, box-shadow 0.2s',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

export const StatusBadge = styled(Box)<{ status: string }>(({ theme, status }) => {
  let color = theme.palette.grey[500];
  if (status === 'ACTIVE') color = theme.palette.success.main;
  if (status === 'ON_HOLD') color = theme.palette.warning.main;
  if (status === 'ARCHIVED') color = theme.palette.text.disabled;

  return {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '16px',
    backgroundColor: color,
    color: '#fff',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    marginBottom: theme.spacing(2),
  };
});