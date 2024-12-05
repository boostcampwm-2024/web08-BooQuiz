import { Route, Routes } from 'react-router-dom';
import MainPage from '@/pages/MainPage';
import RootLayout from '../pages/RootLayout';
import QuizZonePage from '@/pages/QuizZonePage';
import CreateQuizZonePage from '@/pages/CreateQuizZonePage.tsx';
import NotFound from '@/pages/NotFoundPage';

function Router() {
    return (
        <Routes>
            <Route element={<RootLayout />}>
                <Route path="/" element={<MainPage />} />
                <Route path="/:quizZoneId" element={<QuizZonePage />} />
                <Route path="/quiz-zone" element={<CreateQuizZonePage />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}

export default Router;
