# Project Master Specification: Digital Bullet Journal & Productivity Suite

---

## 1. Project Overview

- **Project Name**: Dot-Grid Bullet Journal (BuJo) & Productivity Suite
- **Repository Location**: `/Users/Maulik/Documents/Claude/Projects/Journal App`
- **Core Inspiration**: Ryder Carroll's official `@bulletjournal` methodology, J.D. Meier's Rule of 3 (Top 3 Hard Tasks), and GTD Contextual Color Markers.
- **Delivery Target**: Production-ready and deployable static web application delivered within 5 execution credits.

---

## 2. Technology Stack & Decision Rationale

| Layer | Selected Technology | Rationale |
| :--- | :--- | :--- |
| **Runtime & Build** | **Vite 5 + React 18** | Zero config overhead, sub-second HMR, rock-solid compilation to standard static files in `dist/`. |
| **Styling & Theme** | **Tailwind CSS 3** | Utility-first styling with custom theme extensions for parchment paper (`#FAF7F2`), grid dots (`#D4CDBD`), and archival pen inks. |
| **Icons** | **Lucide React** | Clean, minimalist, modern iconography matching the stationery theme. |
| **Typography** | **Google Fonts** (Dynamic CDN) | *Caveat* & *Patrick Hand* (Handwriting), *Courier Prime* (Typewriter), *Lora* (Editorial Serif), *Plus Jakarta Sans* (Clean Modern). |
| **Visual Effects** | **Canvas-Confetti** | Rewarding visual feedback upon completing all 3 Hard Tasks or reaching a 100% daily productivity score. |
| **Data Layer** | **Browser LocalStorage** | Zero-latency, 100% privacy, offline-first. Includes schema versioning (`BUJO_DATA_v1`) and JSON Import/Export. |
| **Deployment Target** | **Vercel / Netlify / GitHub Pages** | Static output (`dist/`) that can be hosted for free anywhere with zero environment variables or backend servers. |

---

## 3. Data Schema & Core Interfaces

