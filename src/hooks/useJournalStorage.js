import { useState, useEffect, useCallback } from 'react';
import { encryptVaultData, decryptVaultData, downloadEncryptedVaultFile } from '../utils/cryptoVault';
import { telemetry } from '../utils/telemetry';

const STORAGE_KEY = 'DECIDEONE_STUDIO_V1';
const LEGACY_STORAGE_KEYS = [
  'PRIMACY_STUDIO_V1',
  'POCKETBOOK_STUDIO_V1',
  ['B', 'U', 'J', 'O', '_', 'S', 'T', 'U', 'D', 'I', 'O', '_', 'V', '1'].join('')
];
const ACTIVE_VOLUME_KEY = 'DECIDEONE_ACTIVE_VOLUME_ID';
const LEGACY_ACTIVE_VOLUME_KEYS = ['PRIMACY_ACTIVE_VOLUME_ID', 'POCKETBOOK_ACTIVE_VOLUME_ID'];

export const EXECUTIVE_VOLUMES = [
  {
    id: 'vol_strategy',
    volumeNumber: 'I',
    name: 'Work',
    subtitle: 'Work Priorities',
    tagline: 'Choose what deserves attention at work',
    theme: 'charcoal'
  },
  {
    id: 'vol_personal',
    volumeNumber: 'II',
    name: 'Personal',
    subtitle: 'Personal Priorities',
    tagline: 'Choose what deserves attention outside work',
    theme: 'slate'
  },
  {
    id: 'vol_creative',
    volumeNumber: 'III',
    name: 'Projects',
    subtitle: 'Project Priorities',
    tagline: 'Choose the next move for a focused project',
    theme: 'espresso'
  },
  {
    id: 'vol_reflections',
    volumeNumber: 'IV',
    name: 'Private',
    subtitle: 'Private Priorities',
    tagline: 'Keep sensitive decisions in a separate space',
    theme: 'burgundy'
  }
];

// Format Date YYYY-MM-DD
export function formatDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getVolumeStorageKey(volumeId) {
  if (!volumeId || volumeId === 'vol_strategy') {
    return STORAGE_KEY;
  }
  return `${STORAGE_KEY}_${volumeId}`;
}

function getLegacyVolumeStorageKeys(volumeId) {
  return LEGACY_STORAGE_KEYS.map((key) => (
    !volumeId || volumeId === 'vol_strategy' ? key : `${key}_${volumeId}`
  ));
}

export function getStoredActiveVolume() {
  if (typeof window === 'undefined') return 'vol_strategy';
  try {
    const current = localStorage.getItem(ACTIVE_VOLUME_KEY);
    const legacy = LEGACY_ACTIVE_VOLUME_KEYS.reduce((found, k) => found || localStorage.getItem(k), null);
    const activeVolume = current || legacy || 'vol_strategy';
    if (!current && legacy) localStorage.setItem(ACTIVE_VOLUME_KEY, legacy);
    return activeVolume;
  } catch (e) {
    return 'vol_strategy';
  }
}

