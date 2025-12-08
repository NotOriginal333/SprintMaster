import {Routes, Route, Navigate, useLocation} from 'react-router-dom';
import {useSelector} from 'react-redux';
import type {RootState} from './store';

import {LandingPage} from './pages/Landing/LandingPage';
import {LoginPage} from './pages/LoginPage';
import {RegisterPage} from './pages/Register/RegisterPage';
import {ProjectsPage} from './pages/Projects/ProjectsPage';
import {ProjectDetailsPage} from './pages/ProjectDetails/ProjectDetailsPage';
import {ReportsPage} from './pages/Reports/ReportsPage';
import {MyTasksPage} from './pages/MyTasks/MyTasksPage';
import {SprintBoardPage} from './pages/SprintBoard/SprintBoardPage';

import {MainLayout} from './components/MainLayout/MainLayout';

const RequireAuth = ({children}: { children: JSX.Element }) => {
    const {isAuthenticated} = useSelector((state: RootState) => state.auth);
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{from: location}} replace/>;
    }
    return children;
};

function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/register" element={<RegisterPage/>}/>

            <Route
                path="/dashboard"
                element={
                    <RequireAuth>
                        <MainLayout/>
                    </RequireAuth>
                }
            >
                <Route index element={<ProjectsPage/>}/>
                <Route path="projects/:id" element={<ProjectDetailsPage/>}/>
                <Route path="reports" element={<ReportsPage/>}/>
                <Route path="my-tasks" element={<MyTasksPage/>}/>
                <Route path="sprints/:sprintId" element={<SprintBoardPage/>}/>
            </Route>

            <Route path="*" element={<Navigate to="/" replace/>}/>
        </Routes>
    );
}

export default App;