```javascript
/**
 * Data Schema Definition: journal.js
 */

// Comprehensive 10 Real-Life Master Categories with Emojis & Stationery Inks
export const CATEGORIES = {
  PROFESSIONAL: {
    id: 'professional',
    label: 'Professional',
    badge: 'Work',
    emoji: '💼',
    color: '#1D4ED8',      // Royal Navy Blue
    bg: '#EFF6FF',
    border: '#BFDBFE',
    keywords: ['work', 'meeting', 'client', 'code', 'project', 'deck', 'report', 'email', 'review']
  },
  PERSONAL: {
    id: 'personal',
    label: 'Personal',
    badge: 'Life',
    emoji: '🌿',
    color: '#15803D',      // Forest Pine Green
    bg: '#F0FDF4',
    border: '#BBF7D0',
    keywords: ['home', 'chore', 'clean', 'laundry', 'repair', 'car', 'organize', 'admin', 'routine']
  },
  HEALTH: {
    id: 'health',
    label: 'Health & Fitness',
    badge: 'Health',
    emoji: '🏋️',
    color: '#059669',      // Emerald Mint
    bg: '#ECFDF5',
    border: '#A7F3D0',
    keywords: ['gym', 'workout', 'run', 'yoga', 'doctor', 'dentist', 'walk', 'sleep', 'water', 'meditate']
  },
  TRAVEL: {
    id: 'travel',
    label: 'Travel & Commute',
    badge: 'Travel',
    emoji: '✈️',
    color: '#C2410C',      // Terracotta Amber
    bg: '#FFF7ED',
    border: '#FED7AA',
    keywords: ['travel', 'flight', 'hotel', 'pack', 'airport', 'trip', 'train', 'ticket', 'passport', 'vacation']
  },
  LEARNING: {
    id: 'learning',
    label: 'Reading & Learning',
    badge: 'Read',
    emoji: '📚',
    color: '#7E22CE',      // Deep Imperial Violet
    bg: '#FAF5FF',
    border: '#E9D5FF',
    keywords: ['book', 'read', 'study', 'course', 'learn', 'article', 'paper', 'podcast', 'notes', 'language']
  },
  SHOPPING: {
    id: 'shopping',
    label: 'Shopping & Errands',
    badge: 'Shop',
    emoji: '🛍️',
    color: '#E11D48',      // Sunset Rose
    bg: '#FFF1F2',
    border: '#FECDD3',
    keywords: ['buy', 'shop', 'grocery', 'pharmacy', 'market', 'order', 'amazon', 'supplies', 'return']
  },
  FINANCE: {
    id: 'finance',
    label: 'Finance & Wealth',
    badge: 'Money',
    emoji: '💳',
    color: '#D97706',      // Golden Bronze
    bg: '#FFFBEB',
    border: '#FDE68A',
    keywords: ['pay', 'bill', 'rent', 'bank', 'invest', 'tax', 'budget', 'invoice', 'salary', 'money']
  },
  CREATIVE: {
    id: 'creative',
    label: 'Creative & Hobby',
    badge: 'Create',
    emoji: '🎨',
    color: '#C026D3',      // Orchid Magenta
    bg: '#FDF4FF',
    border: '#F5D0FE',
    keywords: ['draw', 'paint', 'write', 'photo', 'music', 'design', 'craft', 'cook', 'recipe', 'art']
  },
  SOCIAL: {
    id: 'social',
    label: 'Social & Family',
    badge: 'Social',
    emoji: '☕',
    color: '#9A3412',      // Warm Cocoa / Rust
    bg: '#FFF7ED',
    border: '#FFEDD5',
    keywords: ['dinner', 'lunch', 'coffee', 'friends', 'family', 'mom', 'dad', 'birthday', 'date', 'party']
  },
  URGENT: {
    id: 'urgent',
    label: 'Urgent / Priority',
    badge: 'Urgent',
    emoji: '🔥',
    color: '#DC2626',      // Crimson Scarlet
    bg: '#FEF2F2',
    border: '#FECACA',
    keywords: ['urgent', 'asap', 'deadline', 'critical', 'blocker', 'priority', 'emergency', 'must']
  }
};

// Ryder Carroll BuJo Bullet Pointer Types
export const BULLET_TYPES = {
  TASK: { id: 'task', symbol: '•', label: 'Task' },
  COMPLETED: { id: 'completed', symbol: '✕', label: 'Completed' },
  MIGRATED: { id: 'migrated', symbol: '>', label: 'Migrated' },
  SCHEDULED: { id: 'scheduled', symbol: '<', label: 'Scheduled' },
  EVENT: { id: 'event', symbol: '○', label: 'Event' },
  NOTE: { id: 'note', symbol: '—', label: 'Note' },
  PRIORITY: { id: 'priority', symbol: '★', label: 'Priority' }
};

// Pen Ink Palette
export const PEN_COLORS = [
  { id: 'black', name: 'Archival Black', hex: '#18181B' },
  { id: 'blue', name: 'Royal Navy', hex: '#1D4ED8' },
  { id: 'green', name: 'Forest Green', hex: '#15803D' },
  { id: 'red', name: 'Burgundy Wine', hex: '#B91C1C' },
  { id: 'violet', name: 'Imperial Violet', hex: '#7E22CE' },
  { id: 'amber', name: 'Terracotta', hex: '#C2410C' }
];

// Highlighter Tints
export const HIGHLIGHTERS = [
  { id: 'none', name: 'None', hex: 'transparent' },
  { id: 'yellow', name: 'Sunbeam Yellow', hex: '#FEF08A' },
  { id: 'mint', name: 'Mint Breeze', hex: '#BBF7D0' },
  { id: 'peach', name: 'Soft Peach', hex: '#FED7AA' },
  { id: 'lavender', name: 'Lavender Mist', hex: '#E9D5FF' }
];

// Typography Settings
export const FONTS = [
  { id: 'caveat', name: 'Caveat (Handwritten Script)', family: "'Caveat', cursive" },
  { id: 'patrick', name: 'Patrick Hand (Neat Print)', family: "'Patrick Hand', cursive" },
  { id: 'courier', name: 'Courier Prime (Typewriter)', family: "'Courier Prime', monospace" },
  { id: 'lora', name: 'Lora (Literary Serif)', family: "'Lora', serif" },
  { id: 'sans', name: 'Plus Jakarta Sans (Modern)', family: "'Plus Jakarta Sans', sans-serif" }
];

// Daily Log Record Structure (Keyed by YYYY-MM-DD)
export interface DailyLogRecord {
  dateString: string;       // e.g. "2026-09-06"
  // The 3 Hard Tasks of the day (Rule of 3)
  hardTasks: [
    { id: string; text: string; completed: boolean; category: string; penColor: string },
    { id: string; text: string; completed: boolean; category: string; penColor: string },
    { id: string; text: string; completed: boolean; category: string; penColor: string }
  ];
  // Dynamic Rapid Log Entries
  rapidLog: Array<{
    id: string;
    type: 'task' | 'completed' | 'migrated' | 'scheduled' | 'event' | 'note' | 'priority';
    text: string;
    category: 'professional' | 'personal' | 'travel' | 'creative' | 'urgent';
    penColor: string;
    highlighter: string;
    timestamp: string;
  }>;
  // Evening reflection note
  reflection: string;
}
```

---

## 4. Component Architecture Hierarchy

