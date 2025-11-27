import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Grid, Box } from '@mui/material';
import { Speed, Security, GroupWork } from '@mui/icons-material';
import { HeroSection, FeatureCard, SectionTitle } from './LandingPage.styles';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: 'primary.main' }}>
            SprintMaster
          </Typography>
          {!isAuthenticated ? (
            <>
              <Button color="inherit" onClick={() => navigate('/login')}>Вхід</Button>
              <Button variant="contained" onClick={() => navigate('/register')} sx={{ ml: 2 }}>
                Реєстрація
              </Button>
            </>
          ) : (
            <Button variant="contained" onClick={() => navigate('/dashboard')}>
              Перейти в Dashboard
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            Керуйте проєктами легко
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            Сучасна система для управління розробкою програмного забезпечення.
          </Typography>

          <Button
            variant="contained"
            color="secondary"
            size="large"
            sx={{ px: 4, py: 1.5, fontSize: '1.2rem' }}
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
          >
            Розпочати роботу
          </Button>
        </Container>
      </HeroSection>

      {/* Features */}
      <Container maxWidth="lg" sx={{ mb: 10 }}>
        <SectionTitle>
            <Typography variant="h4">Чому SprintMaster?</Typography>
            <Typography variant="body1">
                Ми об'єднали найкращі практики Scrum та Kanban.
            </Typography>
        </SectionTitle>

        {/* justifyContent="center" зробить "трикутник", якщо карток буде 3 на широкому екрані,
            або центруватиме їх, якщо екран вужчий */}
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={4}>
            <FeatureCard elevation={2}>
              <Speed color="primary" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h6" gutterBottom>Швидкість</Typography>
              <Typography color="text.secondary">
                Плануйте спринти та відстежуйте Velocity команди в реальному часі.
              </Typography>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard elevation={2}>
              <GroupWork color="primary" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h6" gutterBottom>Колаборація</Typography>
              <Typography color="text.secondary">
                Зручна дошка Kanban для розподілу задач між розробниками та QA.
              </Typography>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard elevation={2}>
              <Security color="primary" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h6" gutterBottom>Безпека та Ролі</Typography>
              <Typography color="text.secondary">
                Чітке розмежування прав доступу: Admin, PM, Developer, QA.
              </Typography>
            </FeatureCard>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Box sx={{ py: 3, textAlign: 'center', bgcolor: 'grey.200' }}>
        <Typography variant="body2" color="text.secondary">
            © 2025 SprintMaster. Курсовий проєкт.
        </Typography>
      </Box>
    </Box>
  );
};