/**
 * Time and Timezone Management Utilities
 * Uses modern JavaScript Intl API for robust timezone calculation and formatting
 */

export interface TimezoneOption {
  value: string; // IANA Identifier e.g. "Asia/Kolkata"
  label: string; // User-friendly label e.g. "Mumbai, New Delhi, Kolkata (IST, UTC+5:30)"
  city: string;
  country: string;
  region: 'Asia' | 'Americas' | 'Europe' | 'Middle East' | 'Africa' | 'Pacific' | 'UTC';
  offset: string; // e.g. "+05:30"
  abbreviation: string; // e.g. "IST"
}

export const POPULAR_TIMEZONES: TimezoneOption[] = [
  { value: 'Asia/Kolkata', label: 'India (IST - Kolkata, Mumbai, Delhi)', city: 'New Delhi / Mumbai', country: 'India', region: 'Asia', offset: '+05:30', abbreviation: 'IST' },
  { value: 'Asia/Dubai', label: 'Gulf / Dubai (GST - Dubai, Abu Dhabi)', city: 'Dubai', country: 'UAE', region: 'Middle East', offset: '+04:00', abbreviation: 'GST' },
  { value: 'Asia/Singapore', label: 'Singapore / Malaysia (SGT)', city: 'Singapore', country: 'Singapore', region: 'Asia', offset: '+08:00', abbreviation: 'SGT' },
  { value: 'Asia/Tokyo', label: 'Japan / Korea (JST - Tokyo, Seoul)', city: 'Tokyo', country: 'Japan', region: 'Asia', offset: '+09:00', abbreviation: 'JST' },
  { value: 'Europe/London', label: 'UK / London (GMT/BST)', city: 'London', country: 'United Kingdom', region: 'Europe', offset: '+00:00', abbreviation: 'GMT' },
  { value: 'Europe/Paris', label: 'Central Europe (CET/CEST - Paris, Berlin, Rome)', city: 'Paris', country: 'France', region: 'Europe', offset: '+01:00', abbreviation: 'CET' },
  { value: 'America/New_York', label: 'US Eastern (EST/EDT - New York, Toronto, Miami)', city: 'New York', country: 'USA', region: 'Americas', offset: '-05:00', abbreviation: 'EST' },
  { value: 'America/Chicago', label: 'US Central (CST/CDT - Chicago, Dallas)', city: 'Chicago', country: 'USA', region: 'Americas', offset: '-06:00', abbreviation: 'CST' },
  { value: 'America/Denver', label: 'US Mountain (MST/MDT - Denver, Phoenix)', city: 'Denver', country: 'USA', region: 'Americas', offset: '-07:00', abbreviation: 'MST' },
  { value: 'America/Los_Angeles', label: 'US Pacific (PST/PDT - San Francisco, LA, Seattle)', city: 'Los Angeles', country: 'USA', region: 'Americas', offset: '-08:00', abbreviation: 'PST' },
  { value: 'America/Sao_Paulo', label: 'Brazil (BRT - São Paulo, Rio)', city: 'São Paulo', country: 'Brazil', region: 'Americas', offset: '-03:00', abbreviation: 'BRT' },
  { value: 'Australia/Sydney', label: 'Australia Eastern (AEST/AEDT - Sydney, Melbourne)', city: 'Sydney', country: 'Australia', region: 'Pacific', offset: '+10:00', abbreviation: 'AEST' },
  { value: 'Pacific/Auckland', label: 'New Zealand (NZST/NZDT - Auckland)', city: 'Auckland', country: 'New Zealand', region: 'Pacific', offset: '+12:00', abbreviation: 'NZST' },
  { value: 'Africa/Cairo', label: 'Egypt (EET - Cairo)', city: 'Cairo', country: 'Egypt', region: 'Africa', offset: '+02:00', abbreviation: 'EET' },
  { value: 'Africa/Johannesburg', label: 'South Africa (SAST - Johannesburg)', city: 'Johannesburg', country: 'South Africa', region: 'Africa', offset: '+02:00', abbreviation: 'SAST' },
  { value: 'UTC', label: 'Coordinated Universal Time (UTC / GMT)', city: 'UTC', country: 'Universal', region: 'UTC', offset: '+00:00', abbreviation: 'UTC' }
];

/**
 * Detect the browser's current IANA timezone safely
 */
export function getBrowserTimezone(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && tz.length > 0) {
      return tz;
    }
  } catch (e) {
    console.warn('Error detecting browser timezone:', e);
  }
  return 'Asia/Kolkata'; // Default fallback
}

