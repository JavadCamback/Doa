
import React, { useMemo, useState } from 'react';
import { DailyLog, PRAYER_LABELS } from '../types';
import { getISODate, getRelativeDates, getPersianDayName } from '../utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { TrendingUp, Calendar, Trophy, Zap } from 'lucide-react';

interface DashboardProps {
  logs: Record<string, DailyLog>;
}

const Dashboard: React.FC<DashboardProps> = ({ logs }) => {
  const [range, setRange] = useState<7 | 30>(7);

  const stats = useMemo(() => {
    const dates = getRelativeDates(range).reverse();
    const chartData = dates.map(date => {
      const iso = getISODate(date);
      const log = logs[iso];
      let score = 0;
      if (log) {
        // Calculate daily spiritual score
        Object.values(log.prayers).forEach(p => {
          if (p === 'early') score += 10;
          if (p === 'mid') score += 7;
          if (p === 'late') score += 4;
        });
        score += (log.duas?.length || 0) * 5;
      }
      return {
        name: range === 7 ? getPersianDayName(date) : iso.split('-')[2],
        score,
        prayers: log ? Object.values(log.prayers).filter(p => p !== 'none').length : 0,
        duas: log ? log.duas.length : 0
      };
    });

    // Fix: Explicitly cast Object.values to DailyLog[] and type the reduce accumulator to avoid unknown type errors on lines 38 and 40
    const totalDuas = (Object.values(logs) as DailyLog[]).reduce((acc: number, log) => acc + log.duas.length, 0);
    const totalPrayers = (Object.values(logs) as DailyLog[]).reduce((acc: number, log) => 
      acc + Object.values(log.prayers).filter(p => p !== 'none').length, 0
    );

    return { chartData, totalDuas, totalPrayers };
  }, [logs, range]);

  return (
    <div className="space-y-6 pb-4 animate-in slide-in-from-bottom duration-500">
      {/* Range Toggle */}
      <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-emerald-50">
        <button 
          onClick={() => setRange(7)}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${range === 7 ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400'}`}
        >
          ۷ روز اخیر
        </button>
        <button 
          onClick={() => setRange(30)}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${range === 30 ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400'}`}
        >
          ۳۰ روز اخیر
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-50 flex flex-col items-center gap-2">
          <div className="bg-emerald-50 p-2 rounded-full text-emerald-600">
            <Zap className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black text-emerald-900">{stats.totalPrayers}</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase">نماز ثبت شده</span>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-50 flex flex-col items-center gap-2">
          <div className="bg-amber-50 p-2 rounded-full text-amber-600">
            <Trophy className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black text-amber-900">{stats.totalDuas}</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase">دعای قرائت شده</span>
        </div>
      </div>

      {/* Chart: Activity Score */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-emerald-50">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <h3 className="text-xs font-black text-slate-700">نمودار رشد معنوی (امتیاز بندگی)</h3>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" fontSize={10} tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '10px' }}
                itemStyle={{ fontWeight: 'bold' }}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#059669" 
                strokeWidth={4} 
                dot={{ fill: '#059669', strokeWidth: 2, r: 4, stroke: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart: Duas Frequency */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-emerald-50">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-emerald-600" />
          <h3 className="text-xs font-black text-slate-700">تعداد کارهای عبادی در طول زمان</h3>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.chartData}>
              <Bar dataKey="duas" radius={[4, 4, 0, 0]}>
                {stats.chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.duas > 0 ? '#10b981' : '#f1f5f9'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
