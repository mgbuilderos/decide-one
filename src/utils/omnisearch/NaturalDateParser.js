/**
 * NaturalDateParser.js
 * High-speed natural language date parser for Decide One Cmd+K.
 * Zero external dependencies. Converts phrases like "yesterday", "tomorrow",
 * "3 days ago", "May 14", "next friday" into YYYY-MM-DD coordinates.
 */

const MONTH_NAMES = {
  jan: 0, january: 0,
  feb: 1, february: 1,
  mar: 2, march: 2,
  apr: 3, april: 3,
  may: 4,
  jun: 5, june: 5,
  jul: 6, july: 6,
  aug: 7, august: 7,
  sep: 8, sept: 8, september: 8,
  oct: 9, october: 9,
  nov: 10, november: 10,
  dec: 11, december: 11
};

const DAY_OF_WEEK = {
  sunday: 0, sun: 0,
  monday: 1, mon: 1,
  tuesday: 2, tue: 2,
  wednesday: 3, wed: 3,
  thursday: 4, thu: 4,
  friday: 5, fri: 5,
  saturday: 6, sat: 6
};

function formatIso(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function parseNaturalDate(input, referenceDate = new Date()) {
  if (!input || typeof input !== 'string') return null;
  const raw = input.trim().toLowerCase();

  // 1. Exact relative keywords
  if (raw === 'today') return { dateKey: formatIso(referenceDate), label: 'Today' };
  if (raw === 'yesterday') {
    const d = new Date(referenceDate);
    d.setDate(d.getDate() - 1);
    return { dateKey: formatIso(d), label: 'Yesterday' };
  }
  if (raw === 'tomorrow') {
    const d = new Date(referenceDate);
    d.setDate(d.getDate() + 1);
    return { dateKey: formatIso(d), label: 'Tomorrow' };
  }

  // 2. "X days ago" or "in X days"
  const daysAgoMatch = raw.match(/^(\d+)\s+(days?|d)\s+ago$/);
  if (daysAgoMatch) {
    const count = parseInt(daysAgoMatch[1], 10);
    const d = new Date(referenceDate);
    d.setDate(d.getDate() - count);
    return { dateKey: formatIso(d), label: `${count} days ago` };
  }

  const inDaysMatch = raw.match(/^in\s+(\d+)\s+(days?|d)$/);
  if (inDaysMatch) {
    const count = parseInt(inDaysMatch[1], 10);
    const d = new Date(referenceDate);
    d.setDate(d.getDate() + count);
    return { dateKey: formatIso(d), label: `In ${count} days` };
  }

  // 3. Day of week expressions: "next friday", "last monday", "this sunday"
  const dowMatch = raw.match(/^(next|last|this)\s+(sunday|sun|monday|mon|tuesday|tue|wednesday|wed|thursday|thu|friday|fri|saturday|sat)$/);
  if (dowMatch) {
    const modifier = dowMatch[1];
    const targetDow = DAY_OF_WEEK[dowMatch[2]];
    const currDow = referenceDate.getDay();
    const d = new Date(referenceDate);

    let diff = targetDow - currDow;
    if (modifier === 'next') {
      diff = (diff <= 0) ? diff + 7 : diff;
    } else if (modifier === 'last') {
      diff = (diff >= 0) ? diff - 7 : diff;
    }
    d.setDate(d.getDate() + diff);
    return { dateKey: formatIso(d), label: `${modifier.toUpperCase()} ${dowMatch[2]}` };
  }

  // 4. "Month Day" e.g., "May 14", "May 14 2024", "14 May"
  const mDayMatch = raw.match(/^([a-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?(?:\s+(\d{4}))?$/);
  if (mDayMatch && MONTH_NAMES[mDayMatch[1]] !== undefined) {
    const month = MONTH_NAMES[mDayMatch[1]];
    const day = parseInt(mDayMatch[2], 10);
    const year = mDayMatch[3] ? parseInt(mDayMatch[3], 10) : referenceDate.getFullYear();
    const d = new Date(year, month, day);
    if (!isNaN(d.getTime())) {
      return { dateKey: formatIso(d), label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) };
    }
  }

  const dayMMatch = raw.match(/^(\d{1,2})(?:st|nd|rd|th)?\s+([a-z]+)(?:\s+(\d{4}))?$/);
  if (dayMMatch && MONTH_NAMES[dayMMatch[2]] !== undefined) {
    const month = MONTH_NAMES[dayMMatch[2]];
    const day = parseInt(dayMMatch[1], 10);
    const year = dayMMatch[3] ? parseInt(dayMMatch[3], 10) : referenceDate.getFullYear();
    const d = new Date(year, month, day);
    if (!isNaN(d.getTime())) {
      return { dateKey: formatIso(d), label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) };
    }
  }

  // 5. ISO Format: YYYY-MM-DD
  const isoMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    return { dateKey: raw, label: raw };
  }

  return null;
}
