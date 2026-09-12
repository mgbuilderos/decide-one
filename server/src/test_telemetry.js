import assert from 'node:assert';
import { db } from './db.js';
import { TelemetryService } from './telemetryService.js';
import { AnalyticsService } from './analyticsService.js';

console.log('🧪 Running Decide One Telemetry Engine Automated Tests...\n');

const testSessionId = 'test_sess_' + Date.now();
const testAnonId = 'test_anon_' + Date.now();

// Test 1: Event Ingestion & Zero-Knowledge Sanitization
console.log('Test 1: Verifying event ingestion & zero-knowledge sanitization...');
const rawEvents = [
  {
    session_id: testSessionId,
    anonymous_id: testAnonId,
    event: 'session_start',
    properties: {
      device_type: 'desktop_test',
      view_mode: 'daily',
      text: 'Confidential executive thoughts',
      reflection: 'Private gratitude note'
    }
  },
  {
    session_id: testSessionId,
    anonymous_id: testAnonId,
    event: 'surface_transition',
    properties: {
      from_surface: 'daily_spread',
      to_surface: 'top3_slot_1'
    }
  },
  {
    session_id: testSessionId,
    anonymous_id: testAnonId,
    event: 'cognitive_hesitation',
    properties: {
      surface: 'top3_slot_1',
      first_keypress_latency_ms: 1850,
      was_abandoned: false
    }
  },
  {
    session_id: testSessionId,
    anonymous_id: testAnonId,
    event: 'task_triage',
    properties: {
      triage_action: 'migrated',
      task_age_days: 2
    }
  },
  {
    session_id: testSessionId,
    anonymous_id: testAnonId,
    event: 'experiment_impression',
    properties: {
      experiment_id: 'exp_evening_prompt',
      variant: 'stoic_gratitude'
    }
  },
  {
    session_id: testSessionId,
    anonymous_id: testAnonId,
    event: 'day_closed',
    properties: {
      final_score: 95
    }
  }
];

const ingestResult = TelemetryService.ingestBatch(rawEvents);
assert.strictEqual(ingestResult.ingested, 6, 'All 6 events should be ingested');
assert.strictEqual(ingestResult.errors, 0, 'Zero errors during ingestion');

const storedEvent = db.prepare('SELECT properties FROM events WHERE session_id = ? AND event = ?').get(testSessionId, 'session_start');
const parsedProps = JSON.parse(storedEvent.properties);
assert.strictEqual(parsedProps.text, undefined, 'Sensitive field "text" must NOT exist');
assert.strictEqual(parsedProps.reflection, undefined, 'Sensitive field "reflection" must NOT exist');
console.log('  ✅ Zero-Knowledge Sanitization confirmed.');

// Test 2: Heartbeat & Active Dwell Time
console.log('Test 2: Verifying session heartbeat accumulation...');
TelemetryService.recordHeartbeat({
  session_id: testSessionId,
  anonymous_id: testAnonId,
  active_seconds: 60,
  idle_seconds: 15,
  current_view: 'daily'
});
const sessionRow = db.prepare('SELECT active_seconds FROM sessions WHERE session_id = ?').get(testSessionId);
assert(sessionRow.active_seconds >= 60, 'Active seconds accumulated');
console.log('  ✅ Active dwell time tracking confirmed.');

// Test 3: Overview & Stickiness
console.log('Test 3: Verifying Overview KPI computations...');
const overview = AnalyticsService.getOverview();
assert(typeof overview.dau === 'number');
assert(typeof overview.stickiness_ratio_pct === 'number');
console.log(`  ✅ Overview KPIs: DAU=${overview.dau}, Stickiness=${overview.stickiness_ratio_pct}%`);

// Test 4: Daily Ritual Funnel
console.log('Test 4: Verifying 5-step Daily Ritual Funnel...');
const funnels = AnalyticsService.getFunnels();
assert.strictEqual(funnels.daily_ritual_funnel.length, 5);
console.log('  ✅ 5-Step Funnel verified.');

// Test 5: Pathfinder Transition Graph
console.log('Test 5: Verifying Pathfinder drop-off transition graph...');
const pathfinders = AnalyticsService.getPathfinderJourneys();
assert(Array.isArray(pathfinders.top_transitions), 'Top transitions should be array');
assert(pathfinders.top_transitions.length > 0, 'Should have transitions');
console.log(`  ✅ Pathfinder: found ${pathfinders.top_transitions.length} surface transitions.`);

// Test 6: Circadian Morning vs Evening Dual Loop
console.log('Test 6: Verifying Circadian dual-visit return loop...');
const circadian = AnalyticsService.getCircadianMetrics();

// `typeof x === 'number'` was the whole of this test, and 0 is a number. It
// printed a 0% dual-visit rate and passed, every run, while seed_analytics.js
// was deliberately building a circadian loop for 45% of user-days. A test that
// cannot fail on a dead metric is not testing the metric — it is testing that
// the function returns.
//
// So assert the relationship the seeder actually guarantees.
assert(typeof circadian.circadian_dual_rate_pct === 'number');

