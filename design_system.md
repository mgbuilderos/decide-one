# PocketBook Design System & Quality Control (QC) Gate

## 1. Philosophical Foundations
PocketBook is designed around **Functional Reductionism**, **Tactile Authenticity**, and **Precision Swiss Typography**. Inspired by the industrial craftsmanship of Dieter Rams, Jony Ive, and Bruce Chatwin’s iconic pocket notebooks.

---

## 2. Universal Typography Tokens
- **Single Font Family**: `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Inter, sans-serif`.
- **Zero Monospace & Zero Serif**: All numerical stamps, codes, and labels strictly use tabular numerals in Helvetica.

| Token | CSS / Tailwind Classes | Font Size | Weight | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display Title** | `text-xl sm:text-2xl font-bold tracking-tight` | 20px / 24px | Bold (700) | `-0.02em` | Date Header Hero |
| **Section Heading** | `text-xs font-bold uppercase tracking-wider` | 12px (0.75rem) | Bold (700) | `+0.05em` | **ALL** Section Titles (Priorities, Rapid Log, Rituals, Reflection, Calendar, Master Tasks) |
| **Meta / Eyebrow** | `text-[10px] uppercase tracking-widest font-semibold text-neutral-400` | 10px | Semibold (600) | `+0.1em` | Date Eyebrows, Sub-badges, Footer marks |
| **Task / Bullet Body**| `text-xs sm:text-[13px] font-normal leading-snug` | 12px / 13px | Normal (400) | Normal | Rapid Log inputs, Priority task inputs, Event notes |
| **Category Pill** | `text-[10px] font-medium tracking-normal` | 10px | Medium (500) | Normal | Category badges, filter chips |
| **Habit Pill** | `text-[11px] font-medium` | 11px | Medium (500) | Normal | Daily Ritual toggle pills |

---

## 3. Standardized Component Dimensions & Ratios

### A. Notebook Physical Canvas
- **Aspect Ratio**: Authentic Portrait Pocketbook (~1 : 1.35 to 1 : 1.45).
- **Max Width**: `max-w-[600px]` (Strict portrait proportion, avoiding wide squarish desktop sprawl).
- **Page Fill**: Pure crisp white `#FFFFFF` (light) / `#141416` (dark).
- **Desk Surface**: Aspirational Luxury Studio Grey `#E1E1E6` (light) / `#0B0B0D` (dark).
- **Stacked Paper Edge**: Multi-layer sheet illusion (`::before` #FBFBFC, `::after` #F5F5F7).

### B. Vertical Budget (Zero-Scroll Viewport Lock)
| Section | Standard Height | Vertical Proportion |
| :--- | :--- | :--- |
| **Header Toolbar** | 36px | Fixed Header (External) |
| **Masthead (Date + Quote)**| ~40px | Fixed Top |
| **Priorities (Top 3 Hard Tasks)**| ~90px (3 × 24px rows + partition) | Fixed Priority Block |
| **Rapid Log (Primary Writing Area)**| **280px – 340px** | **Flex-1 (Lion's share of space: 8–12 visible lines)** |
| **Daily Rituals (Single Line)**| ~48px (22px pills + partition) | Fixed Bottom Block |
| **Evening Reflection** | ~54px (2-row textarea + partition) | Fixed Bottom Debrief |
| **Stamped Page Mark** | ~18px | Fixed Footnote |

---

## 4. Standardized Section Partition Rule
Every section header across the entire app (Daily Log and Monthly Log) **MUST** use the exact identical partition markup:
```jsx
<div className="flex items-center justify-between pb-1 mb-1.5 border-b border-black/[0.08] dark:border-white/[0.08] shrink-0">
  <div className="flex items-center gap-1.5">
    <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
      {SECTION_TITLE}
    </h2>
    <span className="text-[10px] font-normal text-neutral-400 dark:text-neutral-500">
      {SUBTITLE}
    </span>
  </div>
  {/* Optional Right Action/Badge */}
</div>
```

---

## 5. Strict Quality Control (QC) Gate Checklist
Before any new UI element or refactor is approved, it must pass all 7 criteria:

- [ ] **QC Gate 1 — Typographic Purity**: Uses solely Helvetica / Apple SF Pro with defined tokens. Zero monospace font classes (`font-mono`) or serif fonts.
- [ ] **QC Gate 2 — Heading Uniformity**: Section heading uses the exact `text-xs font-bold uppercase tracking-wider` token and border divider.
- [ ] **QC Gate 3 — Color Contrast**: Pure crisp white `#FFFFFF` for the notebook page; pure monochrome inks (`#000000` / `#FFFFFF` with neutral gray accents); no colored badges.
- [ ] **QC Gate 4 — Vertical Budget Adherence**: Must not expand beyond allocated component height or break the zero-scroll single screen layout.
- [ ] **QC Gate 5 — Writing Room Protection**: Rapid Log must retain at least 250px of visible height so the user has generous room to write.
- [ ] **QC Gate 6 — Diary Proportions**: Container width strictly confined to `max-w-[600px]` portrait proportions.
- [ ] **QC Gate 7 — Multi-Device Tactility**: All interactive toggles and page flips trigger subtle Web Audio feedback and smooth physical animations.
