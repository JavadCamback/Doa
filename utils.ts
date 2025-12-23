
export const getPersianDate = (date: Date = new Date()) => {
  return new Intl.DateTimeFormat('fa-IR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

export const getISODate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

export const getRelativeDates = (days: number) => {
  const dates = [];
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d);
  }
  return dates;
};

export const getPersianDayName = (date: Date) => {
  return new Intl.DateTimeFormat('fa-IR', { weekday: 'short' }).format(date);
};