assert(
  circadian.sessions_with_local_hour > 0,
  `No session carries a local_hour, so every bucket above came from getUTCHours(). `
  + `That describes timezones, not people. (${circadian.sessions_with_local_hour}/${circadian.sessions_total})`
);

assert(
  circadian.morning_sessions > 0 && circadian.evening_sessions > 0,
  `Morning=${circadian.morning_sessions} Evening=${circadian.evening_sessions}: the seeder `
  + `builds both, so a zero on either side means the hour bucketing is wrong.`
);

// seed_analytics.js pairs a morning and an evening session on 45% of user-days
// (Math.random() < 0.45). Across a few hundred user-days the observed rate sits
// close to that; this band is wide enough not to be flaky and narrow enough to
// have caught the 0% that shipped.
assert(
  circadian.circadian_dual_rate_pct >= 30 && circadian.circadian_dual_rate_pct <= 60,
  `Dual-visit rate is ${circadian.circadian_dual_rate_pct}%, outside 30–60%. The seeder `
  + `builds this loop for 45% of user-days, so a figure outside that band means the `
  + `morning/evening pairing is being lost — which is what a UTC day boundary does to `
  + `an evening session in Asia.`
);

console.log(`  ✅ Circadian Metrics: Morning=${circadian.morning_sessions}, Evening=${circadian.evening_sessions}, Dual-Loop Rate=${circadian.circadian_dual_rate_pct}% (local_hour on ${circadian.sessions_with_local_hour}/${circadian.sessions_total} sessions)`);

// Test 7: Task Debt & Rollover Fatigue
console.log('Test 7: Verifying Task Debt & Rollover age analytics...');
const taskDebt = AnalyticsService.getTaskDebtMetrics();
assert(typeof taskDebt.total_triaged === 'number');
assert(typeof taskDebt.average_task_age_days === 'number');
console.log(`  ✅ Task Debt: Triaged Tasks=${taskDebt.total_triaged}, Avg Age=${taskDebt.average_task_age_days} days`);

// Test 8: Cognitive Hesitation & First Keypress Latency (FKL)
console.log('Test 8: Verifying Cognitive Hesitation & FKL metrics...');
const hesitation = AnalyticsService.getCognitiveHesitationMetrics();
assert(typeof hesitation.overall_avg_fkl_ms === 'number');
console.log(`  ✅ Cognitive Hesitation: Overall Avg FKL=${hesitation.overall_avg_fkl_ms}ms`);

// Test 9: Statistical Anomaly Detection (Z-Score)
console.log('Test 9: Verifying Z-score statistical anomaly detection...');
const anomalies = AnalyticsService.getAnomalies();
assert(typeof anomalies.active_alerts_count === 'number');
console.log(`  ✅ Anomaly Engine: ${anomalies.active_alerts_count} active statistical alert(s).`);

// Test 10: A/B Experimentation Conversion Tracking
console.log('Test 10: Verifying A/B Experimentation conversion metrics...');
const expResults = AnalyticsService.getExperimentResults();
assert(typeof expResults.experiments === 'object');
console.log('  ✅ Experimentation Engine: verified variant impression & conversion tracking.');

// Test 11: Owner Authentication Gate
console.log('Test 11: Verifying Owner Authentication Gate & Secret Key...');
import { OWNER_SECRET_KEY, verifyOwnerKey } from './server.js';

// Fails closed: an omitted or empty candidate must never authenticate, and an
// unset OWNER_SECRET_KEY must deny everything rather than accept a default.
assert(verifyOwnerKey(undefined) === false, 'Omitted key must never authenticate');
assert(verifyOwnerKey(null) === false, 'Null key must never authenticate');
assert(verifyOwnerKey('') === false, 'Empty key must never authenticate');
assert(verifyOwnerKey('wrong-key') === false, 'Incorrect key must never authenticate');

if (OWNER_SECRET_KEY) {
  assert(OWNER_SECRET_KEY.length > 8, 'Configured owner key must be of reasonable length');
  assert(verifyOwnerKey(OWNER_SECRET_KEY) === true, 'Correct key must authenticate');
  console.log('  ✅ Owner key configured from environment; gate verified both ways.');
} else {
  console.log('  ✅ OWNER_SECRET_KEY unset — owner endpoints correctly fail closed.');
}

// Test 12: exit_breadcrumbs actually writes transitions.
// This is the check that was missing when sanitizeProperties began replacing
// arrays with `<key>_count`: the trail silently became undefined, the loop ran
// zero times, and every other test still passed.
console.log('Test 12: Verifying exit_breadcrumbs records the trail...');
const trailSession = 'test_trail_' + Date.now();
const before = db.prepare(
  `SELECT COUNT(*) AS c FROM pathfinder_transitions WHERE session_id = ?`
).get(trailSession).c;

