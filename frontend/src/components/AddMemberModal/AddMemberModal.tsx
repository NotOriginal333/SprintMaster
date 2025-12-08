import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, List, ListItem, ListItemAvatar, Avatar, ListItemText,
    Checkbox, TextField, Box, Typography
} from '@mui/material';
import {PersonAdd} from '@mui/icons-material';
import api from '../../api/axios';
import {addMemberToProject} from '../../store/projectsSlice';
import type {AppDispatch} from '../../store';
import type {User, Project} from '../../types';

interface Props {
    open: boolean;
    onClose: () => void;
    project: Project;
}

export const AddMemberModal = ({open, onClose, project}: Props) => {
    const dispatch = useDispatch<AppDispatch>();
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (open) {
            api.get('users/').then(res => setAllUsers(res.data.results || []));
            setSelectedIds(project.members);
        }
    }, [open, project]);

    const handleToggle = (userId: number) => {
        const currentIndex = selectedIds.indexOf(userId);
        const newChecked = [...selectedIds];

        if (currentIndex === -1) {
            newChecked.push(userId);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setSelectedIds(newChecked);
    };

    const handleSave = async () => {
        await dispatch(addMemberToProject({
            projectId: project.id,
            memberIds: selectedIds
        }));
        onClose();
    };

    // Фільтрація юзерів (пошук)
    const filteredUsers = allUsers.filter(u =>
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.first_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>Керування командою</DialogTitle>
            <DialogContent>
                <Box mb={2}>
                    <TextField
                        fullWidth
                        placeholder="Пошук користувача..."
                        size="small"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Box>
                <List dense sx={{width: '100%', maxHeight: 300, overflow: 'auto'}}>
                    {filteredUsers.map((user) => {
                        const isMember = selectedIds.includes(user.id);
                        return (
                            <ListItem
                                key={user.id}
                                secondaryAction={
                                    <Checkbox
                                        edge="end"
                                        onChange={() => handleToggle(user.id)}
                                        checked={isMember}
                                    />
                                }
                                disablePadding
                            >
                                <ListItemAvatar>
                                    <Avatar>{user.username[0].toUpperCase()}</Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={`${user.first_name} ${user.last_name}`}
                                    secondary={`@${user.username} (${user.role})`}
                                />
                            </ListItem>
                        );
                    })}
                    {filteredUsers.length === 0 && (
                        <Typography align="center" color="text.secondary">Користувачів не знайдено</Typography>
                    )}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Скасувати</Button>
                <Button onClick={handleSave} variant="contained" startIcon={<PersonAdd/>}>
                    Зберегти
                </Button>
            </DialogActions>
        </Dialog>
    );
};