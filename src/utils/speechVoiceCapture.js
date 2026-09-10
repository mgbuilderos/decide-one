/**
 * Executive Thought Dictation & Voice Capture Engine
 * 100% Client-Side Web Speech API (Apple Neural Engine / Local Chromium)
 * Zero Cloud Servers • Zero Third-Party Audio Streaming • 100% Air-Gapped Privacy
 */

// Spoken punctuation replacement pipeline
const PUNCTUATION_MAP = [
  { regex: /\b(period|full stop)\b/gi, replacement: '.' },
  { regex: /\b(comma)\b/gi, replacement: ',' },
  { regex: /\b(question mark)\b/gi, replacement: '?' },
  { regex: /\b(exclamation mark|exclamation point)\b/gi, replacement: '!' },
  { regex: /\b(new line|next line)\b/gi, replacement: '\n' },
  { regex: /\b(semicolon)\b/gi, replacement: ';' },
  { regex: /\b(colon)\b/gi, replacement: ':' },
  { regex: /\b(dash|hyphen)\b/gi, replacement: ' — ' }
];

export function formatSpokenPunctuation(rawText) {
  if (!rawText) return '';
  let text = rawText.trim();
  PUNCTUATION_MAP.forEach(({ regex, replacement }) => {
    text = text.replace(regex, replacement);
  });
  if (text.length > 0) {
    text = text.charAt(0).toUpperCase() + text.slice(1);
  }
  return text;
}

export function parseVoiceTargetRouting(text) {
  let target = 'today';
  let cleanText = text;

  if (/^(priority|needle mover|outcome|top 3):?\s*/i.test(cleanText)) {
    target = 'top3';
    cleanText = cleanText.replace(/^(priority|needle mover|outcome|top 3):?\s*/i, '');
  } else if (/^(reflection|reflect|gratitude):?\s*/i.test(cleanText)) {
    target = 'reflection';
    cleanText = cleanText.replace(/^(reflection|reflect|gratitude):?\s*/i, '');
  } else if (/^(note|thought):?\s*/i.test(cleanText)) {
    target = 'today';
    cleanText = cleanText.replace(/^(note|thought):?\s*/i, '');
  }

  return { target, cleanText: cleanText.trim() };
}

export function isSpeechRecognitionSupported() {
  return typeof window !== 'undefined' && 
    Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}