// Generate realistic default seed data tailored to each domain
function getVolumeSeedData(volumeId) {
  const todayKey = formatDateKey(new Date());

  if (volumeId === 'vol_personal' || volumeId === 'vol_sanctuary') {
    return {
      habits: [
        { id: 'water', label: '3-4L Pure Water', emoji: '💧' },
        { id: 'steps', label: '10k Outdoor Steps', emoji: '👟' },
        { id: 'breathwork', label: '15m Breathwork', emoji: '🧘' },
        { id: 'reading', label: '30m Philosophy', emoji: '📖' },
        { id: 'unplugged', label: 'Device Sunset 9pm', emoji: '🌙' }
      ],
      dailyLogs: {
        [todayKey]: {
          dateString: todayKey,
          completedHabits: ['water', 'steps', 'breathwork'],
          hardTasks: [
            {
              id: 'h1',
              text: 'Morning silent walk in nature (zero headphones or phone)',
              completed: true,
              category: 'health'
            },
            {
              id: 'h2',
              text: 'Prepare healthy organic Mediterranean dinner with family',
              completed: true,
              category: 'personal'
            },
            {
              id: 'h3',
              text: '45-minute evening sauna & mobility recovery session',
              completed: false,
              category: 'health'
            }
          ],
          rapidLog: [
            {
              id: 'r1',
              type: 'completed',
              text: 'Sunrise light exposure and hydration ritual',
              category: 'health',
              timestamp: '07:15'
            },
            {
              id: 'r2',
              type: 'note',
              text: 'Clarity emerges in physical movement, not rumination.',
              category: 'creative',
              timestamp: '08:45'
            },
            {
              id: 'r3',
              type: 'completed',
              text: 'Read 20 pages of Epictetus Discourses',
              category: 'learning',
              timestamp: '13:00'
            },
            {
              id: 'r4',
              type: 'task',
              text: 'Pick up organic cold-pressed olive oil & herbs',
              category: 'shopping',
              timestamp: '16:30'
            }
          ],
          reflection: 'Quiet days create immense nervous system calm. Energy levels are at their peak.'
        }
      },
      monthlyLogs: {
        '2026-09': {
          monthKey: '2026-09',
          events: {
            '06': 'Mountain day hike with family',
            '13': 'Quarterly wellness check-in',
            '20': 'Silent meditation day',
            '27': 'Autumn equinox celebration'
          },
          masterTasks: [
            { id: 'm1', text: 'Maintain 7-8 hours average sleep for 30 consecutive days', completed: true, category: 'health' },
            { id: 'm2', text: 'Complete 150km monthly walking mileage', completed: false, category: 'health' },
            { id: 'm3', text: 'Weekend forest cabin retreat booking', completed: true, category: 'travel' }
          ]
        }
      },
      weeklyReviews: {},
      settings: {
        font: 'sans',
        paperStyle: 'plain',
        penColor: '#18181B',
        isMuted: false,
        darkMode: false,
        viewMode: 'stream'
      }
    };
  }

  if (volumeId === 'vol_creative') {
    return {
      habits: [
        { id: 'writing', label: '90m Deep Writing', emoji: '✍️' },
        { id: 'sketching', label: 'System Sketching', emoji: '📐' },
        { id: 'reading', label: '30m Paper Reading', emoji: '📚' },
        { id: 'walk', label: 'Solitary Walk', emoji: '🌲' },
        { id: 'flow', label: 'Zero Distraction Block', emoji: '⚡' }
      ],
      dailyLogs: {
        [todayKey]: {
          dateString: todayKey,
          completedHabits: ['writing', 'sketching'],
          hardTasks: [
            {
              id: 'h1',
              text: 'Author Chapter 4 of Swiss Minimalist Architecture RFC',
              completed: true,
              category: 'creative'
            },
            {
              id: 'h2',
              text: 'Benchmark Radix Trie inverted index lookup latency',
              completed: true,
              category: 'professional'
            },
            {
              id: 'h3',
              text: 'Illustrate tactile notebook spine ergonomics & vector SVG shadows',
              completed: false,
              category: 'creative'
            }
          ],
          rapidLog: [
            {
              id: 'r1',
              type: 'completed',
              text: 'Review Josef Müller-Brockmann typographic grid theory',
              category: 'learning',
              timestamp: '09:00'
            },
            {
              id: 'r2',
              type: 'note',
              text: 'Insight: True elegance is removing until nothing further can be subtracted.',
              category: 'creative',
              timestamp: '11:15'
            },
            {
              id: 'r3',
              type: 'completed',
              text: 'Measure binary bundle weight: under 300kB gzip target met',
              category: 'professional',
              timestamp: '15:20'
            }
          ],
          reflection: 'Deep craftsmanship brings deep satisfaction. The 24px grid system makes the whole screen feel grounded.'
        }
      },
      monthlyLogs: {
        '2026-09': {
          monthKey: '2026-09',
          events: {
            '04': 'Draft Architecture Monograph',
            '18': 'Typography Guild peer critique',
            '25': 'Open-source release of client crypto core'
          },
          masterTasks: [
            { id: 'm1', text: 'Publish 3 long-form technical architectural essays', completed: false, category: 'creative' },
            { id: 'm2', text: 'Finalize vector typesetting engine specifications', completed: true, category: 'professional' }
          ]
        }
      },
      weeklyReviews: {},
      settings: {
        font: 'sans',
        paperStyle: 'square',
        penColor: '#18181B',
        isMuted: false,
        darkMode: false,
        viewMode: 'stream'
      }
    };
  }

  if (volumeId === 'vol_reflections') {
    return {
      habits: [
        { id: 'stoic', label: 'Morning Stoic Audit', emoji: '🏛️' },
        { id: 'journal', label: 'Evening Closure Log', emoji: '🖋️' },
        { id: 'gratitude', label: '3 Daily Gratitudes', emoji: '🙏' },
        { id: 'stillness', label: '20m Silent Contemplation', emoji: '🕯️' },
        { id: 'sunset', label: 'Mental Disconnect 9pm', emoji: '🌌' }
      ],
      dailyLogs: {
        [todayKey]: {
          dateString: todayKey,
          completedHabits: ['stoic', 'gratitude'],
          hardTasks: [
            {
              id: 'h1',
              text: 'Document quarterly executive retrospective and high-stakes learnings',
              completed: true,
              category: 'personal'
            },
            {
              id: 'h2',
              text: 'Perform energy audit: eliminate 3 recurring meetings with zero leverage',
              completed: true,
              category: 'professional'
            },
            {
              id: 'h3',
              text: 'Write personal letter of appreciation to key engineering lead',
              completed: false,
              category: 'personal'
            }
          ],
          rapidLog: [
            {
              id: 'r1',
              type: 'note',
              text: 'Audit: Energy follows focused intention. Fragmentation causes fatigue.',
              category: 'learning',
              timestamp: '08:30'
            },
            {
              id: 'r2',
              type: 'completed',
              text: 'Canceled 2 weekly recurring meetings to protect 4h morning focus blocks',
              category: 'professional',
              timestamp: '10:00'
            },
            {
              id: 'r3',
              type: 'note',
              text: 'Marcus Aurelius: You have power over your mind - not outside events.',
              category: 'learning',
              timestamp: '14:45'
            }
          ],
          reflection: 'Mental peace is the ultimate luxury. Ending the day with clear closure frees the subconscious for sound sleep.'
        }
      },
      monthlyLogs: {
        '2026-09': {
          monthKey: '2026-09',
          events: {
            '01': 'Quarterly Life Alignment Audit',
            '15': 'Mid-Year Horizon Review',
            '30': 'Annual Strategic Direction Check'
          },
          masterTasks: [
            { id: 'm1', text: 'Document 5 high-stakes strategic decision memos with falsifiable outcomes', completed: true, category: 'professional' },
            { id: 'm2', text: 'Read 2 classic works of moral philosophy', completed: false, category: 'learning' }
          ]
        }
      },
      weeklyReviews: {},
      settings: {
        font: 'sans',
        paperStyle: 'dots',
        penColor: '#18181B',
        isMuted: false,
        darkMode: false,
        viewMode: 'stream'
      }
    };
  }

  // Default: Volume I (Executive Strategy)
  return {
    habits: [
      { id: 'water', label: '3-4L Water', emoji: '💧' },
      { id: 'steps', label: '10k Steps', emoji: '👟' },
      { id: 'meditation', label: '10m Mindfulness', emoji: '🧘' },
      { id: 'reading', label: '20m Reading', emoji: '📖' },
      { id: 'sleep', label: '7-8h Sleep', emoji: '😴' }
    ],
    dailyLogs: {
      [todayKey]: {
        dateString: todayKey,
        completedHabits: ['water', 'steps', 'reading'],
        hardTasks: [
          {
            id: 'h1',
            text: 'Finalize and submit product architecture proposal',
            completed: true,
            category: 'professional'
          },
          {
            id: 'h2',
            text: '45-minute sprint workout & mobility session',
            completed: true,
            category: 'health'
          },
          {
            id: 'h3',
            text: 'Book flights and lodging for Kyoto design conference',
            completed: false,
            category: 'travel'
          }
        ],
        rapidLog: [
          {
            id: 'r1',
            type: 'completed',
            text: 'Review pull request from mobile engineering pod',
            category: 'professional',
            timestamp: '09:15'
          },
          {
            id: 'r2',
            type: 'event',
            text: '14:00 Architecture sync with design systems lead',
            category: 'professional',
            timestamp: '11:30'
          },
          {
            id: 'r3',
            type: 'completed',
            text: 'Read Chapter 3 of systems architecture design',
            category: 'learning',
            timestamp: '12:45'
          },
          {
            id: 'r4',
            type: 'task',
            text: 'Order organic espresso beans and oat milk',
            category: 'shopping',
            timestamp: '15:20'
          },
          {
            id: 'r5',
            type: 'migrated',
            text: 'Schedule bi-annual dental cleaning appointment',
            category: 'health',
            timestamp: '16:00'
          },
          {
            id: 'r6',
            type: 'note',
            text: 'Insight: Creative clarity follows physical exertion, not mental strain.',
            category: 'creative',
            timestamp: '17:10'
          }
        ],
        reflection: 'Strong momentum today. Hard Task #1 felt seamless after the morning workout. Will complete the travel bookings tonight.'
      }
    },
    monthlyLogs: {
      '2026-09': {
        monthKey: '2026-09',
        events: {
          '01': 'Quarterly strategy kick-off',
          '06': 'Architecture review & design sprint',
          '15': 'Flight to Kyoto Design Summit',
          '22': 'System release v2.0 deployment',
          '28': 'Family dinner & celebration'
        },
        masterTasks: [
          { id: 'm1', text: 'Ship v2.0 Decide One Release', completed: true, category: 'professional' },
          { id: 'm2', text: 'Read 2 books on industrial architecture', completed: false, category: 'learning' },
          { id: 'm3', text: 'Complete 100km running mileage target', completed: false, category: 'health' },
          { id: 'm4', text: 'Renew travel insurance and international passport', completed: true, category: 'travel' }
        ]
      }
    },
    weeklyReviews: {},
    decisions: [
      {
        id: 'dec_1',
        title: 'Architectural migration to 100% on-device local silicon',
        context: 'Evaluate whether to maintain a cloud sync backend or transition to zero-cloud client-side storage.',
        mentalModel: 'First Principles',
        stake: 'Critical',
        confidence: 95,
        createdAt: '2026-09-01',
        reviewDate: '2026-10-01',
        prediction: 'Zero server dependencies will yield sub-2ms latency and eliminate all data privacy liabilities.',
        status: 'pending',
        retrospective: ''
      },
      {
        id: 'dec_2',
        title: 'Enforce non-negotiable 24px universal Swiss grid constraint',
        context: 'Reject infinite canvas and multi-column clutter to protect executive cognitive focus.',
        mentalModel: 'Inversion',
        stake: 'Strategic',
        confidence: 90,
        createdAt: '2026-08-15',
        reviewDate: '2026-09-15',
        prediction: 'Constrained single-page dot-grid will reduce daily planning fatigue by over 70%.',
        status: 'reviewed',
        retrospective: 'Validated. Users report immediate reduction in daily backlog guilt.'
      }
    ],
    closureLogs: {},
    settings: {
      font: 'sans',
      paperStyle: 'dots',
      penColor: '#18181B',
      isMuted: false,
      darkMode: false,
      viewMode: 'stream'
    }
  };
}

