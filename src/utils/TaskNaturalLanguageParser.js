/**
 * Natural Language Rapid Task Parser
 * Tokenizes time (14:00, 2:30pm), category hashtags (#work, #health),
 * delegation (@Sarah), and priority glyphs (! -> Star)
 */
import { CATEGORIES } from '../types/journal';

function normalizeTime(raw) {
  if (/am|pm/i.test(raw)) {
    const isPm = /pm/i.test(raw);
    const cleaned = raw.replace(/[ap]m/i, '').trim();
    if (cleaned.includes(':')) {
      let [h, m] = cleaned.split(':').map(Number);
      if (isPm && h < 12) h += 12;
      if (!isPm && h === 12) h = 0;
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    } else {
      let h = parseInt(cleaned, 10);
      if (isPm && h < 12) h += 12;
      if (!isPm && h === 12) h = 0;
      return `${String(h).padStart(2, '0')}:00`;
    }
  }
  return raw;
}

export function parseNaturalTaskInput(rawInput) {
  if (!rawInput || typeof rawInput !== 'string') {
    return { cleanText: '', category: 'personal', type: 'task', timestamp: null, delegate: null };
  }

  let text = rawInput.trim();
  let timestamp = null;
  let category = null;
  let type = 'task';
  let delegate = null;

  // 1. Time Tokenizer (e.g., '14:00', '2:30pm', '09:15', '9am')
  const timeRegex = /\b((?:[01]?\d|2[0-3]):[0-5]\d(?:\s?[ap]m)?|[1-9]\s?[ap]m)\b/i;
  const timeMatch = text.match(timeRegex);
  if (timeMatch) {
    timestamp = normalizeTime(timeMatch[1]);
    text = text.replace(timeRegex, '').trim();
  }

  // 2. Category Hashtags (e.g., '#work', '#health', '#finance')
  const tagRegex = /#([a-zA-Z0-9]+)/;
  const tagMatch = text.match(tagRegex);
  if (tagMatch) {
    const rawTag = tagMatch[1].toLowerCase();
    const matchedCat = Object.values(CATEGORIES).find(c => 
      c.id === rawTag || c.label.toLowerCase() === rawTag || (c.keywords && c.keywords.includes(rawTag))
    );
    if (matchedCat) {
      category = matchedCat.id;
    }
    text = text.replace(tagRegex, '').trim();
  }

  // 3. Delegate Tokens (e.g., '@Sarah')
  const delegateRegex = /@([a-zA-Z0-9_-]+)/;
  const delegateMatch = text.match(delegateRegex);
  if (delegateMatch) {
    delegate = delegateMatch[1];
    text = text.replace(delegateRegex, '').trim();
  }

  // 4. Bullet Glyph / Priority Modifiers:
  if (text.startsWith('!') || text.endsWith('!')) {
    type = 'priority'; // Star
    text = text.replace(/!/g, '').trim();
  } else if (text.startsWith('- ')) {
    type = 'note';
    text = text.substring(2).trim();
  } else if (text.endsWith('?')) {
    type = 'note';
  }

  return {
    cleanText: text,
    category: category || 'personal',
    type,
    timestamp,
    delegate
  };
}
