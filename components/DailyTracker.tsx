
import React, { useState, useEffect } from 'react';
import { DailyLog, DUA_OPTIONS, PRAYER_LABELS, TIMING_LABELS, PrayerTiming } from '../types';
import { getISODate, getPersianDate } from '../utils';
import { CheckCircle2, Circle, Clock, ChevronLeft, ChevronRight, Save, Check } from 'lucide-react';

interface DailyTrackerProps {
  logs: Record<string, DailyLog>;
  onSave: (log: DailyLog) => void;
}

const DailyTracker: React.FC<DailyTrackerProps> = ({ logs, onSave }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isSaved, setIsSaved] = useState(false);
  const isoDate = getISODate(selectedDate);
  
  // Local state to hold changes before clicking "Save"
  const [localLog, setLocalLog] = useState<DailyLog>({
    date: isoDate,
    prayers: { fajr: 'none', dhuhr: 'none', maghrib: 'none' },
    duas: []
  });

  useEffect(() => {
    const existingLog = logs[isoDate] || {
      date: isoDate,
      prayers: { fajr: 'none', dhuhr: 'none', maghrib: 'none' },
      duas: []
    };
    setLocalLog(existingLog);
    setIsSaved(false);
  }, [isoDate, logs]);

  const handlePrayerChange = (prayer: keyof typeof PRAYER_LABELS, timing: PrayerTiming) => {
    setLocalLog(prev => ({
      ...prev,
      prayers: { ...prev.prayers, [prayer]: timing }
    }));
    setIsSaved(false);
  };

  const handleDuaToggle = (dua: string) => {
    setLocalLog(prev => {
      const newDuas = prev.duas.includes(dua)
        ? prev.duas.filter(d => d !== dua)
        : [...prev.duas, dua];
      return { ...prev, duas: newDuas };
    });
    setIsSaved(false);
  };

  const handleFinalSave = () => {
    onSave(localLog);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const changeDate = (offset: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + offset);
    setSelectedDate(newDate);
  };

  // Calculate current score for preview
  // Fix: Explicitly type the accumulator as number to resolve 'unknown' type error in reduce
  const currentScore = Object.values(localLog.prayers).reduce((acc: number, p) => {
    if (p === 'early') return acc + 10;
    if (p === 'mid') return acc + 7;
    if (p === 'late') return acc + 4;
    return acc;
  }, 0) + (localLog.duas.length * 5);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Date Navigation */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-50 flex items-center justify-between">
        <button onClick={() => changeDate(-1)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors">
          <ChevronRight className="w-6 h-6" />
        </button>
        <div className="text-center">
          <h2 className="text-emerald-900 font-bold">{getPersianDate(selectedDate)}</h2>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest">{isoDate}</span>
            <span className="bg-amber-100 text-amber-700 text-[9px] px-2 py-0.5 rounded-full font-bold">امتیاز: {currentScore}</span>
          </div>
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
                      localLog.prayers[prayerKey] === timing
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md transform scale-105 font-bold'
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
                localLog.duas.includes(dua)
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-white border-transparent'
              } border`}
            >
              {localLog.duas.includes(dua) ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-slate-200 shrink-0" />
              )}
              <span className={`text-xs font-medium ${
                localLog.duas.includes(dua) ? 'text-emerald-900' : 'text-slate-500'
              }`}>
                {dua}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="px-2 pb-4">
        <button
          onClick={handleFinalSave}
          disabled={isSaved}
          className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-lg transition-all active:scale-95 ${
            isSaved 
              ? 'bg-emerald-100 text-emerald-700 cursor-default' 
              : 'bg-emerald-700 text-white hover:bg-emerald-800'
          }`}
        >
          {isSaved ? (
            <>
              <Check className="w-5 h-5" />
              اطلاعات با موفقیت ثبت شد
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              ثبت اعمال امروز
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DailyTracker;
