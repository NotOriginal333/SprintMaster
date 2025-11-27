import { styled } from '@mui/material/styles';
import { Paper, Box } from '@mui/material';

export const FilterBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  flexWrap: 'wrap',
}));

export const PriorityBadge = styled('span')<{ priority: string }>(({ theme, priority }) => {
  const colors: Record<string, string> = {
    LOW: theme.palette.info.main,
    MEDIUM: theme.palette.warning.main,
    HIGH: theme.palette.error.light,
    CRITICAL: theme.palette.error.main,
  };
  return {
    color: colors[priority] || theme.palette.text.primary,
    fontWeight: 'bold',
    fontSize: '0.85rem',
  };
});