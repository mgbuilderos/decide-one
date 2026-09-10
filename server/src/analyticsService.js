import { db } from './db.js';

export const AnalyticsService = {
  /**
   * Get core executive KPI metrics: DAU, WAU, MAU, Stickiness, Standard App Time
   */
  getOverview() {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000).toISOString();

    // Active users
    const dauRow = db.prepare(`
      SELECT COUNT(DISTINCT anonymous_id) as count FROM events WHERE timestamp >= ?
    `).get(oneDayAgo);

    const wauRow = db.prepare(`
      SELECT COUNT(DISTINCT anonymous_id) as count FROM events WHERE timestamp >= ?
    `).get(sevenDaysAgo);

    const mauRow = db.prepare(`
      SELECT COUNT(DISTINCT anonymous_id) as count FROM events WHERE timestamp >= ?
    `).get(thirtyDaysAgo);

    const liveUsersRow = db.prepare(`
      SELECT COUNT(DISTINCT anonymous_id) as count FROM sessions WHERE last_heartbeat >= ?
    `).get(fiveMinutesAgo);

    const totalEventsRow = db.prepare(`
      SELECT COUNT(*) as count FROM events
    `).get();

    const totalSessionsRow = db.prepare(`
      SELECT COUNT(*) as count FROM sessions
    `).get();

    // Standard App Time & Session Durations
    const sessionTimeRow = db.prepare(`
      SELECT 
        AVG(active_seconds) as avg_active_seconds,
        AVG(idle_seconds) as avg_idle_seconds,
        SUM(active_seconds) as total_active_seconds,
        SUM(idle_seconds) as total_idle_seconds
      FROM sessions
    `).get();

    const dau = dauRow?.count || 0;
    const wau = wauRow?.count || 0;
    const mau = mauRow?.count || 0;
    const liveUsers = liveUsersRow?.count || 0;
    const totalEvents = totalEventsRow?.count || 0;
    const totalSessions = totalSessionsRow?.count || 0;

    const stickinessRatio = mau > 0 ? parseFloat(((dau / mau) * 100).toFixed(1)) : 0;
    const avgActiveSecs = Math.round(sessionTimeRow?.avg_active_seconds || 0);
    const avgIdleSecs = Math.round(sessionTimeRow?.avg_idle_seconds || 0);
    const standardAppTimeMinutes = parseFloat((avgActiveSecs / 60).toFixed(1));
    const totalActiveHours = parseFloat(((sessionTimeRow?.total_active_seconds || 0) / 3600).toFixed(1));

    return {
      dau,
      wau,
      mau,
      stickiness_ratio_pct: stickinessRatio,
      live_active_users: liveUsers,
      total_sessions: totalSessions,
      total_events: totalEvents,
      standard_app_time_minutes: standardAppTimeMinutes,
      avg_active_seconds: avgActiveSecs,
      avg_idle_seconds: avgIdleSecs,
      total_active_hours: totalActiveHours,
      active_to_idle_ratio: avgIdleSecs > 0 ? parseFloat((avgActiveSecs / avgIdleSecs).toFixed(2)) : 1.0
    };
  },

  /**
   * Get feature usage and adoption distribution
   */
  getFeatures() {
    // Top events distribution
    const eventCounts = db.prepare(`
      SELECT event, COUNT(*) as count 
      FROM events 
      GROUP BY event 
      ORDER BY count DESC 
      LIMIT 20
    `).all();

    // Framework selection breakdown
    const frameworkEvents = db.prepare(`
      SELECT properties FROM events WHERE event = 'framework_selected'
    `).all();

    const frameworkDistribution = {};
    for (const row of frameworkEvents) {
      try {
        const props = JSON.parse(row.properties);
        const fw = props.framework_id || 'unknown';
        frameworkDistribution[fw] = (frameworkDistribution[fw] || 0) + 1;
      } catch (e) {}
    }

    // Task completion ratio (rapid log)
    const taskCreatedRow = db.prepare(`
      SELECT COUNT(*) as count FROM events WHERE event = 'rapid_log_created'
    `).get();
    const taskCompletedRow = db.prepare(`
      SELECT COUNT(*) as count FROM events WHERE event = 'rapid_log_status_toggled' AND properties LIKE '%"to_status":"done"%'
    `).get();

    const tasksCreated = taskCreatedRow?.count || 0;
    const tasksCompleted = taskCompletedRow?.count || 0;
    const taskCompletionRatio = tasksCreated > 0 
      ? parseFloat(((tasksCompleted / tasksCreated) * 100).toFixed(1)) 
      : 0;

    // Habit tracking stats
    const habitTicksRow = db.prepare(`
      SELECT COUNT(*) as count FROM events WHERE event = 'habit_toggled'
    `).get();

    // Voice dictation stats
    const dictationStartsRow = db.prepare(`
      SELECT COUNT(*) as count FROM events WHERE event = 'dictation_started'
    `).get();
    const dictationSuccessRow = db.prepare(`
      SELECT COUNT(*) as count FROM events WHERE event = 'dictation_completed'
    `).get();

    const dictationStarts = dictationStartsRow?.count || 0;
    const dictationSuccess = dictationSuccessRow?.count || 0;
    const dictationSuccessRate = dictationStarts > 0 
      ? parseFloat(((dictationSuccess / dictationStarts) * 100).toFixed(1)) 
      : 0;

    return {
      top_events: eventCounts,
      framework_distribution: frameworkDistribution,
      rapid_log: {
        created: tasksCreated,
        completed: tasksCompleted,
        completion_ratio_pct: taskCompletionRatio
      },
      habit_ticks_count: habitTicksRow?.count || 0,
      dictation: {
        started: dictationStarts,
        completed: dictationSuccess,
        success_rate_pct: dictationSuccessRate
      }
    };
  },

  /**
   * Daily Ritual Funnel and drop-off analysis
   */
  getFunnels() {
    // 5-Step Daily Ritual Funnel:
    // Step 1: session_start
    // Step 2: framework_task_added OR rapid_log_created (Morning Planning)
    // Step 3: habit_toggled (Midday Execution)
    // Step 4: reflection_saved (Evening Reflection)
    // Step 5: day_closed (Executive Closure Ritual)

    const step1Users = db.prepare(`
      SELECT DISTINCT anonymous_id FROM events WHERE event = 'session_start'
    `).all().map(r => r.anonymous_id);

    const step2Users = db.prepare(`
      SELECT DISTINCT anonymous_id FROM events WHERE event IN ('framework_task_added', 'rapid_log_created')
    `).all().map(r => r.anonymous_id);

    const step3Users = db.prepare(`
      SELECT DISTINCT anonymous_id FROM events WHERE event = 'habit_toggled'
    `).all().map(r => r.anonymous_id);

    const step4Users = db.prepare(`
      SELECT DISTINCT anonymous_id FROM events WHERE event = 'reflection_saved'
    `).all().map(r => r.anonymous_id);

    const step5Users = db.prepare(`
      SELECT DISTINCT anonymous_id FROM events WHERE event = 'day_closed'
    `).all().map(r => r.anonymous_id);

    const count1 = step1Users.length;
    const count2 = step2Users.filter(id => step1Users.includes(id)).length;
    const count3 = step3Users.filter(id => step2Users.includes(id)).length;
    const count4 = step4Users.filter(id => step3Users.includes(id)).length;
    const count5 = step5Users.filter(id => step4Users.includes(id)).length;

    const buildStep = (name, count, prevCount, baselineCount) => {
      const conversionFromPrev = prevCount > 0 ? parseFloat(((count / prevCount) * 100).toFixed(1)) : 0;
      const overallConversion = baselineCount > 0 ? parseFloat(((count / baselineCount) * 100).toFixed(1)) : 0;
      const dropoffRate = prevCount > 0 ? parseFloat((100 - conversionFromPrev).toFixed(1)) : 0;

      return {
        step_name: name,
        users_count: count,
        conversion_from_previous_pct: conversionFromPrev,
        overall_conversion_pct: overallConversion,
        dropoff_rate_pct: dropoffRate
      };
    };

    const dailyRitualFunnel = [
      buildStep('1. Session Start', count1, count1, count1),
      buildStep('2. Task / Framework Input', count2, count1, count1),
      buildStep('3. Habit Tracking', count3, count2, count1),
      buildStep('4. Evening Reflection', count4, count3, count1),
      buildStep('5. Day Closure Ritual', count5, count4, count1)
    ];

    // Monetization Funnel
    const paywallViews = db.prepare(`SELECT COUNT(DISTINCT anonymous_id) as count FROM events WHERE event = 'patron_modal_viewed'`).get()?.count || 0;
    const checkoutClicks = db.prepare(`SELECT COUNT(DISTINCT anonymous_id) as count FROM events WHERE event = 'checkout_initiated'`).get()?.count || 0;
    const activations = db.prepare(`SELECT COUNT(DISTINCT anonymous_id) as count FROM events WHERE event = 'license_activated'`).get()?.count || 0;

    return {
      daily_ritual_funnel: dailyRitualFunnel,
      monetization_funnel: {
        paywall_impressions: paywallViews,
        checkout_initiated: checkoutClicks,
        license_activated: activations,
        checkout_conversion_pct: paywallViews > 0 ? parseFloat(((checkoutClicks / paywallViews) * 100).toFixed(1)) : 0,
        paid_conversion_pct: paywallViews > 0 ? parseFloat(((activations / paywallViews) * 100).toFixed(1)) : 0
      }
    };
  },

  /**
   * UX Friction & Drop-Off Gaps
   */
  getDropoffsAndGaps() {
    // Rage clicks
    const rageClicks = db.prepare(`
      SELECT details, created_at FROM friction_logs WHERE friction_type = 'rage_click' ORDER BY created_at DESC LIMIT 20
    `).all().map(r => {
      try {
        return { ...JSON.parse(r.details), timestamp: r.created_at };
      } catch (e) {
        return { raw: r.details, timestamp: r.created_at };
      }
    });

    // Abandoned modals
    const abandonedModals = db.prepare(`
      SELECT details, created_at FROM friction_logs WHERE friction_type = 'abandoned_modal' ORDER BY created_at DESC LIMIT 20
    `).all().map(r => {
      try {
        return { ...JSON.parse(r.details), timestamp: r.created_at };
      } catch (e) {
        return { raw: r.details, timestamp: r.created_at };
      }
    });

    // Client errors
    const clientErrors = db.prepare(`
      SELECT details, created_at FROM friction_logs WHERE friction_type = 'client_error' ORDER BY created_at DESC LIMIT 20
    `).all().map(r => {
      try {
        return { ...JSON.parse(r.details), timestamp: r.created_at };
      } catch (e) {
        return { raw: r.details, timestamp: r.created_at };
      }
    });

    // Exit views
    const exitViews = db.prepare(`
      SELECT final_view as view, COUNT(*) as count 
      FROM sessions 
      WHERE final_view IS NOT NULL 
      GROUP BY final_view 
      ORDER BY count DESC 
      LIMIT 5
    `).all();

    return {
      total_rage_clicks: rageClicks.length,
      rage_clicks: rageClicks,
      total_abandoned_modals: abandonedModals.length,
      abandoned_modals: abandonedModals,
      total_client_errors: clientErrors.length,
      client_errors: clientErrors,
      top_exit_views: exitViews
    };
  },

  /**
   * Cohort Retention
   */
  getRetention() {
    const cohorts = db.prepare(`
      SELECT first_seen_date, COUNT(*) as cohort_size
      FROM user_cohorts
      GROUP BY first_seen_date
      ORDER BY first_seen_date DESC
      LIMIT 14
    `).all();

    const retentionMatrix = cohorts.map(c => {
      const { first_seen_date, cohort_size } = c;

      // Check retention at Day 1, 3, 7
      const checkDays = [1, 3, 7];
      const retentionData = { first_seen_date, cohort_size, days: {} };

      for (const d of checkDays) {
        const targetDate = new Date(new Date(first_seen_date).getTime() + d * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
        const retainedCount = db.prepare(`
          SELECT COUNT(DISTINCT anonymous_id) as count 
          FROM events 
          WHERE anonymous_id IN (SELECT anonymous_id FROM user_cohorts WHERE first_seen_date = ?)
          AND timestamp LIKE ?
        `).get(first_seen_date, `${targetDate}%`)?.count || 0;

        retentionData.days[`day_${d}`] = cohort_size > 0 
          ? parseFloat(((retainedCount / cohort_size) * 100).toFixed(1)) 
          : 0;
      }
      return retentionData;
    });

    return { cohorts: retentionMatrix };
  },

  /**
   * Real-time live event stream
   */
  getLiveEvents(limit = 50) {
    const events = db.prepare(`
      SELECT event_id, session_id, anonymous_id, event, properties, timestamp
      FROM events
      ORDER BY id DESC
      LIMIT ?
    `).all(limit);

    return events.map(e => {
      try {
        return { ...e, properties: JSON.parse(e.properties) };
      } catch (err) {
        return e;
      }
    });
  },

  /**
   * Pathfinder Drop-Off & Surface Transition Engine
   */
  getPathfinderJourneys() {
    const transitions = db.prepare(`
      SELECT from_surface, to_surface, COUNT(*) as count
      FROM pathfinder_transitions
      GROUP BY from_surface, to_surface
      ORDER BY count DESC
      LIMIT 15
    `).all();

    const graph = {};
    for (const t of transitions) {
      if (!graph[t.from_surface]) graph[t.from_surface] = [];
      graph[t.from_surface].push({ to: t.to_surface, count: t.count });
    }
    return { top_transitions: transitions, transition_graph: graph };
  },

  /**
   * Circadian Morning vs Evening Dual-Visit Return Loop
   */
  getCircadianMetrics() {
    const sessions = db.prepare(`
      SELECT anonymous_id, start_time FROM sessions
    `).all();

    let morningCount = 0; // 05:00 - 11:59
    let middayCount = 0;  // 12:00 - 17:59
    let eveningCount = 0; // 18:00 - 04:59
    const userDays = {};

    for (const s of sessions) {
      const dateObj = new Date(s.start_time);
      const hour = dateObj.getUTCHours();
      const dayStr = s.start_time.slice(0, 10);
      const key = `${s.anonymous_id}_${dayStr}`;
      if (!userDays[key]) userDays[key] = { morning: false, evening: false };

      if (hour >= 5 && hour < 12) {
        morningCount++;
        userDays[key].morning = true;
      } else if (hour >= 12 && hour < 18) {
        middayCount++;
      } else {
        eveningCount++;
        userDays[key].evening = true;
      }
    }

    const totalActiveUserDays = Object.keys(userDays).length;
    const dualVisitDays = Object.values(userDays).filter(d => d.morning && d.evening).length;
    const circadianDualRate = totalActiveUserDays > 0 
      ? parseFloat(((dualVisitDays / totalActiveUserDays) * 100).toFixed(1)) 
      : 0;

    return {
      morning_sessions: morningCount,
      midday_sessions: middayCount,
      evening_sessions: eveningCount,
      total_user_days: totalActiveUserDays,
      dual_visit_user_days: dualVisitDays,
      circadian_dual_rate_pct: circadianDualRate
    };
  },

  /**
   * Task Debt & Rollover Fatigue Metrics
   */
  getTaskDebtMetrics() {
    const triageBreakdown = db.prepare(`
      SELECT triage_action, COUNT(*) as count, AVG(task_age_days) as avg_age_days
      FROM task_debt_logs
      GROUP BY triage_action
    `).all();

    const totalTriaged = triageBreakdown.reduce((acc, r) => acc + r.count, 0);
    const stats = {};
    triageBreakdown.forEach(r => {
      stats[r.triage_action] = {
        count: r.count,
        percentage: totalTriaged > 0 ? parseFloat(((r.count / totalTriaged) * 100).toFixed(1)) : 0,
        avg_age_days: parseFloat((r.avg_age_days || 1).toFixed(1))
      };
    });

    const avgAgeRow = db.prepare(`SELECT AVG(task_age_days) as overall_avg FROM task_debt_logs`).get();
    const overallAvgAge = parseFloat((avgAgeRow?.overall_avg || 1.5).toFixed(1));

    return {
      total_triaged: totalTriaged,
      average_task_age_days: overallAvgAge,
      triage_distribution: stats,
      task_debt_status: overallAvgAge > 3 ? 'high_debt' : overallAvgAge > 1.8 ? 'moderate_debt' : 'optimal'
    };
  },

  /**
   * Cognitive Hesitation & First Keypress Latency (FKL)
   */
  getCognitiveHesitationMetrics() {
    const hesitationRows = db.prepare(`
      SELECT surface, AVG(first_keypress_latency_ms) as avg_fkl, COUNT(*) as sample_count, SUM(was_abandoned) as abandoned_count
      FROM cognitive_hesitations
      GROUP BY surface
    `).all();

    const results = {};
    let totalSamples = 0;
    let totalLatency = 0;

    hesitationRows.forEach(r => {
      const avgFkl = Math.round(r.avg_fkl || 0);
      const abandonedRate = r.sample_count > 0 ? parseFloat(((r.abandoned_count / r.sample_count) * 100).toFixed(1)) : 0;
      results[r.surface] = {
        avg_fkl_ms: avgFkl,
        sample_count: r.sample_count,
        abandonment_rate_pct: abandonedRate
      };
      totalSamples += r.sample_count;
      totalLatency += avgFkl * r.sample_count;
    });

    const overallAvgFkl = totalSamples > 0 ? Math.round(totalLatency / totalSamples) : 0;

    return {
      overall_avg_fkl_ms: overallAvgFkl,
      by_surface: results
    };
  },

  /**
   * Statistical Anomaly Detection Engine (Z-Score)
   */
  getAnomalies() {
    const dailyCounts = db.prepare(`
      SELECT SUBSTR(start_time, 1, 10) as day, COUNT(*) as count
      FROM sessions
      GROUP BY day
      ORDER BY day DESC
      LIMIT 7
    `).all();

    const alerts = [];
    if (dailyCounts.length >= 3) {
      const counts = dailyCounts.map(d => d.count);
      const mean = counts.reduce((a, b) => a + b, 0) / counts.length;
      const variance = counts.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / counts.length;
      const stdDev = Math.sqrt(variance) || 1;
      const latest = counts[0];
      const zScore = parseFloat(((latest - mean) / stdDev).toFixed(2));

      if (Math.abs(zScore) >= 2.0) {
        alerts.push({
          metric: 'daily_active_sessions',
          z_score: zScore,
          current_value: latest,
          baseline_mean: Math.round(mean),
          severity: Math.abs(zScore) >= 3.0 ? 'CRITICAL' : 'WARNING',
          message: zScore < 0 
            ? `Abnormal drop in active sessions (Z-Score: ${zScore})` 
            : `Sudden surge in active sessions (Z-Score: ${zScore})`
        });
      }
    }

    const rageRow = db.prepare(`
      SELECT COUNT(*) as count FROM friction_logs WHERE friction_type = 'rage_click' AND created_at >= datetime('now', '-1 day')
    `).get();
    if ((rageRow?.count || 0) > 10) {
      alerts.push({
        metric: 'rage_clicks_24h',
        current_value: rageRow.count,
        severity: 'WARNING',
        message: `Elevated rage clicks detected in last 24h (${rageRow.count} occurrences)`
      });
    }

    return {
      active_alerts_count: alerts.length,
      alerts: alerts
    };
  },

  /**
   * Experimentation & A/B Conversion Engine
   */
  getExperimentResults() {
    const experiments = db.prepare(`
      SELECT experiment_id, variant, COUNT(*) as impressions, SUM(converted) as conversions
      FROM experiment_impressions
      GROUP BY experiment_id, variant
    `).all();

    const grouped = {};
    for (const exp of experiments) {
      if (!grouped[exp.experiment_id]) grouped[exp.experiment_id] = {};
      const rate = exp.impressions > 0 ? parseFloat(((exp.conversions / exp.impressions) * 100).toFixed(1)) : 0;
      grouped[exp.experiment_id][exp.variant] = {
        impressions: exp.impressions,
        conversions: exp.conversions,
        conversion_rate_pct: rate
      };
    }
    return { experiments: grouped };
  }
};
