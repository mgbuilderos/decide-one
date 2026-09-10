# The 5-Credit Lovable.dev Master Playbook

A step-by-step guide to building and publishing the **Dot-Grid Bullet Journal & Productivity Suite** on [Lovable.dev](https://lovable.dev) with zero wasted credits.

---

## 1. What is Lovable and How Does It Work?

**Lovable (lovable.dev)** is an AI web app builder that generates full React + Tailwind + Vite + shadcn/ui applications directly in your browser.

- **The Interface**:
  - **Left panel**: AI Chat (where you send your prompts). Each prompt sent costs **1 credit**.
  - **Right panel**: Live interactive preview of your app running in real time.
  - **Top right**: "Publish" button (gives you a live public link in 10 seconds) and "GitHub" sync button.
- **The Secret to Lovable**:
  - If you give Lovable a short prompt like *"make a journal app"*, it builds something generic and you burn 5 credits trying to fix it.
  - If you give Lovable a **dense, highly structured Master Prompt** on Credit 1, it builds **85% to 90% of the complete application on the very first turn**.

---

## 2. Step-by-Step Setup (2 Minutes)

1. Open your browser and go to [https://lovable.dev](https://lovable.dev).
2. Click **Get Started** or **Log in** (sign in with your Google or GitHub account).
3. On the dashboard, click **"New Project"** or type directly into the prompt bar.
4. You now have a blank project with your credits ready.

---

## 3. The 5-Credit Execution Script (Copy & Paste)

### 🟢 Credit 1 (The Master Prompt — 85% of the App Built)
> **Action**: Paste this entire prompt into Lovable as your first message.

```text
Build a realistic, tactile digital Bullet Journal (BuJo) web application inspired by Ryder Carroll's official @bulletjournal methodology, J.D. Meier's Rule of 3, and a 10-category emoji marker system.

### Visual & Physical Aesthetic:
- Realistic Desk & Notebook: The app sits on a warm dark desk backdrop (#18181b). In the center is an open hardcover notebook with a stitched leather spine, realistic drop shadow, bookmark ribbon, and warm ivory/cream dot-grid paper (#FAF7F2).
- The dot grid should use a subtle repeating radial dot pattern (20px spacing, dot color #D4CDBD) with a soft red vertical margin guide line on the left.
- Typography: Use realistic handwriting/journal typography (Caveat or Patrick Hand for handwriting, Courier Prime for typewriter, and Inter for UI). Provide a font switcher in the toolbar.
- Stationery Pen Tray: A top toolbar styled like a wooden pen rest holding 6 fountain pens (Archival Black #18181B, Royal Navy #1D4ED8, Forest Green #15803D, Burgundy #B91C1C, Deep Violet #7E22CE, Terracotta #C2410C) and 4 pastel highlighters (Yellow, Mint, Peach, Lavender). Clicking a pen sets the active ink color.

### Core Sections on the Daily Spread:
1. Pre-made Date Header: Prominently shows the day of week, date, and month (e.g., "SUNDAY, SEPTEMBER 6, 2026") with "< Previous Day", "Today", and "Next Day >" navigation buttons plus a mini calendar picker.
2. ⚡ Today's Top 3 Hard Tasks (The Rule of 3): A dedicated focus box at the top for the 3 Needle Movers of the day (#1 Alpha Frog, #2 Strategic Core, #3 Essential Anchor) with check-boxes, category badges, and completion animations.
3. • Rapid Logging Stream:
   - Clicking a bullet pointer cycles through authentic BuJo states:
     • Task -> ✕ Completed (with strikethrough) -> > Migrated -> < Scheduled -> ○ Event -> — Note -> ★ Priority.
   - Pressing Enter seamlessly creates the next bullet line.
4. The 10 Real-Life Category Markers with Emojis:
   Each task has an interactive emoji marker that renders as a colored halo around the bullet and a badge:
   - 💼 Work (Royal Navy Blue #1D4ED8)
   - 🌿 Life (Forest Green #15803D)
   - 🏋️ Health (Emerald Mint #059669)
   - ✈️ Travel (Terracotta Amber #C2410C)
   - 📚 Read (Imperial Violet #7E22CE)
   - 🛍️ Shop (Sunset Rose #E11D48)
   - 💳 Money (Golden Bronze #D97706)
   - 🎨 Create (Orchid Magenta #C026D3)
   - ☕ Social (Warm Cocoa #9A3412)
   - 🔥 Urgent (Crimson Scarlet #DC2626)
   Smart keyword detection: typing "read" or "book" auto-selects 📚 Read, "flight" or "pack" auto-selects ✈️ Travel, "gym" or "run" auto-selects 🏋️ Health, "buy" or "grocery" auto-selects 🛍️ Shop.
5. Real-Time Productivity Score: A circular progress gauge showing the daily score based on: (Hard Tasks completed / 3 * 60%) + (Rapid Tasks completed / total * 40%).
6. Persistence: Store all data in browser localStorage so entries persist across refreshes, and prepopulate with realistic sample tasks for today so the app looks vibrant immediately.
```

---

### 🟡 Credit 2 (Monthly Log & Category Grouping)
> **Action**: Once Credit 1 finishes rendering and you can see the app, send this message:

```text
Awesome! Now let's add the Monthly Log view and Category Grouping:

1. Monthly Log View:
   - Add a view toggle in the header: "Daily Log" vs "Monthly Log".
   - In Monthly Log, show an authentic Ryder Carroll monthly spread:
     - Left page: 31-day vertical calendar list (e.g. "01 M", "02 T", "03 W"...) where users can log events or habits for specific days of the month.
     - Right page: Master Monthly Task List & Monthly Focus/Intentions buckets.
2. Category Grouping & Filter Chips:
   - On the Daily Log, add a toolbar control to switch between "Free-flow Chronological" and "Group by Category" (where tasks group under colored banners: 💼 Work, 🌿 Life, ✈️ Travel, etc.).
   - Add quick filter chips at the top ("All", "💼 Work", "✈️ Travel", "🏋️ Health", etc.) to filter tasks with a single click.
```

---

### 🟠 Credit 3 (Analytics Dashboard & Life Balance Radar)
> **Action**: Send this message:

```text
Now let's build the Productivity & Life Balance Analytics modal:

1. Add an "Analytics / Reflection" button in the header that opens an elegant modal spread.
2. The modal should show:
   - Daily & Monthly Productivity Score gauges (0-100%) with status badges ("Flow State 🏆", "High Momentum 🎯", "Getting Started 🌱").
   - Consecutive Journaling Streak counter with flame indicators.
   - Life Harmony / Category Balance breakdown: a visual chart showing the percentage of tasks across Work 💼, Health 🏋️, Life 🌿, Travel ✈️, Learning 📚, etc., with helpful coaching tips.
   - Monthly task completion stats (Total completed, Migrated, Notes captured).
   - An evening reflection card: "What went well today? What can be migrated or let go?".
```

---

### 🔵 Credit 4 (Tactile Sound, Confetti & Print Mode)
> **Action**: Send this message:

```text
Let's add the final sensory polish and data portability:

1. Confetti Celebration: Trigger a celebratory canvas-confetti burst whenever all 3 Hard Tasks are completed or the productivity score hits 100%.
2. Tactile Sound Effects (Web Audio API): Add subtle, gentle audio clicks when toggling bullets and pen colors (include a mute/sound toggle icon in the toolbar).
3. Data Backup: Add an "Export JSON" and "Import JSON" button in the header settings to backup the entire journal.
4. Print / PDF Mode: Add a "Print" button that triggers a clean print stylesheet (@media print) formatted to look like a physical printed dot-grid journal page without UI buttons.
```

---

### 🟣 Credit 5 (QA Buffer & Publishing)
> **Action**: Use this only if you want to tweak any minor detail (e.g. color adjustments or layout spacing). If it already looks great after Credit 4:

1. In the top right corner of Lovable, click **Publish**.
2. Click **Publish to Web**.
3. Lovable will generate a live URL (e.g. `https://my-bullet-journal.lovable.app`) that you can open on your phone, laptop, or share with anyone!
4. (Optional) Click the **GitHub** button in Lovable to export the code to your GitHub account.
