import React from 'react';
import {
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area, ComposedChart, Line
} from 'recharts';
import {Box, Typography, Paper, Grid, Divider} from '@mui/material';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
const PRIORITY_COLORS: any = {CRITICAL: '#d32f2f', HIGH: '#f57c00', MEDIUM: '#fbc02d', LOW: '#388e3c'};
const STATUS_COLORS: any = {NEW: '#cfd8dc', IN_PROGRESS: '#90caf9', FIXED: '#a5d6a7', CLOSED: '#81c784'};

const CustomTooltip = ({active, payload, label, unit = ''}: any) => {
    if (active && payload && payload.length) {
        return (
            <Paper sx={{p: 1.5, border: '1px solid #ccc'}}>
                <Typography variant="subtitle2" fontWeight="bold">{label}</Typography>
                {payload.map((entry: any, index: number) => (
                    <Box key={index} display="flex" gap={1} alignItems="center">
                        <Box sx={{width: 10, height: 10, bgcolor: entry.fill, borderRadius: '50%'}}/>
                        <Typography variant="body2">
                            {entry.name}: <strong>{entry.value} {unit}</strong>
                        </Typography>
                    </Box>
                ))}
            </Paper>
        );
    }
    return null;
};

interface Props {
    data: any;
    type: 'PROJECT' | 'SPRINT' | 'BUGS';
}

export const ReportCharts = ({data, type}: Props) => {
    if (!data || Object.keys(data).length === 0) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height={200}>
                <Typography color="text.secondary">Дані для візуалізації відсутні</Typography>
            </Box>
        );
    }

    // ===================== PROJECT CHARTS =====================
    const renderProjectCharts = () => {
        // Формуємо дані тільки з реальних значень
        const tasksPieData = [
            {name: 'Completed', value: data.tasks?.completed || 0},
            {name: 'In Progress', value: data.tasks?.in_progress || 0},
        ].filter(i => i.value > 0); // Приховуємо нульові сектори

        const spData = [
            {
                name: 'Story Points',
                Total: data.story_points?.total || 0,
                Burned: data.story_points?.burned || 0
            }
        ];

        return (
            <Grid container spacing={3}>
                {/* 1. Загальний статус (Pie) */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={0} sx={{p: 2, height: 450, border: '1px solid #eee'}}>
                        <Typography variant="h6" align="center" gutterBottom fontWeight="bold">Статус Задач</Typography>
                        <Divider sx={{mb: 2}}/>
                        {tasksPieData.length > 0 ? (
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={tasksPieData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={90}
                                        dataKey="value"
                                        label
                                    >
                                        {tasksPieData.map((entry, index) => <Cell key={`cell-${index}`}
                                                                                  fill={COLORS[index]}/>)}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip unit="tasks"/>}/>
                                    <Legend wrapperStyle={{paddingTop: '10px'}}/>
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                                <Typography color="text.secondary">Немає активних задач</Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>

                {/* 2. Прогрес SP (Bar) */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={0} sx={{p: 2, height: 450, border: '1px solid #eee'}}>
                        <Typography variant="h6" align="center" gutterBottom fontWeight="bold">Прогрес (SP)</Typography>
                        <Divider sx={{mb: 2}}/>
                        <ResponsiveContainer>
                            <BarChart data={spData} barSize={60}>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis dataKey="name"/>
                                <YAxis/>
                                <Tooltip/>
                                <Legend/>
                                <Bar dataKey="Total" fill="#8884d8" name="Всього" radius={[4, 4, 0, 0]}/>
                                <Bar dataKey="Burned" fill="#82ca9d" name="Виконано" radius={[4, 4, 0, 0]}/>
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
        );
    };

    // ===================== BUGS CHARTS =====================
    const renderBugCharts = () => {
        // Спробуємо взяти дані з data.bugs_breakdown (якщо бекенд їх надішле в майбутньому)
        // Зараз ми не маємо деталізації на бекенді, тому показуємо заглушку або те що є
        const priorityPieData = data.bugs_breakdown || [];

        if (priorityPieData.length === 0) {
            return (
                <Box p={3} textAlign="center">
                    <Typography color="text.secondary">
                        Детальна статистика багів відсутня. Оновіть логіку звіту на сервері.
                    </Typography>
                </Box>
            );
        }

        return (
            <Grid container spacing={3} justifyContent="center">
                <Grid item xs={12} md={8}>
                    <Paper elevation={0} sx={{p: 2, height: 450, border: '1px solid #eee'}}>
                        <Typography variant="h6" align="center" gutterBottom fontWeight="bold">Баги за
                            Пріоритетом</Typography>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={priorityPieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    dataKey="value"
                                    label
                                >
                                    {priorityPieData.map((entry: any) => <Cell key={entry.name}
                                                                               fill={PRIORITY_COLORS[entry.name] || COLORS[0]}/>)}
                                </Pie>
                                <Tooltip content={<CustomTooltip unit="bugs"/>}/>
                                <Legend wrapperStyle={{paddingTop: '10px'}}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
        );
    };

    // ===================== SPRINT CHARTS =====================
    const renderSprintCharts = () => {
        // Очікуємо масив burndown з бекенду
        const sprintProgressData = data.burndown || [];

        if (sprintProgressData.length === 0) {
            return (
                <Box p={3} textAlign="center">
                    <Typography color="text.secondary">
                        Дані Burndown відсутні. Необхідно зібрати історію спринта.
                    </Typography>
                </Box>
            );
        }

        return (
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper elevation={0} sx={{p: 2, height: 450, border: '1px solid #eee'}}>
                        <Typography variant="h6" align="center" gutterBottom fontWeight="bold">Sprint
                            Burndown</Typography>
                        <ResponsiveContainer>
                            <ComposedChart data={sprintProgressData}>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis dataKey="day" tick={{fontSize: 12}}/>
                                <YAxis tick={{fontSize: 12}}
                                       label={{value: 'Story Points', angle: -90, position: 'insideLeft'}}/>
                                <Tooltip content={<CustomTooltip unit="SP"/>}/>
                                <Legend/>
                                <Area type="monotone" dataKey="ideal" stroke="#8884d8" fill="#8884d8" fillOpacity={0.1}
                                      name="Ідеальний графік"/>
                                <Line type="monotone" dataKey="remaining" stroke="#ff7300" strokeWidth={3} dot={{r: 5}}
                                      name="Залишилось SP"/>
                                <Bar dataKey="completedToday" barSize={20} fill="#82ca9d" opacity={0.5}
                                     name="Закрито за день"/>
                            </ComposedChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
        );
    };

    switch (type) {
        case 'BUGS':
            return renderBugCharts();
        case 'SPRINT':
            return renderSprintCharts();
        default:
            return renderProjectCharts();
    }
};