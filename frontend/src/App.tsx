import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from './store';

// Pages
import { LandingPage } from './pages/Landing/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/Register/RegisterPage';
import { ProjectsPage } from './pages/Projects/ProjectsPage';
import { ProjectDetailsPage } from './pages/ProjectDetails/ProjectDetailsPage';
import { ReportsPage } from './pages/Reports/ReportsPage';
import { MyTasksPage } from './pages/MyTasks/MyTasksPage';

// Components
import { MainLayout } from './components/MainLayout/MainLayout';

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

function App() {
  return (
    <Routes>
      {/* === ПУБЛІЧНА ЗОНА === */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* === ПРИВАТНА ЗОНА (DASHBOARD) === */}
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <MainLayout />
          </RequireAuth>
        }
      >
        {/* При заході на /dashboard відкриваємо список проєктів */}
        <Route index element={<ProjectsPage />} />

        {/* Вкладені маршрути (адреса буде /dashboard/projects/1) */}
        <Route path="projects/:id" element={<ProjectDetailsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="my-tasks" element={<MyTasksPage />} />
      </Route>

      {/* Редірект з неіснуючих сторінок на головну */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;