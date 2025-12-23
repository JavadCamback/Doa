
import React from 'react';
import { AppTab } from '../types';
import { Home, BarChart2, Settings, Sparkles } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, title }) => {
  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-stone-50 shadow-2xl overflow-hidden relative border-x border-emerald-100">
      {/* Header */}
      <header className="bg-emerald-800 text-white p-4 shadow-lg flex items-center justify-between sticky top-0 z-50 rounded-b-3xl">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-600/50 p-2 rounded-full">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>
        </div>
        <div className="text-xs text-emerald-100 font-light opacity-80">
          دستیار بندگی
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 islamic-pattern pt-4 px-4">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-md border-t border-emerald-100 py-3 px-8 flex justify-between items-center z-50 rounded-t-3xl shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.1)]">
        <NavItem 
          active={activeTab === 'daily'} 
          onClick={() => setActiveTab('daily')} 
          icon={<Home className="w-6 h-6" />} 
          label="ثبت روزانه" 
        />
        <NavItem 
          active={activeTab === 'dashboard'} 
          onClick={() => setActiveTab('dashboard')} 
          icon={<BarChart2 className="w-6 h-6" />} 
          label="داشبورد" 
        />
        <NavItem 
          active={activeTab === 'settings'} 
          onClick={() => setActiveTab('settings')} 
          icon={<Settings className="w-6 h-6" />} 
          label="تنظیمات" 
        />
      </nav>
    </div>
  );
};

const NavItem: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center transition-all duration-300 ${active ? 'text-emerald-700 scale-110' : 'text-slate-400'}`}
  >
    <div className={`${active ? 'bg-emerald-50 p-2 rounded-xl' : ''}`}>
      {icon}
    </div>
    <span className="text-[10px] mt-1 font-bold">{label}</span>
  </button>
);

export default Layout;