/**
 * Get current timezone abbreviation and offset for a given IANA timezone
 */
export function getTimezoneDetails(timezone: string, date: Date = new Date()): {
  abbrev: string;
  offset: string;
  displayName: string;
} {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'short',
    });
    const parts = formatter.formatToParts(date);
    const tzPart = parts.find(p => p.type === 'timeZoneName');
    const abbrev = tzPart ? tzPart.value : timezone;

    // Calculate numeric offset in minutes
    // Use Intl parts to compare UTC vs local time
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
    const diffMin = Math.round((tzDate.getTime() - utcDate.getTime()) / 60000);
    const sign = diffMin >= 0 ? '+' : '-';
    const absMin = Math.abs(diffMin);
    const hours = Math.floor(absMin / 60).toString().padStart(2, '0');
    const mins = (absMin % 60).toString().padStart(2, '0');
    const offset = `UTC${sign}${hours}:${mins}`;

    return {
      abbrev,
      offset,
      displayName: `${timezone} (${abbrev}, ${offset})`
    };
  } catch (e) {
    return {
      abbrev: 'UTC',
      offset: 'UTC+00:00',
      displayName: timezone
    };
  }
}

/**
 * Parse any date input into a valid Date object
 */
export function parseToDate(input: Date | string | number | undefined | null): Date {
  if (!input) return new Date();
  if (input instanceof Date) return isNaN(input.getTime()) ? new Date() : input;
  
  if (typeof input === 'string') {
    // If YYYY-MM-DD only, treat as UTC midnight or local date
    if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
      const [y, m, d] = input.split('-').map(Number);
      return new Date(Date.UTC(y, m - 1, d, 12, 0, 0)); // Midday UTC to avoid off-by-one
    }
    const d = new Date(input);
    return isNaN(d.getTime()) ? new Date() : d;
  }

  const d = new Date(input);
  return isNaN(d.getTime()) ? new Date() : d;
}

/**
 * Get date parts in specific timezone
 */
export function getZonedDateParts(dateInput: Date | string | number, timezone: string): {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  dayOfWeek: number; // 0=Sun, 6=Sat
  hour24: number;
} {
  const date = parseToDate(dateInput);
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
      weekday: 'narrow',
    });

    const parts = formatter.formatToParts(date);
    const map: Record<string, number> = {};
    for (const p of parts) {
      if (p.type !== 'literal') {
        map[p.type] = parseInt(p.value, 10);
      }
    }

    const dayOfWeekFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'short'
    });
    const dayStr = dayOfWeekFormatter.format(date);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayOfWeek = Math.max(0, days.indexOf(dayStr));

    return {
      year: map.year || date.getFullYear(),
      month: map.month || (date.getMonth() + 1),
      day: map.day || date.getDate(),
      hour: map.hour !== undefined ? (map.hour % 24) : date.getHours(),
      minute: map.minute || date.getMinutes(),
      second: map.second || date.getSeconds(),
      dayOfWeek,
      hour24: map.hour !== undefined ? (map.hour % 24) : date.getHours(),
    };
  } catch (e) {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: date.getHours(),
      minute: date.getMinutes(),
      second: date.getSeconds(),
      dayOfWeek: date.getDay(),
      hour24: date.getHours(),
    };
  }
}

/**
 * Format a date in a specified timezone according to style
 */
export function formatInTimezone(
  dateInput: Date | string | number,
  timezone: string,
  style: 'datetime' | 'date' | 'time' | 'time-seconds' | 'full' | 'short-date' | 'month-year' | 'iso-date' | 'relative' = 'datetime',
  is24Hour: boolean = false
): string {
  const date = parseToDate(dateInput);

  if (style === 'relative') {
    return formatRelativeTime(date, new Date(), timezone);
  }

  try {
    switch (style) {
      case 'time':
        return new Intl.DateTimeFormat('en-US', {
          timeZone: timezone,
          hour: 'numeric',
          minute: '2-digit',
          hour12: !is24Hour,
        }).format(date);

      case 'time-seconds':
        return new Intl.DateTimeFormat('en-US', {
          timeZone: timezone,
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
          hour12: !is24Hour,
        }).format(date);

      case 'date':
        return new Intl.DateTimeFormat('en-US', {
          timeZone: timezone,
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }).format(date);

      case 'short-date':
        return new Intl.DateTimeFormat('en-US', {
          timeZone: timezone,
          month: 'short',
          day: 'numeric',
        }).format(date);

      case 'month-year':
        return new Intl.DateTimeFormat('en-US', {
          timeZone: timezone,
          month: 'long',
          year: 'numeric',
        }).format(date);

      case 'iso-date': {
        const parts = getZonedDateParts(date, timezone);
        const y = parts.year;
        const m = parts.month.toString().padStart(2, '0');
        const d = parts.day.toString().padStart(2, '0');
        return `${y}-${m}-${d}`;
      }

      case 'full':
        return new Intl.DateTimeFormat('en-US', {
          timeZone: timezone,
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: !is24Hour,
          timeZoneName: 'short',
        }).format(date);

      case 'datetime':
      default:
        return new Intl.DateTimeFormat('en-US', {
          timeZone: timezone,
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: !is24Hour,
        }).format(date);
    }
  } catch (err) {
    return date.toLocaleString();
  }
}

