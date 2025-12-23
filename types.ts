
export type PrayerTiming = 'none' | 'early' | 'mid' | 'late';

export interface DailyLog {
  date: string; // ISO string YYYY-MM-DD
  prayers: {
    fajr: PrayerTiming;
    dhuhr: PrayerTiming;
    maghrib: PrayerTiming;
  };
  duas: string[]; // List of dua names completed
}

export type AppTab = 'daily' | 'dashboard' | 'settings';

export const DUA_OPTIONS = [
  'عاشورا',
  'آل یاسین',
  'امین الله',
  'صلوات حضرت زهرا',
  'دعای عهد',
  'حدیث کسا'
];

export const PRAYER_LABELS = {
  fajr: 'نماز صبح',
  dhuhr: 'نماز ظهر و عصر',
  maghrib: 'نماز مغرب و عشا'
};

export const TIMING_LABELS = {
  none: 'نخوانده',
  early: 'اول وقت',
  mid: 'میان وقت',
  late: 'آخر وقت'
};
