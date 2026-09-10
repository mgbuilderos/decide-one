/**
 * TimeCapsuleEngine.js
 * O(1) Lookback and conquered-victory synthesis for Decide One.
 * Resurfaces anniversaries (1 year ago, 6 months ago, 90 days ago)
 * and synthesizes personal growth and compounding habit streaks.
 */

export class TimeCapsuleEngine {
  constructor(dailyLogs = {}) {
    this.dailyLogs = dailyLogs || {};
    this.doyIndex = new Map(); // (month << 5 | day) -> Array<dateKey>
    this._buildDoyIndex();
  }

  _buildDoyIndex() {
    for (const dateKey of Object.keys(this.dailyLogs)) {
      const parts = dateKey.split('-');
      if (parts.length !== 3) continue;
      const m = parseInt(parts[1], 10);
      const d = parseInt(parts[2], 10);
      const hash = (m << 5) | d;

      let list = this.doyIndex.get(hash);
      if (!list) {
        list = [];
        this.doyIndex.set(hash, list);
      }
      list.push(dateKey);
    }
  }

  getAnniversariesForDate(currentDate = new Date()) {
    const m = currentDate.getMonth() + 1;
    const d = currentDate.getDate();
    const hash = (m << 5) | d;
    const currentYear = currentDate.getFullYear();
    const currentKey = `${currentYear}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

    const matchingKeys = this.doyIndex.get(hash) || [];
    const pastYears = matchingKeys
      .filter(k => k < currentKey)
      .sort((a, b) => b.localeCompare(a)); // Descending by year

    const cards = [];

    for (const pastKey of pastYears) {
      const pastYear = parseInt(pastKey.split('-')[0], 10);
      const yearsAgo = currentYear - pastYear;
      const log = this.dailyLogs[pastKey];
      if (!log) continue;

      const synthesis = this._synthesizeMemory(log, pastKey, yearsAgo);
      if (synthesis) cards.push(synthesis);
    }

    return cards;
  }

  _synthesizeMemory(log, dateKey, yearsAgo) {
    const hardTasks = log.hardTasks || [];
    const rapidLog = log.rapidLog || [];
    const completedHard = hardTasks.filter(t => t && t.completed && t.text && t.text.trim());
    const completedRapid = rapidLog.filter(t => t && (t.type === 'completed' || t.type === 'done') && t.text && t.text.trim());
    const habitsCount = (log.completedHabits || []).length;
    const hasReflection = Boolean(log.reflection && log.reflection.trim().length > 0);

    // Compute Victory Quotient
    const victoryQuotient =
      completedHard.length * 35 +
      completedRapid.length * 12 +
      (habitsCount >= 3 ? 25 : habitsCount * 6) +
      (hasReflection ? 20 : 0);

    let milestoneTitle = `${yearsAgo} Year${yearsAgo > 1 ? 's' : ''} Ago Today`;
    let headline = 'A Day of Deliberate Focus';

    if (completedHard.length === 3) {
      headline = 'Sovereign Focus Day (All 3 Key Outcomes Conquered)';
    } else if (victoryQuotient >= 70) {
      headline = 'Steady Momentum & Execution';
    } else if (hasReflection && completedHard.length === 0) {
      headline = 'Quiet Evening Contemplation';
    }

    const conquests = [
      ...completedHard.map(t => t.text),
      ...completedRapid.slice(0, 2).map(t => t.text)
    ];

    return {
      dateKey,
      yearsAgo,
      milestoneTitle,
      headline,
      victoryQuotient,
      reflection: log.reflection || null,
      topConquests: conquests,
      habitsCount
    };
  }
}
