import { Outlet } from 'react-router-dom';

const RootLayout = () => {
    return (
        <div className="min-h-screen min-w-full p-4 flex flex-col items-center justify-center gap-8">
            <Outlet />
        </div>
    );
};

export default RootLayout;
