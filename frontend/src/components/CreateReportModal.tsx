import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, FormControl, InputLabel, Select
} from '@mui/material';
import api from '../api/axios'; // Використаємо api напряму для списку проєктів, щоб не ускладнювати Redux

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (projectId: number, type: string) => void;
}

export const CreateReportModal = ({ open, onClose, onSubmit }: Props) => {
    const [projects, setProjects] = useState<any[]>([]);
    const [selectedProject, setSelectedProject] = useState<string>('');
    const [reportType, setReportType] = useState('PROJECT');

    // Завантажуємо список проєктів, коли відкривається вікно
    useEffect(() => {
        if (open) {
            api.get('projects/').then(res => {
                const data = res.data.results || res.data;
                setProjects(data);
            });
        }
    }, [open]);

    const handleSubmit = () => {
        if (selectedProject) {
            onSubmit(Number(selectedProject), reportType);
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>Генерація звіту</DialogTitle>
            <DialogContent>
                <FormControl fullWidth sx={{ mt: 2, mb: 3 }}>
                    <InputLabel>Оберіть проєкт</InputLabel>
                    <Select
                        value={selectedProject}
                        label="Оберіть проєкт"
                        onChange={(e) => setSelectedProject(e.target.value)}
                    >
                        {projects.map((p) => (
                            <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    select
                    fullWidth
                    label="Тип звіту"
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                >
                    <MenuItem value="PROJECT">Загальний статус проєкту</MenuItem>
                    <MenuItem value="SPRINT">Підсумок спринта (Mock)</MenuItem>
                    <MenuItem value="BUGS">Статистика помилок (Mock)</MenuItem>
                </TextField>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Скасувати</Button>
                <Button onClick={handleSubmit} variant="contained" disabled={!selectedProject}>
                    Запустити генерацію
                </Button>
            </DialogActions>
        </Dialog>
    );
};