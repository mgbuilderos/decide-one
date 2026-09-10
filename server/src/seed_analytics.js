import { db } from './db.js';
import { TelemetryService } from './telemetryService.js';
import crypto from 'node:crypto';

console.log('🌱 Seeding realistic behavioral telemetry data (Telemetry 2.0)...');

// Clear existing tables
db.exec(`
  DELETE FROM events;
  DELETE FROM sessions;
  DELETE FROM user_cohorts;
  DELETE FROM friction_logs;
  DELETE FROM pathfinder_transitions;
  DELETE FROM task_debt_logs;
  DELETE FROM cognitive_hesitations;
  DELETE FROM experiments;
  DELETE FROM experiment_impressions;
`);

// Setup initial experiment
db.prepare(`
  INSERT INTO experiments (experiment_id, name, variants, is_active)
  VALUES (?, ?, ?, 1)
`).run('exp_evening_prompt', 'Evening Reflection Prompt Wording', JSON.stringify(['stoic_gratitude', 'tactical_review']));

const FRAMEWORKS = [
  'rule_of_3',
  'ivy_lee',
  'one_three_five',
  'eisenhower',
  'moscow',
  'abcde',
  'pareto',
  'focus_triage'
];

const DEVICES = ['desktop_mac', 'desktop_win', 'mobile_ios', 'mobile_android'];
const VIEWS = ['daily', 'monthly', 'weekly', 'yearly', 'cover'];
const SURFACES = ['daily_spread', 'top3_slot_1', 'top3_slot_2', 'rapid_log_input', 'habit_checklist', 'evening_reflection', 'unified_menu', 'volume_switcher', 'privacy_shutter'];

const now = Date.now();
const DAY_MS = 24 * 60 * 60 * 1000;
const NUM_USERS = 50;

