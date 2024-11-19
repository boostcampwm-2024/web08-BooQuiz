import { Route, Routes } from 'react-router-dom';
import MainPage from '@/pages/MainPage';
import RootLayout from '../pages/RootLayout';
import QuizZone from '@/pages/QuizZonePage';
import NewQuizZonePage from '@/pages/newQuizZonePage';

function Router() {
    return (
        <Routes>
            <Route element={<RootLayout />}>
                <Route path="/" element={<MainPage />} />
                <Route path="/quizZone" element={<QuizZone pinNumber="123456" />} />
                <Route path="/newQuizZone/:quizZoneId" element={<NewQuizZonePage />} />
            </Route>
        </Routes>
    );
}

export default Router;