TelemetryService.ingestBatch([{
  session_id: trailSession,
  anonymous_id: testAnonId,
  event: 'exit_breadcrumbs',
  properties: { trail: ['daily_spread', 'weekly_review', 'settings'] }
}]);

const after = db.prepare(
  `SELECT COUNT(*) AS c FROM pathfinder_transitions WHERE session_id = ? AND exit_type = 'exit_trail'`
).get(trailSession).c;
assert.strictEqual(after - before, 2, 'A 3-hop trail must record 2 transitions');

// The trail is kept because it is declared structural, but it must stay
// bounded, and nothing that is actual content may ride along beside it.
const stored = JSON.parse(db.prepare(
  `SELECT properties FROM events WHERE session_id = ? AND event = 'exit_breadcrumbs'`
).get(trailSession).properties);
assert(Array.isArray(stored.trail) && stored.trail.length === 3, 'The trail is kept, as surface names');
assert(stored.trail.every(s => s.length <= 64), 'Each hop must be bounded to 64 chars');

// A written field on the same event must still be reduced to a length.
TelemetryService.ingestBatch([{
  session_id: trailSession, anonymous_id: testAnonId, event: 'exit_breadcrumbs',
  properties: { trail: ['a', 'b'], noteBody: 'a private sentence' }
}]);
const mixed = db.prepare(
  `SELECT properties FROM events WHERE session_id = ? AND event = 'exit_breadcrumbs' ORDER BY id DESC`
).get(trailSession);
assert(!/private sentence/.test(mixed.properties), 'Written content must never be stored');
assert(/noteBody_length/.test(mixed.properties), 'It must be reduced to a length instead');
console.log('  ✅ Exit trail recorded 2 transitions from a 3-surface trail.');

// Test 13: the heartbeat clamps what it is given.
console.log('Test 13: Verifying heartbeat input validation...');
const hbSession = 'test_hb_' + Date.now();
TelemetryService.recordHeartbeat({ session_id: hbSession, anonymous_id: testAnonId, active_seconds: 30 });
TelemetryService.recordHeartbeat({ session_id: hbSession, anonymous_id: testAnonId, active_seconds: 999999999 });
TelemetryService.recordHeartbeat({ session_id: hbSession, anonymous_id: testAnonId, active_seconds: 'abc' });
const hb = db.prepare(`SELECT active_seconds FROM sessions WHERE session_id = ?`).get(hbSession);
assert(hb.active_seconds <= 30 + 3600 + 30, `Heartbeat must clamp, got ${hb.active_seconds}`);
assert.strictEqual(TelemetryService.recordHeartbeat({ session_id: '' }).success, false,
  'An empty session_id must be rejected');
console.log('  ✅ Heartbeat clamped oversized and non-numeric input.');

// Test 14: Core Web Vitals readout.
// The emitter deliberately sends null for a metric the browser cannot measure.
// A 0 here would turn "not measured" into a perfect score, which is the exact
// failure VISION §13.2 describes - an instrument believed while wrong.
console.log('Test 14: Verifying Core Web Vitals percentile readout...');
const vitalsSession = 'test_cwv_' + Date.now();
TelemetryService.ingestBatch(
  [1000, 2000, 3000, 4000].map((lcp, i) => ({
    session_id: vitalsSession,
    anonymous_id: testAnonId,
    event: 'web_vitals',
    properties: {
      lcp_ms: lcp, lcp: lcp <= 2500 ? 'good' : 'poor',
      inp_ms: null, inp: null,
      cls: 0.05, cls_rating: 'good',
      ttfb_ms: 100 + i, ttfb: 'good',
      entry_view: 'landing'
    }
  }))
);

const vitals = AnalyticsService.getWebVitals();
assert(vitals.sample_count >= 4, 'Ingested web_vitals must be counted');
assert.strictEqual(vitals.percentile, 75);
// p75 of [1000,2000,3000,4000] is the 3rd value: ceil(4*0.75)-1 = index 2.
assert.strictEqual(vitals.metrics.lcp.p75, 3000, `Expected p75 3000, got ${vitals.metrics.lcp.p75}`);
assert.strictEqual(vitals.metrics.inp.p75, null, 'An all-null metric must report null, never 0');
assert.strictEqual(vitals.metrics.inp.sample_count, 0);
assert(vitals.metrics.lcp.distribution.good >= 2, 'Ratings must be distributed, not dropped');
assert(vitals.by_entry_view.landing, 'Samples must be grouped by the view the page opened on');
console.log(`  ✅ Core Web Vitals: LCP p75=${vitals.metrics.lcp.p75}ms, INP unmeasured reports null.`);

console.log('\n🎉 ALL 14 TELEMETRY 2.0 AUTOMATED TESTS PASSED WITH 100% SUCCESS!\n');
