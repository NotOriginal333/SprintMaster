import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {Typography, Button, Grid, Box, Chip, Stack, LinearProgress} from '@mui/material';
import {Add as AddIcon, CalendarToday} from '@mui/icons-material';

import {PageHeader, ProjectCard, StatusBadge} from './ProjectsPage.styles';
import {RoleGuard} from '../../utils/rbac';
import type {AppDispatch, RootState} from '../../store';
import {fetchProjects} from '../../store/projectsSlice';
import {CreateProjectModal} from '../../components/CreateProjectModal/CreateProjectModal';

export const ProjectsPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const {list: projects, loading} = useSelector((state: RootState) => state.projects);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchProjects());
    }, [dispatch]);

    return (
        <Box>
            <PageHeader>
                <Box>
                    <Typography variant="h4" fontWeight="bold">Проєкти</Typography>
                    <Typography variant="body1" color="text.secondary">
                        Керуйте своїми проєктами та командами
                    </Typography>
                </Box>

                <RoleGuard allowedRoles={['PM', 'ADMIN']}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon/>}
                        size="large"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Новий проєкт
                    </Button>
                </RoleGuard>
            </PageHeader>

            {loading && <LinearProgress sx={{mb: 3}}/>}

            <Grid container spacing={3}>
                {projects.map((project) => (
                    <Grid item xs={12} md={6} lg={4} key={project.id}>
                        <ProjectCard elevation={1} onClick={() => navigate(`/dashboard/projects/${project.id}`)}>
                            <Box display="flex" justifyContent="space-between" alignItems="start">
                                <StatusBadge status={project.status}>{project.status}</StatusBadge>
                                <Typography variant="caption" color="text.secondary"
                                            sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                                    <CalendarToday fontSize="inherit"/> {project.start_date}
                                </Typography>
                            </Box>

                            <Typography variant="h6" gutterBottom fontWeight="bold">
                                {project.name}
                            </Typography>

                            <Typography variant="body2" color="text.secondary" sx={{mb: 3, flexGrow: 1}}>
                                {project.description || "Опис відсутній"}
                            </Typography>

                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Stack direction="row" spacing={1}>
                                    <Typography variant="caption" color="text.secondary">Менеджер:</Typography>
                                    <Typography variant="caption" fontWeight="bold">
                                        {project.manager_details ? project.manager_details.username : project.manager}
                                    </Typography>
                                </Stack>
                                <Chip label={`${project.members.length} учасників`} size="small" variant="outlined"/>
                            </Box>
                        </ProjectCard>
                    </Grid>
                ))}
            </Grid>

            <CreateProjectModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </Box>
    );
};