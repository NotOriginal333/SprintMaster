import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Grid, Box, Chip, Stack } from '@mui/material';
import { Add as AddIcon, CalendarToday } from '@mui/icons-material';
import { PageHeader, ProjectCard, StatusBadge } from './ProjectsPage.styles';
import { RoleGuard } from '../../utils/rbac';

const MOCK_PROJECTS = [
  { id: 1, name: 'Course Work System', description: 'Система управління проєктами на Django + React', status: 'ACTIVE', manager: 'Admin', members: 3, date: '2023-10-01' },
  { id: 2, name: 'Corporate Website', description: 'Лендінг для замовника з анімаціями', status: 'ON_HOLD', manager: 'Manager', members: 5, date: '2023-09-15' },
  { id: 3, name: 'Legacy CRM Support', description: 'Підтримка старої системи', status: 'ARCHIVED', manager: 'Admin', members: 1, date: '2023-01-01' },
];

export const ProjectsPage = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <PageHeader>
        <Box>
          <Typography variant="h4" fontWeight="bold">Проєкти</Typography>
          <Typography variant="body1" color="text.secondary">
            Керуйте своїми проєктами та командами
          </Typography>
        </Box>

        {/* Кнопка доступна тільки PM та Admin */}
        <RoleGuard allowedRoles={['PM', 'ADMIN']}>
            <Button variant="contained" startIcon={<AddIcon />} size="large">
                Новий проєкт
            </Button>
        </RoleGuard>
      </PageHeader>

      <Grid container spacing={3}>
        {MOCK_PROJECTS.map((project) => (
          <Grid item xs={12} md={6} lg={4} key={project.id}>
            <ProjectCard elevation={1} onClick={() => navigate(`/dashboard/projects/${project.id}`)}>
              <Box display="flex" justifyContent="space-between" alignItems="start">
                <StatusBadge status={project.status}>{project.status}</StatusBadge>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CalendarToday fontSize="inherit" /> {project.date}
                </Typography>
              </Box>

              <Typography variant="h6" gutterBottom fontWeight="bold">
                {project.name}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>
                {project.description}
              </Typography>

              <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" spacing={1}>
                      <Typography variant="caption" color="text.secondary">Менеджер:</Typography>
                      <Typography variant="caption" fontWeight="bold">{project.manager}</Typography>
                  </Stack>
                  <Chip label={`${project.members} учасників`} size="small" variant="outlined" />
              </Box>
            </ProjectCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};