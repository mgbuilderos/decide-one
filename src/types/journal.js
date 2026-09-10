/**
 * Core Type Definitions & Constants for Pocketnote
 * Pure Black & White Minimalist Design System
 */

// 10 Real-Life Master Categories (Minimalist Black & White)
export const CATEGORIES = {
  PROFESSIONAL: {
    id: 'professional',
    label: 'Work',
    fullLabel: 'Work & Projects',
    keywords: ['work', 'meeting', 'client', 'code', 'project', 'deck', 'report', 'email', 'review', 'sync', 'deliverable']
  },
  PERSONAL: {
    id: 'personal',
    label: 'Life',
    fullLabel: 'Personal & Life Admin',
    keywords: ['home', 'chore', 'clean', 'laundry', 'repair', 'car', 'organize', 'admin', 'routine', 'plants']
  },
  HEALTH: {
    id: 'health',
    label: 'Health',
    fullLabel: 'Health & Fitness',
    keywords: ['gym', 'workout', 'run', 'yoga', 'doctor', 'dentist', 'walk', 'sleep', 'water', 'meditate', 'stretch']
  },
  TRAVEL: {
    id: 'travel',
    label: 'Travel',
    fullLabel: 'Travel & Commute',
    keywords: ['travel', 'flight', 'hotel', 'pack', 'airport', 'trip', 'train', 'ticket', 'passport', 'vacation', 'commute']
  },
  LEARNING: {
    id: 'learning',
    label: 'Read',
    fullLabel: 'Reading & Learning',
    keywords: ['book', 'read', 'study', 'course', 'learn', 'article', 'paper', 'podcast', 'notes', 'language', 'chapter']
  },
  SHOPPING: {
    id: 'shopping',
    label: 'Shop',
    fullLabel: 'Shopping & Errands',
    keywords: ['buy', 'shop', 'grocery', 'pharmacy', 'market', 'order', 'amazon', 'supplies', 'return', 'store']
  },
  FINANCE: {
    id: 'finance',
    label: 'Money',
    fullLabel: 'Finance & Wealth',
    keywords: ['pay', 'bill', 'rent', 'bank', 'invest', 'tax', 'budget', 'invoice', 'salary', 'money', 'crypto']
  },
  CREATIVE: {
    id: 'creative',
    label: 'Create',
    fullLabel: 'Creative & Hobby',
    keywords: ['draw', 'paint', 'write', 'photo', 'music', 'design', 'craft', 'cook', 'recipe', 'art', 'sketch']
  },
  SOCIAL: {
    id: 'social',
    label: 'Social',
    fullLabel: 'Social & Family',
    keywords: ['dinner', 'lunch', 'coffee', 'friends', 'family', 'mom', 'dad', 'birthday', 'date', 'party', 'drinks']
  },
  URGENT: {
    id: 'urgent',
    label: 'Urgent',
    fullLabel: 'Urgent Priority',
    keywords: ['urgent', 'asap', 'deadline', 'critical', 'blocker', 'priority', 'emergency', 'must', 'today']
  }
};

// Decide One journaling symbols (intuitive consumer system)
export const POCKET_SYMBOLS = [
  { id: 'todo', symbol: '○', label: 'To Do', desc: 'Task to do' },
  { id: 'done', symbol: '✓', label: 'Done', desc: 'Completed task' },
  { id: 'missed', symbol: '✕', label: 'Missed', desc: 'Missed at end of day' },
  { id: 'moved', symbol: '→', label: 'Moved', desc: 'Postponed / Forwarded' },
  { id: 'star', symbol: '★', label: 'Star', desc: 'Important highlight' },
  { id: 'note', symbol: '—', label: 'Note', desc: 'Thought or idea' }
];

// Backwards compatibility alias
export const BULLET_TYPES = POCKET_SYMBOLS;

export function getPocketSymbol(typeId) {
  switch (typeId) {
    case 'completed':
    case 'done':
      return POCKET_SYMBOLS[1]; // Done
    case 'missed':
      return POCKET_SYMBOLS[2]; // Missed
    case 'migrated':
    case 'moved':
      return POCKET_SYMBOLS[3]; // Moved
    case 'priority':
    case 'star':
      return POCKET_SYMBOLS[4]; // Star
    case 'note':
      return POCKET_SYMBOLS[5]; // Note
    case 'task':
    case 'event':
    case 'todo':
    default:
      return POCKET_SYMBOLS[0]; // To Do
  }
}

/**
 * Smart Keyword Auto-Association
 */
export function detectCategoryFromText(text) {
  if (!text) return null;
  const lower = text.toLowerCase();
  
  for (const catKey of Object.keys(CATEGORIES)) {
    const cat = CATEGORIES[catKey];
    for (const kw of cat.keywords) {
      const regex = new RegExp(`\\b${kw}`, 'i');
      if (regex.test(lower)) {
        return cat.id;
      }
    }
  }
  return null;
}