```text
App.jsx (Root State, Active Date, Global Theme, Font & Pen Selector)
│
├── HeaderToolbar.jsx
│   ├── ViewSelector (Daily Log, Monthly Log, Productivity Analytics)
│   ├── PenTray (Ink colors + Highlighter tools)
│   ├── FontSelector (Font family + Size stepper)
│   └── DataActions (Backup JSON, Restore JSON, Print View)
│
└── NotebookContainer.jsx (Realistic 3D Desk, Leather Cover, Dot-Grid Spread)
    │
    ├── DailyLogSpread.jsx (When viewing Daily mode)
    │   ├── DateHeader.jsx (Day, Date, Month pre-formatted + Date Navigator)
    │   │
    │   ├── Top3HardTasksSection.jsx ("The 3 Needle Movers")
    │   │   ├── HardTaskRow #1 (Alpha Frog, Category Marker, Completion Checkbox)
    │   │   ├── HardTaskRow #2 (Core Milestone)
    │   │   └── HardTaskRow #3 (Important Anchor)
    │   │
    │   ├── RapidLogSection.jsx ("• Rapid Logging Stream")
    │   │   ├── BulletItem.jsx (Interactive Morphing Pointer, Category Tag, Inline Text)
    │   │   └── QuickAddInput.jsx (Auto-focus, Enter to log, Category quick-toggle)
    │   │
    │   └── DailyScoreWidget.jsx (Real-time completion percentage & status badge)
    │
    ├── MonthlyLogSpread.jsx (When viewing Monthly mode)
    │   ├── LeftPage: 31-Day Vertical Index (`01 M`, `02 T`, `03 W`...) for events
    │   └── RightPage: Master Monthly Goals & Category Task Buckets
    │
    └── ProductivityModal.jsx (Deep-dive Analytics & Streaks)
        ├── Daily & Monthly Productivity Gauge
        ├── 3-Hard-Tasks Completion Rate
        ├── Category Distribution Breakdown (Work vs Life vs Travel)
        └── Journaling Streak & Consistency Heatmap
```

---

## 5. Productivity Scoring Formula & Logic

```javascript
// Calculation Logic
export function calculateDailyScore(log) {
  if (!log) return 0;
  
  // 1. Calculate Top 3 Hard Tasks completion (Weighted at 60%)
  const hardTotal = log.hardTasks.filter(t => t.text.trim() !== '').length;
  const hardDone = log.hardTasks.filter(t => t.text.trim() !== '' && t.completed).length;
  const hardScore = hardTotal > 0 ? (hardDone / hardTotal) * 60 : 0;
  
  // 2. Calculate Rapid Log Tasks completion (Weighted at 40%)
  // Only tasks, completed, and migrated items count as actionable (Notes and Events don't penalize)
  const actionableItems = log.rapidLog.filter(item => 
    ['task', 'completed', 'migrated'].includes(item.type) && item.text.trim() !== ''
  );
  const completedItems = log.rapidLog.filter(item => item.type === 'completed');
  
  const rapidScore = actionableItems.length > 0 
    ? (completedItems.length / actionableItems.length) * 40 
    : 40; // If no regular tasks entered, give full credit for rapid section
    
  return Math.min(100, Math.round(hardScore + rapidScore));
}
```

---

## 6. Deployment Guide (Zero Server, 100% Free)

### Option A: Vercel (Recommended, 30-Second Setup)
1. Push project to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete bullet journal app"
   git push origin main
   ```
2. Import the repository in [vercel.com](https://vercel.com).
3. Framework Preset: `Vite`. Build Command: `npm run build`. Output Directory: `dist`. Click **Deploy**.

### Option B: Netlify (Drag & Drop or Git)
1. Run local build: `npm run build`
2. Drag the generated `dist/` folder into Netlify Drop ([app.netlify.com/drop](https://app.netlify.com/drop)) for instantaneous instant live URL.

### Option C: GitHub Pages
1. Set `base: './'` in `vite.config.js`.
2. Run `npm run build`. Deploy the `dist/` branch via `gh-pages` or GitHub Actions.

---

## 7. Execution Progress & 5-Credit Tracking

- [x] **Credit 1: Research, Strategy & Project Blueprint**
  - Analyzed `@bulletjournal` videos and transcripts.
  - Researched open-source productivity journals across GitHub.
  - Synthesized BuJo, Rule of 3 (Top 3 Hard Tasks), and Category Markers.
  - Generated `research.md`, `purpose.md`, `project.md`, and updated `implementation_plan.md`.
- [ ] **Credit 2: Scaffolding & Core Architecture**
  - Initialize Vite React project.
  - Setup Tailwind CSS with custom parchment colors and dot-grid pattern.
  - Configure Google Fonts loader (*Caveat*, *Patrick Hand*, *Courier Prime*, *Lora*).
  - Implement data models and `useJournalStorage` persistence hook.
- [ ] **Credit 3: Daily Log Spread, Rapid Logging & Styling Controls**
  - Pre-made Date/Day/Month header with calendar navigator.
  - Top 3 Hard Tasks section with category badges.
  - Rapid logging bullet stream (`•`, `✕`, `>`, `<`, `—`, `○`, `★`).
  - Pen palette (6 archival colors + highlighters) and typography switcher.
- [ ] **Credit 4: Monthly Log Spread & Productivity Scoring Engine**
  - 31-day vertical monthly log + monthly master intentions.
  - Daily & monthly productivity analytics dashboard with visual gauges.
  - Streak tracking and category balance metrics.
- [ ] **Credit 5: Polish, Production Build & Deployment Readiness**
  - Confetti animations, tactile feedback, sound effects (toggleable).
  - Print/PDF stylesheet for physical paper export.
  - Execute `npm run build`, test distribution output, and finalize deployment documentation.
