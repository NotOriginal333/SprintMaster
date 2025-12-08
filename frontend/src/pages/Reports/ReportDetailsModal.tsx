import React from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Typography, Box, Chip, Divider, Grid, Paper, Avatar
} from '@mui/material';
import {Assessment, CalendarToday, Timeline, CheckCircle, BugReport} from '@mui/icons-material';
import {ReportCharts} from '../../components/Charts/ReportCharts';
import type {Report} from '../../types';

interface Props {
    open: boolean;
    onClose: () => void;
    report: Report | null;
}

const StatBox = ({icon, title, value, color, subValue}: any) => (
    <Paper elevation={0}
           sx={{p: 2, border: '1px solid #eee', height: '100%', display: 'flex', flexDirection: 'column'}}>
        <Box display="flex" alignItems="center" gap={1} mb={1} color={`${color}.main`}>
            {icon}
            <Typography variant="subtitle2" fontWeight="bold">{title}</Typography>
        </Box>
        <Typography variant="h4" fontWeight="bold" color={`${color}.main`} sx={{mt: 'auto'}}>
            {value}
        </Typography>
        {subValue && (
            <Typography variant="caption" color="text.secondary" sx={{mt: 1}}>
                {subValue}
            </Typography>
        )}
    </Paper>
);

export const ReportDetailsModal = ({open, onClose, report}: Props) => {
    if (!report) return null;

    const data = report.data || {};

    const totalSp = data.story_points?.total || 0;
    const burnedSp = data.story_points?.burned || 0;
    const completionRate = totalSp > 0 ? Math.round((burnedSp / totalSp) * 100) : 0;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
            <DialogTitle sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                bgcolor: '#f8f9fa',
                borderBottom: '1px solid #eee',
                py: 2
            }}>
                <Avatar sx={{bgcolor: 'primary.main'}}><Assessment/></Avatar>
                <Box>
                    <Typography variant="h6" fontWeight="bold" sx={{lineHeight: 1.2}}>
                        {data.project_name || `Project #${report.project}`}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={0.5} color="text.secondary">
                        <CalendarToday fontSize="small"/>
                        <Typography variant="caption">
                            Згенеровано: {new Date(report.created_at).toLocaleString()}
                        </Typography>
                    </Box>
                </Box>
                <Chip
                    label={report.report_type.replace('_', ' ')}
                    color={report.report_type === 'BUGS' ? 'error' : 'primary'}
                    sx={{ml: 'auto', fontWeight: 'bold'}}
                />
            </DialogTitle>

            <DialogContent sx={{mt: 3}}>

                {/* KPI */}
                <Grid container spacing={2} mb={4}>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatBox
                            icon={<Timeline/>}
                            title="Всього Задач"
                            value={data.tasks?.total || 0}
                            color="info"
                            subValue={`${data.tasks?.in_progress || 0} в роботі`}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatBox
                            icon={<CheckCircle/>}
                            title="Виконано SP"
                            value={data.story_points?.burned || 0}
                            color="success"
                            subValue={`з ${totalSp} запланованих`}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatBox
                            icon={<Assessment/>}
                            title="Прогрес Виконання"
                            value={`${completionRate}%`}
                            color={completionRate > 80 ? 'success' : 'warning'}
                            subValue="за Story Points"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatBox
                            icon={<BugReport/>}
                            title="Активні Баги"
                            value={data.quality?.active_bugs || 0}
                            color="error"
                            subValue={`Якість системи: ${data.quality?.health || 'N/A'}`}
                        />
                    </Grid>
                </Grid>

                <Divider sx={{mb: 3}}>
                    <Chip label="ВІЗУАЛІЗАЦІЯ ДАНИХ" sx={{fontWeight: 'bold'}}/>
                </Divider>

                {/* ГРАФІКИ */}
                <Box sx={{minHeight: 450, p: 1, bgcolor: '#fafafa', borderRadius: 2}}>
                    <ReportCharts data={data} type={report.report_type}/>
                </Box>

            </DialogContent>
            <DialogActions sx={{p: 3, borderTop: '1px solid #eee', bgcolor: '#f8f9fa'}}>
                <Button onClick={onClose} variant="outlined" color="inherit">Закрити звіт</Button>
                <Button onClick={() => window.print()} variant="contained" startIcon={<Assessment/>}>Друк / PDF</Button>
            </DialogActions>
        </Dialog>
    );
};