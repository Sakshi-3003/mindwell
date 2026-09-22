import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  HeartPulse,
  AlertTriangle,
  Users,
  HandHelping,
  Database,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { path: '/', label: 'Overview', icon: LayoutDashboard },
  { path: '/stress-wellbeing', label: 'Stress & Wellbeing', icon: HeartPulse },
  { path: '/stressors', label: 'Stressors', icon: AlertTriangle },
  { path: '/demographics', label: 'Demographics', icon: Users },
  { path: '/support', label: 'Support & Action', icon: HandHelping },
  { path: '/methodology', label: 'Data & Methodology', icon: Database },
];

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#FFF8F3]/95 backdrop-blur-md border-b border-[#F7C8D8]/30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#F7C8D8] to-[#DDD6F3] flex items-center justify-center">
            <HeartPulse size={16} className="text-[#3F3A3A]" />
          </div>
          <span className="font-semibold text-[#3F3A3A] text-sm">MINDWELL</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl hover:bg-[#F7C8D8]/20 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full z-40
        w-[260px] bg-[#FFF8F3]/95 backdrop-blur-md
        border-r border-[#F7C8D8]/20
        flex flex-col
        transition-transform duration-300 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Brand */}
        <div className="p-6 pb-2">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#F7C8D8] to-[#DDD6F3] flex items-center justify-center shadow-sm">
              <HeartPulse size={20} className="text-[#3F3A3A]" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#3F3A3A] tracking-tight">MINDWELL</h1>
              <p className="text-[10px] text-[#756D6D] leading-tight">Teacher Mental Wellbeing</p>
            </div>
          </div>
          <div className="mt-3 mb-4">
            <span className="inline-block px-2 py-0.5 rounded-full bg-[#DDD6F3]/40 text-[9px] font-medium text-[#756D6D] tracking-wide uppercase">
              Independent Portfolio Project
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setMobileOpen(false)}
              className={() => {
                const isActive = location.pathname === path;
                return `
                  flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200 group
                  ${isActive
                    ? 'bg-gradient-to-r from-[#F7C8D8]/50 to-[#DDD6F3]/30 text-[#3F3A3A] shadow-sm'
                    : 'text-[#756D6D] hover:bg-[#F7C8D8]/15 hover:text-[#3F3A3A]'
                  }
                `;
              }}
            >
              <Icon size={18} className="shrink-0 transition-transform duration-200 group-hover:scale-110" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#F7C8D8]/15">
          <p className="text-[9px] text-[#756D6D] leading-relaxed text-center">
            Evidence-informed insights for understanding educator wellbeing
          </p>
        </div>
      </aside>
    </>
  );
}
