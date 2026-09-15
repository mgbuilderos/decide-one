// Rule 3: a shared threshold for literal RGB spread; only progress declarations
// may contain chroma. The threshold is zero: the brief says black and white.
export const CHROMA_LIMIT = 0;
const NEUTRALS = new Set(['black', 'white', 'neutral', 'transparent', 'current', 'inherit']);
const CSS_NEUTRALS = new Set(['black', 'white', 'gray', 'grey', 'dimgray', 'dimgrey', 'darkgray', 'darkgrey', 'lightgray', 'lightgrey', 'silver', 'gainsboro', 'whitesmoke', 'transparent', 'currentcolor', 'inherit', 'initial', 'unset', 'none']);
export function colourViolations(source) {
  const problems = [];
  const code = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/<!--[^]*?-->/g, '')
    .replace(/(?:\.dark\s+)?\.progress-(?:ink|bg|border)-(?:red|yellow|green)\s*\{[^}]*\}/g, '');
  // Palette utilities, including arbitrary shade values, use the allow-list.
  const palette = /\b(?:bg|text|border|ring|stroke|fill|shadow|from|via|to|decoration|outline|accent|caret|placeholder)-([a-z]+)-(?:\d{2,3}|\[[^\]]+\])/g;
  for (const m of code.matchAll(palette)) if (!NEUTRALS.has(m[1]) && !['opacity','offset'].includes(m[1])) problems.push(m[0]);
  for (const m of code.matchAll(/(?<![\w-])(?:bg|text|border|ring|stroke|fill|shadow|from|via|to|decoration|outline|accent|caret|placeholder)-(red|orange|yellow|green|blue|purple|pink|cyan|magenta|rebeccapurple)(?![a-z])/g)) problems.push(m[0]);
  // Plain named values must also be neutral; renamed hues and arbitrary-value
  // utilities must not bypass the palette check. Sizes/functions are handled
  // separately, so text-[13px] and stroke-[2] remain valid.
  for (const m of code.matchAll(/(?<![\w-])(?:color|background(?:-color)?|fill|stroke)\s*[:=]\s*['"]?([a-z]+)(?=['"\s;,}]|$)/gi)) {
    if (!CSS_NEUTRALS.has(m[1].toLowerCase())) problems.push(m[0]);
  }
  for (const m of code.matchAll(/(?:bg|text|border|ring|stroke|fill|shadow|from|via|to|decoration|outline|accent|caret|placeholder)-\[([a-z]+)\]/gi)) {
    if (!CSS_NEUTRALS.has(m[1].toLowerCase())) problems.push(m[0]);
  }
  const check = (rgb, label) => { if (Math.max(...rgb) - Math.min(...rgb) > CHROMA_LIMIT) problems.push(label); };
  for (const m of code.matchAll(/#([\da-f]{8}|[\da-f]{6}|[\da-f]{4}|[\da-f]{3})\b/gi)) {
    const h = m[1].length < 5 ? [...m[1]].map(c => c+c).join('') : m[1];
    check([0,2,4].map(i=>parseInt(h.slice(i,i+2),16)),m[0]);
  }
  for (const m of code.matchAll(/rgba?\(([^)]+)\)/g)) {
    const channels = m[1].replaceAll('_',' ').split(/[,\s/]+/).filter(Boolean).slice(0,3);
    if (channels.length !== 3 || channels.some(c=>!/^\d*\.?\d+%?$/.test(c))) { problems.push(m[0]); continue; }
    check(channels.map(c=>parseFloat(c)*(c.endsWith('%')?2.55:1)),m[0]);
  }
  for (const m of code.matchAll(/hsla?\(([^)]+)\)/g)) {
    const channels=m[1].replaceAll('_',' ').split(/[,\s/]+/).filter(Boolean);
    if (parseFloat(channels[1]) !== 0) problems.push(m[0]);
  }
  // Other colour spaces must be converted to the explicit RGB contract first.
  for (const m of code.matchAll(/\b(?:oklch|oklab|lch|lab|hwb|color)\([^)]*\)/g)) problems.push(m[0]);
  return [...new Set(problems)];
}