function getEmptyVolumeData() {
  return {
    habits: [],
    dailyLogs: {},
    monthlyLogs: {},
    weeklyReviews: {},
    decisions: [],
    closureLogs: {},
    settings: {
      font: 'sans',
      paperStyle: 'plain',
      paperTone: 'white',
      inkColor: 'carbon',
      penColor: '#18181B',
      isMuted: false,
      darkMode: false,
      viewMode: 'stream'
    }
  };
}

function loadVolumeDataFromStorage(volumeId) {
  try {
    const key = getVolumeStorageKey(volumeId);
    let stored = localStorage.getItem(key);
    // Read earlier product stores once, then migrate them into Decide One.
    if (!stored) {
      for (const legacyKey of getLegacyVolumeStorageKeys(volumeId)) {
        stored = localStorage.getItem(legacyKey);
        if (stored) {
          localStorage.setItem(key, stored);
          break;
        }
      }
    }

    if (stored) {
      const parsed = JSON.parse(stored);
      if (!parsed.habits) {
        parsed.habits = [];
      }
      if (!parsed.settings) {
        parsed.settings = { paperStyle: 'dots' };
      } else if (!parsed.settings.paperStyle) {
        parsed.settings.paperStyle = 'dots';
      }
      if (!parsed.weeklyReviews) {
        parsed.weeklyReviews = {};
      }
      if (!parsed.decisions) {
        parsed.decisions = [];
      }
      if (!parsed.closureLogs) {
        parsed.closureLogs = {};
      }
      return parsed;
    }
  } catch (e) {
    console.error('Error loading volume storage', e);
  }
  return getEmptyVolumeData();
}