/**
 * Format relative time (e.g. 'Just now', '5 mins ago', 'in 2 hours')
 */
export function formatRelativeTime(
  dateInput: Date | string | number,
  baseDate: Date = new Date(),
  _timezone: string = 'UTC'
): string {
  const target = parseToDate(dateInput);
  const now = parseToDate(baseDate);
  const diffMs = target.getTime() - now.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const isPast = diffSec < 0;
  const absSec = Math.abs(diffSec);

  if (absSec < 45) {
    return 'Just now';
  }

  const mins = Math.floor(absSec / 60);
  if (mins < 60) {
    return isPast ? `${mins}m ago` : `in ${mins}m`;
  }

  const hours = Math.floor(mins / 60);
  if (hours < 24) {
    return isPast ? `${hours}h ago` : `in ${hours}h`;
  }

  const days = Math.floor(hours / 24);
  if (days === 1) {
    return isPast ? 'Yesterday' : 'Tomorrow';
  }
  if (days < 30) {
    return isPast ? `${days}d ago` : `in ${days}d`;
  }

  const months = Math.floor(days / 30);
  if (months < 12) {
    return isPast ? `${months}mo ago` : `in ${months}mo`;
  }

  const years = Math.floor(days / 365);
  return isPast ? `${years}y ago` : `in ${years}y`;
}

/**
 * Calculate accurate days away in a specified timezone
 * Compares calendar dates (year-month-day) in the timezone, not raw milliseconds
 */
export function calculateDaysAway(
  eventDateStr: string,
  timezone: string,
  nowDate: Date = new Date()
): {
  daysAway: number;
  label: string;
  badgeColor: string;
  isToday: boolean;
  isTomorrow: boolean;
  isPast: boolean;
} {
  const nowParts = getZonedDateParts(nowDate, timezone);
  const nowZonedMidnight = new Date(Date.UTC(nowParts.year, nowParts.month - 1, nowParts.day));

  // Parse event date
  const eventDate = parseToDate(eventDateStr);
  const eventParts = getZonedDateParts(eventDate, timezone);
  const eventZonedMidnight = new Date(Date.UTC(eventParts.year, eventParts.month - 1, eventParts.day));

  const diffMs = eventZonedMidnight.getTime() - nowZonedMidnight.getTime();
  const daysAway = Math.round(diffMs / (1000 * 60 * 60 * 24));

  const isToday = daysAway === 0;
  const isTomorrow = daysAway === 1;
  const isPast = daysAway < 0;

  let label = '';
  let badgeColor = 'bg-slate-700 text-slate-300 border-slate-600';

  if (isToday) {
    label = 'Today';
    badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 ring-1 ring-emerald-500/30';
  } else if (isTomorrow) {
    label = 'Tomorrow';
    badgeColor = 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
  } else if (daysAway === 2) {
    label = 'In 2 days';
    badgeColor = 'bg-violet-500/20 text-violet-300 border-violet-500/40';
  } else if (daysAway > 2 && daysAway <= 7) {
    label = `In ${daysAway} days`;
    badgeColor = 'bg-purple-500/20 text-purple-300 border-purple-500/40';
  } else if (daysAway > 7) {
    label = `In ${daysAway} days`;
    badgeColor = 'bg-slate-800/80 text-slate-300 border-slate-700';
  } else if (daysAway === -1) {
    label = 'Yesterday';
    badgeColor = 'bg-amber-500/10 text-amber-300/80 border-amber-500/30';
  } else {
    label = `${Math.abs(daysAway)} days ago`;
    badgeColor = 'bg-slate-800/60 text-slate-400 border-slate-700/50';
  }

  return {
    daysAway,
    label,
    badgeColor,
    isToday,
    isTomorrow,
    isPast
  };
}

