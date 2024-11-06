import { Route, Routes } from 'react-router-dom';
import MainPage from '@/pages/MainPage';
import RootLayout from '../pages/RootLayout';
import QuizZonePage from '../pages/QuizZonePage';

function Router() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<MainPage />} />
        <Route path="/quiz" element={<QuizZonePage />} />
      </Route>
    </Routes>
  );
}

export default Router;
