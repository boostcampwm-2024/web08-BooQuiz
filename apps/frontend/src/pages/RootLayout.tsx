import Navbar from '@/components/common/NavBar';
import { Outlet } from 'react-router-dom';

const RootLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 bg-gray-50">
                <div className="h-full container mx-auto px-4 sm:px-6 lg:px-8 py-4 ">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default RootLayout;
