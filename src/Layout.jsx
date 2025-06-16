import { Outlet } from 'react-router-dom';
import Header from '@/components/organisms/Header';

const Layout = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;