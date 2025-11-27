import { styled } from '@mui/material/styles';
import { Paper, Box } from '@mui/material';

export const StatsGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: theme.spacing(3),
  marginBottom: theme.spacing(4),
}));

export const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderRadius: theme.shape.borderRadius * 2,
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

export const IconWrapper = styled(Box)<{ color: string }>(({ theme, color }) => ({
  width: 56,
  height: 56,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: color, // Світлий фон
  color: theme.palette.getContrastText(color) === '#000' ? '#fff' : color, // Колір іконки
  opacity: 0.9,
}));

export const ReportsTableContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
}));