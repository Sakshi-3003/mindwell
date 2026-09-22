import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#FFF8F3] flex">
      <Sidebar />
      <main className="flex-1 lg:ml-0 mt-14 lg:mt-0 overflow-x-hidden">
        <div className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
        {/* Footer */}
        <footer className="border-t border-[#F7C8D8]/20 mt-12 py-8 px-6">
          <div className="max-w-[1400px] mx-auto text-center space-y-2">
            <p className="text-xs text-[#756D6D] font-medium">
              MINDWELL — Independent Data Analytics Project
            </p>
            <p className="text-[10px] text-[#756D6D]/70">
              Built with React, TypeScript, Tailwind CSS and Recharts
            </p>
            <p className="text-[10px] text-[#756D6D]/70">
              Dataset: Mendeley Data — CC BY 4.0 · Not a clinical diagnostic tool
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
