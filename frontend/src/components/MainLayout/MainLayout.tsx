import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Divider, Drawer, IconButton, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, Menu, MenuItem, Avatar
} from '@mui/material';
import {
  Menu as MenuIcon, Dashboard as DashboardIcon, Assignment as ProjectIcon,
  BarChart as ReportIcon, Logout as LogoutIcon, Person as PersonIcon
} from '@mui/icons-material';

import { logout } from '../../store/authSlice';
import type { RootState } from '../../store';

// Імпортуємо стилі з сусіднього файлу
import {
  RootBox, StyledAppBar, NavBox, MainContent, ToolbarOffset, DRAWER_WIDTH
} from './MainLayout.styles';

export const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    { text: 'Проєкти', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Мої задачі', icon: <ProjectIcon />, path: '/dashboard/my-tasks' },
    { text: 'Звіти', icon: <ReportIcon />, path: '/dashboard/reports' },
  ];

  // Вміст бокового меню
  const drawerContent = (
    <div>
      <Toolbar sx={{ backgroundColor: 'primary.main', color: 'white' }}>
        <Typography variant="h6" noWrap component="div">
          SprintMaster
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <RootBox>
      {/* 1. Header (AppBar) */}
      <StyledAppBar>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {menuItems.find(i => i.path === location.pathname)?.text || 'Dashboard'}
          </Typography>

          <IconButton onClick={handleMenuOpen} color="inherit">
            <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
              {user?.username?.[0]?.toUpperCase() || <PersonIcon />}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem disabled>Роль: {user?.role || 'User'}</MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
              Вийти
            </MenuItem>
          </Menu>
        </Toolbar>
      </StyledAppBar>

      {/* 2. Sidebar (Drawer) */}
      <NavBox component="nav">
        {/* Мобільна версія */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH }
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Десктопна версія */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH }
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </NavBox>

      {/* 3. Main Content */}
      <MainContent component="main">
        <ToolbarOffset /> {/* Відступ */}
        <Outlet />
      </MainContent>
    </RootBox>
  );
};