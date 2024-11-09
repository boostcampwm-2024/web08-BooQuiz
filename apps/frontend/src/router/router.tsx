import { Route, Routes } from 'react-router-dom';
import MainPage from '@/pages/MainPage';
import RootLayout from '../pages/RootLayout';
import QuizZonePage from '../pages/QuizZonePage';
import QuizWaitingPage from '@/pages/QuizWaitingPage';
import QuizZoneWaitingPage from '@/pages/QuizZoneWaitingPage';
import QuizResultPage from '@/pages/QuizResultPage';

function Router() {
    return (
        <Routes>
            <Route element={<RootLayout />}>
                <Route path="/" element={<MainPage />} />
                <Route path="/quiz" element={<QuizZonePage />} />
                <Route path="/quizZoneWait" element={<QuizZoneWaitingPage />} />
                <Route path="/waiting" element={<QuizWaitingPage />} />
                <Route path="/result" element={<QuizResultPage />} />
            </Route>
        </Routes>
    );
}

export default Router;
