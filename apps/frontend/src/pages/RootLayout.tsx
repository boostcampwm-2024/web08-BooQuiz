import Navbar from '@/components/common/NavBar';
import { Outlet } from 'react-router-dom';

const RootLayout = () => {
    return (
        <div className="min-h-screen min-w-full flex flex-col items-center justify-center gap-8">
            <Navbar />
            <Outlet />
        </div>
    );
};

export default RootLayout;
