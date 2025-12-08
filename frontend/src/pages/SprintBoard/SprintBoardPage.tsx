import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {Box, Typography, Paper, Chip, Stack, IconButton, CircularProgress, Divider} from '@mui/material';
import {ArrowBack, BugReport as BugIcon, Assignment as TaskIcon, Warning as WarningIcon} from '@mui/icons-material';
import api from '../../api/axios';

export const SprintBoardPage = () => {
    const {sprintId} = useParams();
    const navigate = useNavigate();

    const [timeline, setTimeline] = useState<any[]>([]);
    const [sprintInfo, setSprintInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!sprintId) return;
            setLoading(true);
            try {
                const [infoRes, timelineRes] = await Promise.all([
                    api.get(`sprints/${sprintId}/`),
                    api.get(`sprints/${sprintId}/timeline/`)
                ]);
                setSprintInfo(infoRes.data);
                setTimeline(timelineRes.data);
            } catch (error) {
                console.error("Failed to load sprint data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [sprintId]);

    if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress/></Box>;
    if (!sprintInfo) return <Typography>Спринт не знайдено</Typography>;

    return (
        <Box>
            <Box display="flex" alignItems="center" gap={2} mb={4}>
                <IconButton onClick={() => navigate(-1)}><ArrowBack/></IconButton>
                <Box>
                    <Typography variant="h4" fontWeight="bold">{sprintInfo.name}</Typography>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Typography variant="body2" color="text.secondary">
                            {sprintInfo.start_date} — {sprintInfo.end_date}
                        </Typography>
                        <Chip
                            label={sprintInfo.is_active ? "Активний" : "Завершено"}
                            color={sprintInfo.is_active ? "success" : "default"}
                            size="small"
                            variant="outlined"
                        />
                    </Box>
                </Box>
            </Box>

            <Typography variant="h6" gutterBottom sx={{fontWeight: 'bold', mb: 3}}>
                Хронологія подій (Timeline)
            </Typography>

            <Box sx={{display: 'flex', gap: 2, overflowX: 'auto', pb: 2, minHeight: 400}}>
                {timeline.length === 0 ? (
                    <Typography color="text.secondary" sx={{p: 2}}>
                        Подій у цьому спринті ще не зафіксовано.
                    </Typography>
                ) : (
                    timeline.map((day, index) => (
                        <Paper
                            key={index}
                            elevation={2}
                            sx={{
                                minWidth: 320,
                                maxWidth: 320,
                                p: 0,
                                bgcolor: '#fff',
                                flexShrink: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                borderRadius: 2,
                                borderTop: `4px solid ${day.bugs.length > 0 ? '#d32f2f' : '#1976d2'}`
                            }}
                        >
                            <Box sx={{p: 2, bgcolor: '#f8f9fa', borderBottom: '1px solid #eee'}}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {new Date(day.date).toLocaleDateString(undefined, {
                                        weekday: 'long',
                                        day: 'numeric',
                                        month: 'long'
                                    })}
                                </Typography>
                                <Box display="flex" gap={1} mt={1}>
                                    {day.tasks.length > 0 &&
                                        <Chip size="small" label={`${day.tasks.length} tasks`} color="primary"
                                              variant="outlined"/>}
                                    {day.bugs.length > 0 &&
                                        <Chip size="small" label={`${day.bugs.length} bugs`} color="error"/>}
                                </Box>
                            </Box>

                            <Stack spacing={2} sx={{p: 2, overflowY: 'auto', flexGrow: 1}}>
                                {day.bugs.length > 0 && (
                                    <Box>
                                        <Typography variant="caption" fontWeight="bold" color="error"
                                                    sx={{mb: 1, display: 'block'}}>
                                            ЗНАЙДЕНІ ПОМИЛКИ
                                        </Typography>
                                        {day.bugs.map((b: any) => (
                                            <Paper key={b.id} elevation={0} sx={{
                                                p: 1.5,
                                                mb: 1,
                                                border: '1px solid #ffcdd2',
                                                bgcolor: '#ffebee'
                                            }}>
                                                <Box display="flex" alignItems="start" gap={1}>
                                                    <BugIcon fontSize="small" color="error" sx={{mt: 0.3}}/>
                                                    <Box>
                                                        <Typography variant="body2" fontWeight="500"
                                                                    sx={{lineHeight: 1.2}}>{b.title}</Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {b.priority} • {b.status}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Paper>
                                        ))}
                                    </Box>
                                )}

                                {day.tasks.length > 0 && (
                                    <Box>
                                        <Typography variant="caption" fontWeight="bold" color="primary"
                                                    sx={{mb: 1, display: 'block'}}>
                                            СТВОРЕНО ЗАДАЧІ
                                        </Typography>
                                        {day.tasks.map((t: any) => (
                                            <Paper key={t.id} elevation={0}
                                                   sx={{p: 1.5, mb: 1, border: '1px solid #e0e0e0'}}>
                                                <Box display="flex" alignItems="start" gap={1}>
                                                    <TaskIcon fontSize="small" color="primary" sx={{mt: 0.3}}/>
                                                    <Box>
                                                        <Typography variant="body2" fontWeight="500"
                                                                    sx={{lineHeight: 1.2}}>{t.title}</Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {t.story_points} SP • {t.status.replace('_', ' ')}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Paper>
                                        ))}
                                    </Box>
                                )}

                                {day.tasks.length === 0 && day.bugs.length === 0 && (
                                    <Typography variant="caption" color="text.disabled" align="center"
                                                sx={{display: 'block', mt: 4}}>
                                        Активності не було
                                    </Typography>
                                )}
                            </Stack>
                        </Paper>
                    ))
                )}
            </Box>
        </Box>
    );
};