import { Route, Routes } from 'react-router-dom';
import MainPage from '@/pages/MainPage';
import RootLayout from '../pages/RootLayout';
import NewQuizZonePage from '@/pages/NewQuizZonePage';

function Router() {
    return (
        <Routes>
            <Route element={<RootLayout />}>
                <Route path="/" element={<MainPage />} />
                <Route path="/newQuizZone/:quizZoneId" element={<NewQuizZonePage />} />
            </Route>
        </Routes>
    );
}

export default Router;
