
import React, { useState, useEffect } from 'react';
import { DailyLog, AppTab } from './types';
import Layout from './components/Layout';
import DailyTracker from './components/DailyTracker';
import Dashboard from './components/Dashboard';
import { getISODate } from './utils';
import { fetchDailyMotivation } from './services/geminiService';
import { Quote } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('daily');
  const [logs, setLogs] = useState<Record<string, DailyLog>>({});
  const [motivation, setMotivation] = useState<string>('');

  // Load data on mount
  useEffect(() => {
    const saved = localStorage.getItem('dastyar_logs');
    if (saved) {
      setLogs(JSON.parse(saved));
    }
  }, []);

  // Save data whenever it changes
  const saveLog = (log: DailyLog) => {
    const updated = { ...logs, [log.date]: log };
    setLogs(updated);
    localStorage.setItem('dastyar_logs', JSON.stringify(updated));
  };

  // Fetch motivation for today
  useEffect(() => {
    const today = getISODate(new Date());
    const todayLog = logs[today];
    if (todayLog) {
      const pCount = Object.values(todayLog.prayers).filter(p => p !== 'none').length;
      const dCount = todayLog.duas.length;
      fetchDailyMotivation(pCount, dCount).then(setMotivation);
    } else {
      setMotivation('منتظر ثبت بندگی شما هستیم...');
    }
  }, [logs]);

  const renderContent = () => {
    switch (activeTab) {
      case 'daily':
        return (
          <div className="space-y-6">
             {/* Motivation Banner */}
            {motivation && (
              <div className="bg-emerald-900/90 text-white p-6 rounded-3xl shadow-xl border-t-4 border-amber-400 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 islamic-pattern"></div>
                <div className="relative z-10">
                  <Quote className="w-8 h-8 text-amber-400 mb-2 opacity-50" />
                  <p className="text-lg font-bold leading-relaxed italic text-emerald-50">« {motivation} »</p>
                </div>
              </div>
            )}
            <DailyTracker logs={logs} onSave={saveLog} />
          </div>
        );
      case 'dashboard':
        return <Dashboard logs={logs} />;
      case 'settings':
        return (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-emerald-50 text-center space-y-4">
            <h2 className="text-emerald-900 font-bold text-xl">درباره دستیار بندگی</h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              این برنامه یک ابزار جامع برای ثبت و پیگیری فعالیت‌های معنوی شماست. 
              هدف ما ایجاد انگیزه برای نظم بیشتر در بندگی است.
            </p>
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
               <button 
                onClick={() => {
                  if(confirm('آیا مطمئن هستید که می‌خواهید تمام داده‌ها را پاک کنید؟')){
                    localStorage.removeItem('dastyar_logs');
                    setLogs({});
                    alert('داده‌ها با موفقیت پاک شدند.');
                  }
                }}
                className="w-full py-3 bg-rose-50 text-rose-600 rounded-2xl text-xs font-bold"
               >
                پاکسازی کل داده‌ها
               </button>
               <p className="text-[10px] text-slate-400 mt-4 font-light">نسخه ۱.۰.۰</p>
            </div>
          </div>
        );
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} title="دستیار بندگی">
      {renderContent()}
    </Layout>
  );
};

export default App;
