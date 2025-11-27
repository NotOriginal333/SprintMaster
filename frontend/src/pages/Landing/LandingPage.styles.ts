import { styled } from '@mui/material/styles';
import { Box, Paper } from '@mui/material';

export const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
  color: 'white',
  padding: theme.spacing(15, 2),
  textAlign: 'center',
  borderRadius: '0 0 50% 50% / 4%', // Легкий вигин знизу
}));

export const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  height: '100%',
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'translateY(-8px)',
  },
}));

export const SectionTitle = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(6),
  marginTop: theme.spacing(8),
  '& h4': {
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
  },
  '& p': {
    color: theme.palette.text.secondary,
    maxWidth: 600,
    margin: '0 auto',
  }
}));