for (let u = 0; u < NUM_USERS; u++) {
  const anonymousId = `usr_${crypto.randomUUID().slice(0, 8)}`;
  const daysActive = 1 + Math.floor(Math.random() * 10);
  const firstSeenOffset = Math.floor(Math.random() * 14);
  const isPatron = Math.random() < 0.25;

  for (let d = 0; d < daysActive; d++) {
    const dayOffset = Math.max(0, firstSeenOffset - d);
    const baseDayTimestamp = now - dayOffset * DAY_MS;

    // Morning Session (08:00 UTC)
    const morningTimestamp = new Date(baseDayTimestamp + (8 * 3600 + Math.floor(Math.random() * 3600)) * 1000).toISOString();
    const morningSessionId = `sess_m_${crypto.randomUUID().slice(0, 8)}`;
    const device = DEVICES[Math.floor(Math.random() * DEVICES.length)];
    const chosenFramework = FRAMEWORKS[Math.floor(Math.random() * FRAMEWORKS.length)];

    const morningEvents = [];

    // 1. Morning Session Start
    morningEvents.push({
      event_id: crypto.randomUUID(),
      session_id: morningSessionId,
      anonymous_id: anonymousId,
      event: 'session_start',
      properties: { device_type: device, view_mode: 'daily', is_patron: isPatron, paper_style: 'dots' },
      timestamp: morningTimestamp
    });

    // Morning Planning (Step 2)
    const completesStep2 = Math.random() < 0.85;
    if (completesStep2) {
      morningEvents.push({
        event_id: crypto.randomUUID(),
        session_id: morningSessionId,
        anonymous_id: anonymousId,
        event: 'framework_selected',
        properties: { framework_id: chosenFramework },
        timestamp: new Date(new Date(morningTimestamp).getTime() + 45000).toISOString()
      });

      // Cognitive Hesitation on slot 1
      const fkl = 800 + Math.floor(Math.random() * 4200);
      const isAbandoned = Math.random() < 0.12;
      morningEvents.push({
        event_id: crypto.randomUUID(),
        session_id: morningSessionId,
        anonymous_id: anonymousId,
        event: 'cognitive_hesitation',
        properties: { surface: 'top3_slot_1', first_keypress_latency_ms: fkl, was_abandoned: isAbandoned },
        timestamp: new Date(new Date(morningTimestamp).getTime() + 60000).toISOString()
      });

      if (!isAbandoned) {
        morningEvents.push({
          event_id: crypto.randomUUID(),
          session_id: morningSessionId,
          anonymous_id: anonymousId,
          event: 'framework_task_added',
          properties: { framework_id: chosenFramework, slot_index: 0 },
          timestamp: new Date(new Date(morningTimestamp).getTime() + 90000).toISOString()
        });
      }

      // Pathfinder transitions
      morningEvents.push({
        event_id: crypto.randomUUID(),
        session_id: morningSessionId,
        anonymous_id: anonymousId,
        event: 'surface_transition',
        properties: { from_surface: 'daily_spread', to_surface: 'top3_slot_1', exit_type: 'normal' },
        timestamp: new Date(new Date(morningTimestamp).getTime() + 50000).toISOString()
      });

      morningEvents.push({
        event_id: crypto.randomUUID(),
        session_id: morningSessionId,
        anonymous_id: anonymousId,
        event: 'surface_transition',
        properties: { from_surface: 'top3_slot_1', to_surface: 'rapid_log_input', exit_type: 'normal' },
        timestamp: new Date(new Date(morningTimestamp).getTime() + 110000).toISOString()
      });

      // Habit execution
      if (Math.random() < 0.70) {
        morningEvents.push({
          event_id: crypto.randomUUID(),
          session_id: morningSessionId,
          anonymous_id: anonymousId,
          event: 'habit_toggled',
          properties: { habit_id: 'habit_0', streak_count: 5 },
          timestamp: new Date(new Date(morningTimestamp).getTime() + 150000).toISOString()
        });
      }
    } else {
      // User dropped off in morning: record breadcrumb exit trail
      morningEvents.push({
        event_id: crypto.randomUUID(),
        session_id: morningSessionId,
        anonymous_id: anonymousId,
        event: 'exit_breadcrumbs',
        properties: { trail: ['session_start', 'view_changed', 'unified_menu', 'volume_switcher'] },
        timestamp: morningTimestamp
      });
    }

    TelemetryService.ingestBatch(morningEvents);
    TelemetryService.recordHeartbeat({
      session_id: morningSessionId,
      anonymous_id: anonymousId,
      active_seconds: 180 + Math.floor(Math.random() * 400),
      idle_seconds: 30,
      current_view: 'daily'
    });

    // Evening Session (45% of users complete the circadian loop)
    const hasEveningLoop = Math.random() < 0.45;
    if (hasEveningLoop) {
      const eveningTimestamp = new Date(baseDayTimestamp + (20 * 3600 + Math.floor(Math.random() * 7200)) * 1000).toISOString();
      const eveningSessionId = `sess_e_${crypto.randomUUID().slice(0, 8)}`;
      const eveningEvents = [];

      eveningEvents.push({
        event_id: crypto.randomUUID(),
        session_id: eveningSessionId,
        anonymous_id: anonymousId,
        event: 'session_start',
        properties: { device_type: device, view_mode: 'daily', is_patron: isPatron, paper_style: 'dots' },
        timestamp: eveningTimestamp
      });

      // A/B Experiment variant exposure
      const variant = Math.random() < 0.5 ? 'stoic_gratitude' : 'tactical_review';
      eveningEvents.push({
        event_id: crypto.randomUUID(),
        session_id: eveningSessionId,
        anonymous_id: anonymousId,
        event: 'experiment_impression',
        properties: { experiment_id: 'exp_evening_prompt', variant },
        timestamp: eveningTimestamp
      });

      // Evening reflection
      eveningEvents.push({
        event_id: crypto.randomUUID(),
        session_id: eveningSessionId,
        anonymous_id: anonymousId,
        event: 'reflection_saved',
        properties: { word_count: 38, has_gratitude: true },
        timestamp: new Date(new Date(eveningTimestamp).getTime() + 120000).toISOString()
      });

      // Task debt triage in closure modal
      const triageActions = ['migrated', 'delegated', 'dropped'];
      const action = triageActions[Math.floor(Math.random() * triageActions.length)];
      const taskAge = 1 + Math.floor(Math.random() * 4);
      eveningEvents.push({
        event_id: crypto.randomUUID(),
        session_id: eveningSessionId,
        anonymous_id: anonymousId,
        event: 'task_triage',
        properties: { triage_action: action, task_age_days: taskAge },
        timestamp: new Date(new Date(eveningTimestamp).getTime() + 180000).toISOString()
      });

      // Day closed
      eveningEvents.push({
        event_id: crypto.randomUUID(),
        session_id: eveningSessionId,
        anonymous_id: anonymousId,
        event: 'day_closed',
        properties: { final_score: 90 },
        timestamp: new Date(new Date(eveningTimestamp).getTime() + 210000).toISOString()
      });

      TelemetryService.ingestBatch(eveningEvents);
      TelemetryService.recordHeartbeat({
        session_id: eveningSessionId,
        anonymous_id: anonymousId,
        active_seconds: 240 + Math.floor(Math.random() * 300),
        idle_seconds: 20,
        current_view: 'daily'
      });
    }
  }
}

console.log('✅ Telemetry 2.0 database successfully seeded with realistic multi-session behavioral data!');
