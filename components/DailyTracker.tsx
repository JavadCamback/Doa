
import React, { useState, useEffect } from 'react';
import { DailyLog, DUA_OPTIONS, PRAYER_LABELS, TIMING_LABELS, PrayerTiming } from '../types';
import { getISODate, getPersianDate, getRelativeDates } from '../utils';
import { CheckCircle2, Circle, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

interface DailyTrackerProps {
  logs: Record<string, DailyLog>;
  onSave: (log: DailyLog) => void;
}

const DailyTracker: React.FC<DailyTrackerProps> = ({ logs, onSave }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const isoDate = getISODate(selectedDate);
  const currentLog = logs[isoDate] || {
    date: isoDate,
    prayers: { fajr: 'none', dhuhr: 'none', maghrib: 'none' },
    duas: []
  };

  const handlePrayerChange = (prayer: keyof typeof PRAYER_LABELS, timing: PrayerTiming) => {
    onSave({
      ...currentLog,
      prayers: { ...currentLog.prayers, [prayer]: timing }
    });
  };

  const handleDuaToggle = (dua: string) => {
    const newDuas = currentLog.duas.includes(dua)
      ? currentLog.duas.filter(d => d !== dua)
      : [...currentLog.duas, dua];
    onSave({ ...currentLog, duas: newDuas });
  };

  const changeDate = (offset: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + offset);
    setSelectedDate(newDate);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Date Navigation */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-50 flex items-center justify-between">
        <button onClick={() => changeDate(-1)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors">
          <ChevronRight className="w-6 h-6" />
        </button>
        <div className="text-center">
          <h2 className="text-emerald-900 font-bold">{getPersianDate(selectedDate)}</h2>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">{isoDate}</p>
        </div>
        <button 
          onClick={() => changeDate(1)} 
          disabled={isoDate === getISODate(new Date())}
          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-full disabled:opacity-20 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>

      {/* Prayers Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-50 overflow-hidden">
        <div className="bg-emerald-50 px-4 py-3 border-b border-emerald-100 flex items-center gap-2">
          <Clock className="w-5 h-5 text-emerald-700" />
          <h3 className="text-emerald-900 font-bold text-sm">پیگیری اقامه نماز</h3>
        </div>
        <div className="p-4 space-y-4">
          {(Object.keys(PRAYER_LABELS) as Array<keyof typeof PRAYER_LABELS>).map(prayerKey => (
            <div key={prayerKey} className="space-y-2">
              <label className="text-sm font-medium text-slate-600 block">{PRAYER_LABELS[prayerKey]}</label>
              <div className="grid grid-cols-4 gap-2">
                {(Object.keys(TIMING_LABELS) as Array<PrayerTiming>).map(timing => (
                  <button
                    key={timing}
                    onClick={() => handlePrayerChange(prayerKey, timing)}
                    className={`text-[10px] py-2 rounded-xl border transition-all duration-300 ${
                      currentLog.prayers[prayerKey] === timing
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md transform scale-105'
                        : 'bg-stone-50 text-slate-500 border-slate-100 hover:border-emerald-200'
                    }`}
                  >
                    {TIMING_LABELS[timing]}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Duas Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-50 overflow-hidden">
        <div className="bg-emerald-50 px-4 py-3 border-b border-emerald-100 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-700" />
          <h3 className="text-emerald-900 font-bold text-sm">قرائت ادعیه و زیارات</h3>
        </div>
        <div className="p-2 grid grid-cols-2 gap-2">
          {DUA_OPTIONS.map(dua => (
            <button
              key={dua}
              onClick={() => handleDuaToggle(dua)}
              className={`flex items-center gap-2 p-3 rounded-xl transition-all ${
                currentLog.duas.includes(dua)
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-white border-transparent'
              } border`}
            >
              {currentLog.duas.includes(dua) ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-slate-200 shrink-0" />
              )}
              <span className={`text-xs font-medium ${
                currentLog.duas.includes(dua) ? 'text-emerald-900' : 'text-slate-500'
              }`}>
                {dua}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailyTracker;