/**
 * Dynamic greeting, witty microcopy and time of day based on current hour in user's timezone
 */
export function getGreetingForTimezone(
  timezone: string,
  nowDate: Date = new Date(),
  userName: string = 'Creator'
): {
  greeting: string;
  wittySubtext: string;
  greetingIcon: 'sun' | 'sun-high' | 'sunset' | 'moon';
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  hour24: number;
} {
  const parts = getZonedDateParts(nowDate, timezone);
  const hour = parts.hour24;

  let greeting = `Good morning, ${userName}!`;
  let wittySubtext = 'Fresh ideas brew best with morning coffee. Let’s create something great today.';
  let greetingIcon: 'sun' | 'sun-high' | 'sunset' | 'moon' = 'sun';
  let timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' = 'morning';

  if (hour >= 5 && hour < 12) {
    timeOfDay = 'morning';
    greetingIcon = 'sun';
    const mornings = [
      `Good morning, ${userName}! ☀️`,
      `Rise and shine, ${userName}! ✨`,
      `Top of the morning, ${userName}! ☕`
    ];
    const subtexts = [
      'Early birds catch the highest organic reach. Ready to publish?',
      'Fresh day, fresh content ideas. Your audience is waiting.',
      'Check your pending approvals and scheduled campaign lineup.'
    ];
    greeting = mornings[parts.day % mornings.length];
    wittySubtext = subtexts[parts.day % subtexts.length];
  } else if (hour >= 12 && hour < 17) {
    timeOfDay = 'afternoon';
    greetingIcon = 'sun-high';
    const afternoons = [
      `Good afternoon, ${userName}! ⚡`,
      `Productive afternoon, ${userName}! 🎯`,
      `Halfway through the hustle, ${userName}! 🚀`
    ];
    const subtexts = [
      'Peak engagement hours are kicking in. Check your content radar!',
      'Review engagement metrics and reply to viral community comments.',
      'Great time to batch schedule your evening reels and carousel posts.'
    ];
    greeting = afternoons[parts.day % afternoons.length];
    wittySubtext = subtexts[parts.day % subtexts.length];
  } else if (hour >= 17 && hour < 22) {
    timeOfDay = 'evening';
    greetingIcon = 'sunset';
    const evenings = [
      `Good evening, ${userName}! 🌆`,
      `Unwinding with great stats, ${userName}? 📈`,
      `Prime-time evening, ${userName}! 🌟`
    ];
    const subtexts = [
      'Prime-time viewing is live across Instagram and LinkedIn.',
      'Wrap up pending task reviews and check tomorrow’s event lineup.',
      'Your audience is online and active right now. Check live analytics.'
    ];
    greeting = evenings[parts.day % evenings.length];
    wittySubtext = subtexts[parts.day % subtexts.length];
  } else {
    timeOfDay = 'night';
    greetingIcon = 'moon';
    const nights = [
      `Burning the midnight oil, ${userName}? 🌙`,
      `Late night creative session, ${userName}! 🌌`,
      `Night owl mode active, ${userName}! 🦉`
    ];
    const subtexts = [
      'Quiet nights make for the sharpest creative copy and strategies.',
      'Don’t forget to schedule auto-publishing so you can get some rest!',
      'Scheduled posts will go live right on time while you sleep soundly.'
    ];
    greeting = nights[parts.day % nights.length];
    wittySubtext = subtexts[parts.day % subtexts.length];
  }

  return {
    greeting,
    wittySubtext,
    greetingIcon,
    timeOfDay,
    hour24: hour
  };
}

/**
 * Helper to combine date string (YYYY-MM-DD) and time string (HH:mm) in a timezone to ISO UTC string
 */
export function combineDateTimeToUtc(
  dateStr: string, // YYYY-MM-DD
  timeStr: string, // HH:mm
  timezone: string
): string {
  try {
    // Create an ISO-like string and interpret in the given timezone
    // Using Intl to adjust offset
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hour, minute] = timeStr.split(':').map(Number);

    // Approximate UTC then iteratively refine timezone offset
    let target = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
    
    // Check what local time this UTC date represents in target timezone
    for (let i = 0; i < 3; i++) {
      const parts = getZonedDateParts(target, timezone);
      const targetLocalInTz = new Date(Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, 0));
      const desiredLocal = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
      const diff = desiredLocal.getTime() - targetLocalInTz.getTime();
      if (diff === 0) break;
      target = new Date(target.getTime() + diff);
    }

    return target.toISOString();
  } catch (e) {
    return new Date(`${dateStr}T${timeStr}:00Z`).toISOString();
  }
}
