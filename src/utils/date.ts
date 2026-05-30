import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(utc);
dayjs.extend(relativeTime);

const date = {
  // Current UTC time
  now: () => dayjs.utc(),

  // Format a date  e.g. '2024-01-15 10:30:00'
  format: (d: Date | string, fmt = 'YYYY-MM-DD HH:mm:ss') => dayjs(d).format(fmt),

  // Add time to a date  e.g. addMinutes(new Date(), 30)
  addMinutes: (d: Date | string, minutes: number) => dayjs(d).add(minutes, 'minute').toDate(),
  addDays: (d: Date | string, days: number) => dayjs(d).add(days, 'day').toDate(),

  // Check if a date is in the past
  isPast: (d: Date | string) => dayjs(d).isBefore(dayjs()),

  // Human readable  e.g. '3 hours ago'
  fromNow: (d: Date | string) => dayjs(d).fromNow(),
};

export default date;