export function useJournalStorage() {
  const [activeVolumeId, setActiveVolumeId] = useState(() => getStoredActiveVolume());
  const [data, setData] = useState(() => loadVolumeDataFromStorage(activeVolumeId));

  // Save current active volume whenever data changes
  useEffect(() => {
    try {
      const key = getVolumeStorageKey(activeVolumeId);
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to persist to localStorage', e);
    }
  }, [data, activeVolumeId]);

  // Switch volume handler
  const switchVolume = useCallback((targetVolumeId) => {
    if (targetVolumeId === activeVolumeId) return;

    // Persist current data first
    try {
      const currentKey = getVolumeStorageKey(activeVolumeId);
      localStorage.setItem(currentKey, JSON.stringify(data));
      localStorage.setItem(ACTIVE_VOLUME_KEY, targetVolumeId);
    } catch (e) {
      console.error('Failed to persist before switching volume', e);
    }

    setActiveVolumeId(targetVolumeId);
    const targetData = loadVolumeDataFromStorage(targetVolumeId);
    setData(targetData);
  }, [activeVolumeId, data]);

  // Ensure log exists for a date
  const getDailyLog = useCallback((dateKey) => {
    if (data.dailyLogs && data.dailyLogs[dateKey]) {
      const log = data.dailyLogs[dateKey];
      if (!log.completedHabits) {
        log.completedHabits = [];
      }
      return log;
    }
    return {
      dateString: dateKey,
      completedHabits: [],
      hardTasks: [
        { id: `h1_${dateKey}`, text: '', completed: false, category: 'professional' },
        { id: `h2_${dateKey}`, text: '', completed: false, category: 'health' },
        { id: `h3_${dateKey}`, text: '', completed: false, category: 'personal' }
      ],
      rapidLog: [],
      reflection: ''
    };
  }, [data.dailyLogs]);

  // Update a daily log
  const saveDailyLog = useCallback((dateKey, updatedFields) => {
    setData((prev) => {
      const current = (prev.dailyLogs && prev.dailyLogs[dateKey]) || getDailyLog(dateKey);
      return {
        ...prev,
        dailyLogs: {
          ...prev.dailyLogs,
          [dateKey]: {
            ...current,
            ...updatedFields
          }
        }
      };
    });
  }, [getDailyLog]);

  // Toggle habit for a given date
  const toggleHabit = useCallback((dateKey, habitId) => {
    const current = getDailyLog(dateKey);
    const existing = current.completedHabits || [];
    const updatedHabits = existing.includes(habitId)
      ? existing.filter(id => id !== habitId)
      : [...existing, habitId];

    saveDailyLog(dateKey, { completedHabits: updatedHabits });
    telemetry.track('habit_toggled', { habit_id: habitId, count: updatedHabits.length });
  }, [getDailyLog, saveDailyLog]);

  // Add recurring habit
  const addHabit = useCallback((habitObj) => {
    setData((prev) => ({
      ...prev,
      habits: [...(prev.habits || []), habitObj]
    }));
    telemetry.track('habit_created');
  }, []);

  // Delete recurring habit
  const deleteHabit = useCallback((habitId) => {
    setData((prev) => ({
      ...prev,
      habits: (prev.habits || []).filter(h => h.id !== habitId)
    }));
  }, []);

  // Get monthly log
  const getMonthlyLog = useCallback((monthKey) => {
    if (data.monthlyLogs && data.monthlyLogs[monthKey]) {
      return data.monthlyLogs[monthKey];
    }
    return {
      monthKey,
      events: {},
      masterTasks: []
    };
  }, [data.monthlyLogs]);

  // Save monthly log
  const saveMonthlyLog = useCallback((monthKey, updatedFields) => {
    setData((prev) => {
      const current = (prev.monthlyLogs && prev.monthlyLogs[monthKey]) || getMonthlyLog(monthKey);
      return {
        ...prev,
        monthlyLogs: {
          ...prev.monthlyLogs,
          [monthKey]: {
            ...current,
            ...updatedFields
          }
        }
      };
    });
  }, [getMonthlyLog]);

  // Weekly Reviews
  const getWeeklyReview = useCallback((weekKey) => {
    if (data.weeklyReviews && data.weeklyReviews[weekKey]) {
      return data.weeklyReviews[weekKey];
    }
    return {
      weekKey,
      victories: ['', '', ''],
      bottleneck: '',
      nonNegotiables: ['', '', ''],
      triagedTasks: {}
    };
  }, [data.weeklyReviews]);

  const saveWeeklyReview = useCallback((weekKey, updatedFields) => {
    setData((prev) => {
      const current = (prev.weeklyReviews && prev.weeklyReviews[weekKey]) || {
        weekKey,
        victories: ['', '', ''],
        bottleneck: '',
        nonNegotiables: ['', '', ''],
        triagedTasks: {}
      };
      return {
        ...prev,
        weeklyReviews: {
          ...(prev.weeklyReviews || {}),
          [weekKey]: {
            ...current,
            ...updatedFields
          }
        }
      };
    });
  }, []);

  // Update global settings
  const updateSettings = useCallback((newSettings) => {
    setData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...newSettings
      }
    }));
  }, []);

  // Export JSON backup
  const exportJSON = useCallback(() => {
    telemetry.track('vault_exported', { export_type: 'raw_json' });
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `decideone_${activeVolumeId}_${formatDateKey(new Date())}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, [data, activeVolumeId]);

  // Import JSON backup
  const importJSON = useCallback((jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && parsed.dailyLogs) {
        setData(parsed);
        return true;
      }
    } catch (e) {
      console.error('Invalid JSON backup file', e);
    }
    return false;
  }, []);

  // Executive Decision Ledger methods
  const addDecision = useCallback((decision) => {
    telemetry.track('decision_logged', { stake: decision?.stake || 'Strategic' });
    setData(prev => ({
      ...prev,
      decisions: [
        {
          id: `dec_${Date.now()}`,
          createdAt: formatDateKey(new Date()),
          status: 'pending',
          confidence: 80,
          stake: 'Strategic',
          mentalModel: 'First Principles',
          ...decision
        },
        ...(prev.decisions || [])
      ]
    }));
  }, []);

  const updateDecision = useCallback((decisionId, updates) => {
    setData(prev => ({
      ...prev,
      decisions: (prev.decisions || []).map(d => 
        d.id === decisionId ? { ...d, ...updates } : d
      )
    }));
  }, []);

  const deleteDecision = useCallback((decisionId) => {
    setData(prev => ({
      ...prev,
      decisions: (prev.decisions || []).filter(d => d.id !== decisionId)
    }));
  }, []);

  // Evening Closure Ritual (Executive Shutdown Complete)
  const closeDay = useCallback((dateKey, closureSummary) => {
    telemetry.track('day_closed', { score: closureSummary?.score || 0 });
    setData(prev => {
      const dailyLogs = { ...prev.dailyLogs };
      const currentLog = dailyLogs[dateKey] || { dateString: dateKey, hardTasks: [], rapidLog: [] };
      dailyLogs[dateKey] = {
        ...currentLog,
        isClosed: true,
        closedAt: new Date().toISOString(),
        closureSummary: closureSummary || null
      };

      const closureLogs = {
        ...(prev.closureLogs || {}),
        [dateKey]: {
          closedAt: new Date().toISOString(),
          ...closureSummary
        }
      };

      return {
        ...prev,
        dailyLogs,
        closureLogs
      };
    });
  }, []);

  // Encrypted Vault Exporter (.vault)
  const exportEncryptedVault = useCallback(async (passphrase) => {
    telemetry.track('vault_exported', { export_type: 'encrypted_vault' });
    const envelope = await encryptVaultData(data, passphrase);
    const volName = EXECUTIVE_VOLUMES.find(v => v.id === activeVolumeId)?.name || 'Work';
    downloadEncryptedVaultFile(envelope, volName);
    return envelope;
  }, [data, activeVolumeId]);

  // Encrypted Vault Importer (.vault)
  const importEncryptedVault = useCallback(async (envelope, passphrase) => {
    const decrypted = await decryptVaultData(envelope, passphrase);
    if (decrypted && (decrypted.dailyLogs || decrypted.habits)) {
      setData(decrypted);
      return true;
    }
    return false;
  }, []);

  return {
    data,
    habits: data.habits || [],
    toggleHabit,
    addHabit,
    deleteHabit,
    getDailyLog,
    saveDailyLog,
    getMonthlyLog,
    saveMonthlyLog,
    getWeeklyReview,
    saveWeeklyReview,
    // Executive Decision Ledger
    decisions: data.decisions || [],
    addDecision,
    updateDecision,
    deleteDecision,
    // Executive Evening Closure
    closureLogs: data.closureLogs || {},
    closeDay,
    // Vault Security
    exportEncryptedVault,
    importEncryptedVault,
    settings: data.settings,
    updateSettings,
    exportJSON,
    importJSON,
    // Executive Multi-Volume Domain Controls
    activeVolumeId,
    activeVolume: EXECUTIVE_VOLUMES.find(v => v.id === activeVolumeId) || EXECUTIVE_VOLUMES[0],
    volumes: EXECUTIVE_VOLUMES,
    switchVolume
  };
}
