import { useMemo } from 'react';
import { CATEGORIES } from '../types/journal';

export function getFrameworkCompletion(dailyLog) {
  if (!dailyLog) return { done: 0, total: 0 };
  const fw = dailyLog.activeFramework || 'rule_of_3';
  const data = dailyLog.frameworkData || {};
  const currentFwData = data[fw] || {};

  if (fw === 'rule_of_3') {
    const tasks = (dailyLog.hardTasks || []).filter(t => t && t.text && t.text.trim());
    return {
      done: tasks.filter(t => t.completed).length,
      total: tasks.length
    };
  }
  if (fw === 'eisenhower') {
    const q = currentFwData.quadrants || {};
    const all = Object.values(q).map(arr => arr[0]).filter(t => t && t.text && t.text.trim());
    return {
      done: all.filter(t => t.completed).length,
      total: all.length
    };
  }
  if (fw === 'ivy_lee') {
    const tasks = (currentFwData.tasks || []).filter(t => t && t.text && t.text.trim());
    return {
      done: tasks.filter(t => t.completed).length,
      total: tasks.length
    };
  }
  return { done: 0, total: 0 };
}

export function useProductivity(dailyLog, allDailyLogs = {}, currentMonthKey = '') {
  // 1. Daily Calculation
  const dailyMetrics = useMemo(() => {
    if (!dailyLog) {
      return { score: 0, hardDone: 0, hardTotal: 0, rapidDone: 0, rapidTotal: 0, status: 'Rest' };
    }

    // Dynamic Active Framework Completion
    const { done: hardDone, total: hardTotal } = getFrameworkCompletion(dailyLog);
    const hardScore = hardTotal > 0 ? (hardDone / hardTotal) * 60 : 0;

    // Execution Stream Actionable Tasks
    const rapidItems = dailyLog.rapidLog || [];
    const actionable = rapidItems.filter(item => ['task', 'completed', 'migrated'].includes(item.type) && item.text && item.text.trim() !== '');
    const rapidDone = actionable.filter(item => item.type === 'completed').length;
    const rapidTotal = actionable.length;
    
    // If no stream tasks entered, give full credit for stream portion if framework tasks were done
    const rapidScore = rapidTotal > 0 ? (rapidDone / rapidTotal) * 40 : (hardTotal > 0 ? 40 : 0);

    const rawScore = Math.round(hardScore + rapidScore);
    const score = Math.min(100, rawScore);

    let status = 'Getting Started 🌱';
    let statusColor = 'text-neutral-400 dark:text-neutral-500';
    if (score >= 90) {
      status = 'Flow State 🏆';
      statusColor = 'text-neutral-900 dark:text-neutral-100 font-semibold';
    } else if (score >= 70) {
      status = 'High Momentum 🎯';
      statusColor = 'text-neutral-800 dark:text-neutral-200 font-medium';
    } else if (score >= 50) {
      status = 'Steady Progress ⚡';
      statusColor = 'text-neutral-600 dark:text-neutral-400';
    }

    // Counts by type
    const eventsCount = rapidItems.filter(i => i.type === 'event').length;
    const notesCount = rapidItems.filter(i => i.type === 'note').length;
    const migratedCount = rapidItems.filter(i => i.type === 'migrated').length;

    return {
      score,
      hardDone,
      hardTotal,
      rapidDone,
      rapidTotal,
      eventsCount,
      notesCount,
      migratedCount,
      status,
      statusColor
    };
  }, [dailyLog]);

  // 2. Category Distribution (Life Harmony)
  const categoryDistribution = useMemo(() => {
    const counts = {};
    Object.keys(CATEGORIES).forEach(k => {
      counts[CATEGORIES[k].id] = 0;
    });

    let totalTasks = 0;

    // Count from hard tasks
    if (dailyLog && dailyLog.hardTasks) {
      dailyLog.hardTasks.forEach(t => {
        if (t.text && t.text.trim()) {
          const cat = t.category || 'personal';
          counts[cat] = (counts[cat] || 0) + 1;
          totalTasks++;
        }
      });
    }

    // Count from rapid log
    if (dailyLog && dailyLog.rapidLog) {
      dailyLog.rapidLog.forEach(t => {
        if (t.text && t.text.trim()) {
          const cat = t.category || 'personal';
          counts[cat] = (counts[cat] || 0) + 1;
          totalTasks++;
        }
      });
    }

    const breakdown = Object.keys(CATEGORIES).map(k => {
      const cat = CATEGORIES[k];
      const count = counts[cat.id] || 0;
      const percentage = totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0;
      return {
        ...cat,
        count,
        percentage
      };
    }).filter(c => c.count > 0);

    return { breakdown, totalTasks };
  }, [dailyLog]);

  // 3. Consecutive Streak Calculation
  const streak = useMemo(() => {
    const dates = Object.keys(allDailyLogs).sort().reverse();
    if (dates.length === 0) return 1;

    let count = 0;
    for (const d of dates) {
      const log = allDailyLogs[d];
      const hasActivity = (log.hardTasks && log.hardTasks.some(t => t.text && t.text.trim())) ||
                          (log.rapidLog && log.rapidLog.length > 0);
      if (hasActivity) {
        count++;
      } else {
        break;
      }
    }
    return Math.max(1, count);
  }, [allDailyLogs]);

  // 4. Monthly Aggregates
  const monthlyStats = useMemo(() => {
    if (!currentMonthKey) return { totalCompleted: 0, totalLogged: 0, monthlyRate: 0 };

    let totalCompleted = 0;
    let totalLogged = 0;

    Object.keys(allDailyLogs).forEach(dateKey => {
      if (dateKey.startsWith(currentMonthKey)) {
        const log = allDailyLogs[dateKey];
        if (log.hardTasks) {
          log.hardTasks.forEach(t => {
            if (t.text && t.text.trim()) {
              totalLogged++;
              if (t.completed) totalCompleted++;
            }
          });
        }
        if (log.rapidLog) {
          log.rapidLog.forEach(t => {
            if (['task', 'completed'].includes(t.type) && t.text && t.text.trim()) {
              totalLogged++;
              if (t.type === 'completed') totalCompleted++;
            }
          });
        }
      }
    });

    const monthlyRate = totalLogged > 0 ? Math.round((totalCompleted / totalLogged) * 100) : 0;

    return {
      totalCompleted,
      totalLogged,
      monthlyRate
    };
  }, [allDailyLogs, currentMonthKey]);

  return {
    dailyMetrics,
    categoryDistribution,
    streak,
    monthlyStats
  };
}
