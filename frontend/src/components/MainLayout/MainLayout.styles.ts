import { styled } from '@mui/material/styles';
import { AppBar, Box, Drawer, Toolbar } from '@mui/material';

// Ширина меню (константа використовується і в стилях, і в логіці)
export const DRAWER_WIDTH = 240;

// === Стилізовані компоненти ===

// Головний контейнер сторінки
export const RootBox = styled(Box)({
  display: 'flex',
});

// Верхня панель (AppBar)
// Ми кажемо: на мобільних ширина 100%, на десктопі - зі зміщенням
export const StyledAppBar = styled(AppBar)(({ theme }) => ({
  position: 'fixed',
  [theme.breakpoints.up('sm')]: {
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
    marginLeft: `${DRAWER_WIDTH}px`,
  },
}));

// Навігація (Drawer Container)
export const NavBox = styled(Box)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    width: DRAWER_WIDTH,
    flexShrink: 0,
  },
}));

// Основний контент (Main)
export const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
  },
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh',
}));

// Хак для відступу під хедером (щоб контент не ховався під меню)
export const ToolbarOffset = styled(Toolbar)({});