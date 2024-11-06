import { Outlet } from 'react-router-dom';

const RootLayout = () => {
  return (
    <div className="min-h-screen">
      안녕하세요 레이아웃입니다.
      <Outlet />
    </div>
  );
};

export default RootLayout;
