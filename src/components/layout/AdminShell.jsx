import { Outlet } from 'react-router-dom';
import AdminRoute from '@/routes/AdminRoute';
import AdminSidebar from './AdminSidebar';

export default function AdminShell() {
  return (
    <AdminRoute>
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h1 className="text-lg font-semibold text-gray-800">Admin Panel</h1>
          </header>
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </AdminRoute>
  );
}
