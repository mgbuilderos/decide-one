import React, { lazy, Suspense, useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import HeaderToolbar from './components/HeaderToolbar';
import DateHeader from './components/DateHeader';
import { LeftPage, RightPage } from './components/SpreadPages';
import QuickStart from './components/QuickStart';

import { useJournalStorage, formatDateKey } from './hooks/useJournalStorage';
import { useProductivity } from './hooks/useProductivity';
import { playSound } from './utils/audio';
import { getStoredLicense, migrateLegacyActivation, revalidateStoredLicense } from './utils/licenseManager';
import { downloadMarkdownVault, printAnnualBook } from './utils/archivalExport';
import ExecutivePrivacyOverlay from './components/ExecutivePrivacyOverlay';
import { usePrivacyShutter } from './hooks/usePrivacyShutter';
import { useLicenseAutoActivation } from './hooks/useLicenseAutoActivation';
import { generateExecutiveWeeklyBriefingPDF } from './utils/weeklyBriefingPDF';
import { getFrameworkItems, STATES, pauseSession } from './utils/executionModel';
import DayConditionPrompt from './components/DayConditionPrompt';
import { useExecutiveDictation } from './hooks/useExecutiveDictation';
import { useAmbientReminders } from './hooks/useAmbientReminders';
import { telemetry, getHistoryDepthDays, lengthBucket, wordBucket } from './utils/telemetry';
import { shouldOfferCarryForward, applyCarryForward, markOffered } from './utils/carryForward';
import { observeWebVitals } from './utils/webVitals';
import { stepDate, shouldOfferClosure } from './utils/dayNavigation';
import { initialView } from './utils/viewParam';
import { needsQuickStart, finishQuickStart } from './utils/quickStart';

const MonthlyLogSpread = lazy(() => import('./components/MonthlyLogSpread'));
const CarryForwardModal = lazy(() => import('./components/CarryForwardModal'));
const YearlyViewSpread = lazy(() => import('./components/YearlyViewSpread'));
const WeeklyReviewSpread = lazy(() => import('./components/WeeklyReviewSpread'));
const LegalPages = lazy(() => import('./components/LegalPages'));
const MethodsPage = lazy(() => import('./components/MethodsPage'));
const PatronUpgradeModal = lazy(() => import('./components/PatronUpgradeModal'));
const ProductivityDrawer = lazy(() => import('./components/ProductivityDrawer'));
const QuickLegendModal = lazy(() => import('./components/QuickLegendModal'));
const UnifiedMenuModal = lazy(() => import('./components/UnifiedMenuModal'));
const OmniSearchModal = lazy(() => import('./components/OmniSearchModal'));
const ExecutiveDecisionLogModal = lazy(() => import('./components/ExecutiveDecisionLogModal'));
const ExecutiveClosureRitualModal = lazy(() => import('./components/ExecutiveClosureRitualModal'));
const ExecutiveVoiceHUD = lazy(() => import('./components/ExecutiveVoiceHUD'));
const ExecutiveScratchpadModal = lazy(() => import('./components/ExecutiveScratchpadModal'));

const ViewLoading = () => <div className="w-full min-h-[320px] flex-1 grid place-items-center bg-white text-sm text-neutral-500">Opening Decide One…</div>;

export default function App() {
  const [activeView, setActiveView] = useState(() => initialView(window.location.search));
  const [isQuickStartOpen, setIsQuickStartOpen] = useState(() => initialView(window.location.search) === 'daily' && needsQuickStart());
  const closeQuickStart = useCallback(() => { finishQuickStart(); setIsQuickStartOpen(false); }, []);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [license, setLicense] = useState(() => {
    // B2 — anyone who activated with a retired promo key keeps access as a
    // demo rather than being silently dropped to the free version.
    migrateLegacyActivation();
    return getStoredLicense();
  });

  // A stored signed licence is re-verified against the public key after mount,
  // so a forged or corrupted record cannot grant Patron past the first render.
  // archive_gate_hit — the moment someone reaches back through their own days.
  //
  // This is the conversion trigger under any pricing model, and the single
  // biggest hole in the taxonomy: nothing currently records when a person
  // wants their past and how much of it they have. Fired once per surface per
  // session, because the question is "did they reach for it", not "how often
  // did they click".
  const archiveGatesSeen = useRef(new Set());
  useEffect(() => {
    const REVIEW_SURFACES = ['weekly', 'monthly', 'yearly'];
    if (!REVIEW_SURFACES.includes(activeView)) return;
    if (archiveGatesSeen.current.has(activeView)) return;
    archiveGatesSeen.current.add(activeView);
    telemetry.track('archive_gate_hit', {
      surface: activeView,
      history_depth_days: getHistoryDepthDays()
    });
  }, [activeView]);

  useEffect(() => {
    revalidateStoredLicense().then(setLicense);
  }, []);
  // FINAL_DESIGN: two desktop pages, one phone page. Motion never owns the date.
  const [mobileFold, setMobileFold] = useState('side1');
  const [bookSpread, setBookSpread] = useState(() => window.matchMedia('(min-width: 768px)').matches);
  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)');
    const update = () => setBookSpread(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  const [closureOfferedFor, setClosureOfferedFor] = useState(null);

  // 24px grid cadence height snapper for the instrument sheet
  const [snappedNotebookHeight, setSnappedNotebookHeight] = useState(null);
  const mainStageRef = useRef(null);

  useEffect(() => {
    const updateNotebookCadenceHeight = () => {
      if (!mainStageRef.current) return;
      const stageStyle = getComputedStyle(mainStageRef.current);
      const avail = mainStageRef.current.clientHeight - parseFloat(stageStyle.paddingTop) - parseFloat(stageStyle.paddingBottom);
      if (avail > 100) {
        // Snap canvas height H to strict multiple of 24px so the bottom footer border-t falls exactly on grid lines
        const cadence = window.innerHeight <= 820 ? 12 : 24;
        const snapped = Math.max(240, Math.floor(avail / cadence) * cadence);
        setSnappedNotebookHeight(snapped);
      }
    };

    updateNotebookCadenceHeight();
    const stage = mainStageRef.current;
    const observer = new ResizeObserver(updateNotebookCadenceHeight);
    if (stage) observer.observe(stage);
    window.addEventListener('resize', updateNotebookCadenceHeight);
    return () => { observer.disconnect(); window.removeEventListener('resize', updateNotebookCadenceHeight); };
  }, [activeView]);

  // Keep copied links aligned with the visible instrument or information page.
  useEffect(() => {
    const url = new URL(window.location.href);
    const viewChanged = url.searchParams.get('view') !== activeView;
    const shouldClearHash = url.hash;
    if (!viewChanged && !shouldClearHash) return;
    url.searchParams.set('view', activeView);
    if (shouldClearHash) url.hash = '';
    window.history.replaceState(window.history.state, '', url);
  }, [activeView]);

  const {
    data,
    getDailyLog,
    saveDailyLog,
    getMonthlyLog,
    saveMonthlyLog,
    getWeeklyReview,
    saveWeeklyReview,
    decisions,
    addDecision,
    updateDecision,
    deleteDecision,
    closeDay,
    exportEncryptedVault,
    importEncryptedVault,
    settings,
    updateSettings,
    exportJSON,
  } = useJournalStorage();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDecisionLogOpen, setIsDecisionLogOpen] = useState(false);
  const [isClosureModalOpen, setIsClosureModalOpen] = useState(false);
  const [isDayConditionOpen, setIsDayConditionOpen] = useState(false);
  const [dayConditionDismissedFor, setDayConditionDismissedFor] = useState(null);
  const [isScratchpadOpen, setIsScratchpadOpen] = useState(false);

  // Executive Thought Dictation Hook (Cmd+Shift+V)
  // Every name here must match what useExecutiveDictation actually returns.
  // It did not: the hook calls onCommitEntry and this passed
  // onTranscriptionCommit, so `onCommitEntry?.()` optional-chained into
  // nothing and every dictated sentence was transcribed and then dropped.
  // targetSection/setTargetSection do not exist either - the hook exposes
  // targetDestination - so the HUD's target buttons were calling undefined().
  const {
    isListening,
    interimTranscript,
    audioLevel,
    targetDestination: dictationTarget,
    setTargetDestination: setDictationTarget,
    stopDictation,
    toggleDictation
  } = useExecutiveDictation({
    isMuted: settings?.isMuted,
    onStart: () => telemetry.track('dictation_started', {}),
    onCommitEntry: ({ text, target }) => {
      if (!text || !text.trim()) return;
      telemetry.track('dictation_completed', { target_section: target, words: wordBucket(text.trim().split(/\s+/).length) });
      const key = formatDateKey(currentDate);
      const curLog = getDailyLog(key);
      if (target === 'top3') {
        const emptySlot = curLog.hardTasks.find(t => !t.text.trim());
        if (emptySlot) {
          saveDailyLog(key, {
            hardTasks: curLog.hardTasks.map(t =>
              t.id === emptySlot.id ? { ...t, text: text.trim(), completed: false } : t
            )
          });
        } else {
          saveDailyLog(key, {
            rapidLog: [...curLog.rapidLog, { id: `item_${Date.now()}`, type: 'task', text: text.trim(), completed: false, category: 'work' }]
          });
        }
      } else if (target === 'reflection') {
        const prev = curLog.reflection?.text || '';
        saveDailyLog(key, {
          reflection: { ...curLog.reflection, text: prev ? `${prev}\n${text.trim()}` : text.trim() }
        });
      } else {
        saveDailyLog(key, {
          rapidLog: [...curLog.rapidLog, { id: `item_${Date.now()}`, type: 'task', text: text.trim(), completed: false, category: 'work' }]
        });
      }
    }
  });

  // 1-Click License Auto-Activation from Dodo Payments (?key=PB-...)
  useLicenseAutoActivation({
    isMuted: settings?.isMuted,
    onActivated: () => {
      setLicense(getStoredLicense());
    }
  });

  // Privacy Shutter Hook (Esc / Cmd+Shift+L / Tab Blur / 3-min idle)
  const {
    shutterState,
    triggerHardLock,
    resumeActive,
    unlockVaultManually
  } = usePrivacyShutter({
    idleTimeoutMs: 180000,
    isVaultUnlocked: true,
    enabled: !['legal', 'methods'].includes(activeView) && !isQuickStartOpen
  });

  // Dark mode class sync on load
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  // Information pages scroll; the instrument holds one screen.
  useEffect(() => {
    const locked = !['legal', 'methods'].includes(activeView);
    document.documentElement.classList.toggle('app-locked', locked);
    document.body.classList.toggle('app-locked', locked);
    telemetry.setCurrentView(activeView);
  }, [activeView]);

  const handleStepDay = (delta, directTargetDate = null) => {
    playSound('page', settings.isMuted);
    setCurrentDate(current => stepDate(current, delta, directTargetDate));
  };

  /**
   * P11/P12 — turning the sheet over.
   *
   * The turn to the verso is the day-closure gesture. P4 kept day closure but
   * gave it no physical act; this is the act. It fires once per day, and only
   * when there is something to close, so the ritual never nags an empty page.
   */
  const handleMobileFoldSwitch = (fold) => {
    if (mobileFold === fold && !bookSpread) return;
    playSound('page', settings.isMuted);
    setMobileFold(fold);

    const turningToVerso = fold === 'side2';
    const hasSomethingToClose = getFrameworkItems(dailyLog).length > 0;
    const alreadyClosedToday = !!dailyLog.closedAt || closureOfferedFor === dateKey;
    // Mid-session the verso is the focus stage, not the ledger. Turning over to
    // watch the clock must not be read as "I am done for the day" — the closure
    // ritual waits until nothing is actually running.
    const somethingRunning = Object.values(dailyLog.execution || {}).some(
      (x) => x.state === 'RUNNING' || x.state === 'BREATHING'
    );
    if (shouldOfferClosure({ turningToVerso, hasSomethingToClose, alreadyClosedToday, somethingRunning, dateKey, todayKey })) {
      setClosureOfferedFor(dateKey);
      setIsClosureModalOpen(true);
    }
  };

  // Executive Universal Keyboard Shortcuts & Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isQuickStartOpen || ['legal', 'methods'].includes(activeView)) return;
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
      
      if (e.key === 'ArrowLeft' || e.key === 'h') {
        handleStepDay(-1);
      } else if (e.key === 'ArrowRight' || e.key === 'l') {
        handleStepDay(1);
      } else if (e.key === '1') {
        playSound('page', settings.isMuted);
        setActiveView('daily');
      } else if (e.key === '2') {
        playSound('page', settings.isMuted);
        setActiveView('weekly');
      } else if (e.key === '3') {
        playSound('page', settings.isMuted);
        setActiveView('monthly');
      } else if (e.key === '4') {
        playSound('page', settings.isMuted);
        setActiveView('yearly');
      } else if (e.key === 't' || e.key === 'T') {
        playSound('page', settings.isMuted);
        setCurrentDate(new Date());
        setActiveView('daily');
      } else if (e.key === 'm' || e.key === 'M') {
        playSound('click', settings.isMuted);
        setIsMenuOpen(prev => !prev);
      } else if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        toggleDictation();
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        playSound('click', settings.isMuted);
        setIsScratchpadOpen(prev => !prev);
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        playSound('click', settings.isMuted);
        setIsSearchOpen(prev => !prev);
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        playSound('click', settings.isMuted);
        setIsDecisionLogOpen(prev => !prev);
      } else if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        playSound('click', settings.isMuted);
        setIsClosureModalOpen(prev => !prev);
      } else if (e.key === '/') {
        e.preventDefault();
        playSound('click', settings.isMuted);
        setIsSearchOpen(true);
      } else if (e.key === '?') {
        playSound('click', settings.isMuted);
        setIsHelpOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeView, currentDate, settings.isMuted, toggleDictation, isQuickStartOpen]);

  // Teleportation to specific page from Omnisearch
  const handleTeleportToPage = (dateObj) => {
    if (activeView !== 'daily') {
      setActiveView('daily');
    }
    handleStepDay(0, dateObj);
  };

  // Executive Weekly Briefing PDF Generator
  const handlePrintWeeklyBriefing = async () => {
    playSound('click', settings.isMuted);
    await generateExecutiveWeeklyBriefingPDF({
      startDate: currentDate,
      data,
      settings,
      pageSize: 'a4'
    });
  };

  // Air-Gapped Encrypted Vault Exporter (.vault)
  const handleExportEncryptedVault = async () => {
    playSound('clasp-lock', settings.isMuted);
    const passphrase = window.prompt("Enter a passphrase to seal your encrypted .vault backup (min 4 chars):");
    if (!passphrase) return;
    if (passphrase.length < 4) {
      alert("Passphrase must be at least 4 characters.");
      return;
    }
    try {
      await exportEncryptedVault(passphrase);
    } catch (err) {
      alert("Vault export failed: " + err.message);
    }
  };

  // Air-Gapped Encrypted Vault Importer (.vault)
  const handleImportEncryptedVault = (file) => {
    playSound('click', settings.isMuted);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const envelope = JSON.parse(evt.target.result);
        const passphrase = window.prompt("Enter your vault passphrase to decrypt and restore:");
        if (!passphrase) return;
        const success = await importEncryptedVault(envelope, passphrase);
        if (success) {
          playSound('closure', settings.isMuted);
          alert("Vault restored successfully!");
          setIsMenuOpen(false);
        } else {
          alert("Decryption failed. Please verify your passphrase.");
        }
      } catch (err) {
        alert("Invalid .vault file: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  /**
   * Which days already have something written on them. Used only to put a mark
   * under those days in the month picker — not a streak and not a score (R12),
   * just where the work already is.
   */
  const hasEntry = useCallback((k) => {
    const log = data?.dailyLogs?.[k];
    if (!log) return false;
    const written = (arr) => (arr || []).some(t => t && typeof t.text === 'string' && t.text.trim());
    return written(log.hardTasks) ||
      Object.keys(log.execution || {}).length > 0 ||
      Object.keys(log.frameworkData || {}).length > 0;
  }, [data]);

  // Keys
  const dateKey = formatDateKey(currentDate);
  const todayKey = formatDateKey(new Date());
  const isPastDay = dateKey < todayKey;
  const monthKey = dateKey.slice(0, 7); // "YYYY-MM"

  // Core Web Vitals, first-party, marketing surfaces only.
  //
  // TELEMETRY_SPEC §3.2 wants LCP, INP, CLS and TTFB; B-39 removed the
  // Cloudflare beacon that used to supply them. §0a item 2 scopes site
  // measurement to landing routes, so this reads the view the page actually
  // opened on rather than the current one - LCP is decided during first paint,
  // long before anyone navigates.
  useEffect(() => {
    const opened = new URLSearchParams(window.location.search).get('view');
    const isMarketingEntry = ['legal', 'methods'].includes(opened);
    if (!isMarketingEntry) return undefined;
    // entry_view rides along because §3.2 asks for these per page, and the
    // view the page opened on is the only page identity that is correct for
    // LCP - it is decided during first paint, before any navigation.
    const entryView = opened;
    return observeWebVitals((metrics) => telemetry.track('web_vitals', { ...metrics, entry_view: entryView }));
  }, []);

  // Carrying yesterday's open priorities forward.
  //
  // Offered once on a day the person has not started yet, and only when an
  // earlier day left something genuinely open. VISION §11.3's fourth rule
  // applies: this is an offer about what is still true, never a reckoning
  // about what was missed.
  const [carryCandidate, setCarryCandidate] = useState(null);

  useEffect(() => {
    if (dateKey !== todayKey) return;
    const candidate = shouldOfferCarryForward(data.dailyLogs, todayKey);
    if (candidate) setCarryCandidate(candidate);
  }, [dateKey, todayKey, data.dailyLogs]);

  const dismissCarryForward = useCallback(() => {
    markOffered(todayKey);
    setCarryCandidate(null);
  }, [todayKey]);

  const handleCarryForward = useCallback((chosenIds) => {
    if (!carryCandidate) return;
    const sourceKey = carryCandidate.fromDateKey;
    const { todayTasks, sourceTasks, placed } = applyCarryForward(
      getDailyLog(todayKey),
      getDailyLog(sourceKey),
      chosenIds
    );
    saveDailyLog(todayKey, { hardTasks: todayTasks });
    saveDailyLog(sourceKey, { hardTasks: sourceTasks });
    telemetry.track('priorities_carried_forward', {
      offered: carryCandidate.tasks.length,
      carried: placed,
      source_age_days: Math.round(
        (new Date(todayKey + 'T00:00:00') - new Date(sourceKey + 'T00:00:00')) / 86400000
      )
    });
    markOffered(todayKey);
    setCarryCandidate(null);
  }, [carryCandidate, todayKey, getDailyLog, saveDailyLog]);

  // Current Logs
  const dailyLog = getDailyLog(dateKey);
  const monthlyLog = getMonthlyLog(monthKey);

  // Active method (Rule of 3 / The Urgent/Important Matrix / Ivy Lee Method)
  const activeFramework = dailyLog.activeFramework || settings.activeFramework || 'rule_of_3';

  // Productivity metrics
  const { dailyMetrics, monthlyStats } = useProductivity(
    dailyLog,
    data.dailyLogs,
    monthKey
  );

  // Local evening reminder. Kept for its notification, which is dormant until
  // something in the UI calls requestPermission — see B-39. The prop names here
  // were all four wrong (currentDate/dailyLog/settings/onTriggerClosureModal
  // against isTop3Untouched/onOpenClosureRitual/isMuted), so even the parts that
  // could run were handed nothing; they now match the hook's signature.
  useAmbientReminders({
    onOpenClosureRitual: () => setIsClosureModalOpen(true),
    isMuted: settings.isMuted
  });

  // Handlers for Daily Log
  const handleSelectFramework = (fwId, duration = 'today') => {
    playSound('check', settings.isMuted);
    telemetry.track('framework_selected', { framework_id: fwId, duration });
    const numDays = duration === '3days' ? 3 : duration === 'week' ? 7 : 1;
    for (let i = 0; i < numDays; i++) {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + i);
      saveDailyLog(formatDateKey(d), { activeFramework: fwId });
    }
    if (duration === 'default') {
      updateSettings({ activeFramework: fwId });
    }
  };

  // C3 — the morning entry surface. The user names the condition of the day;
  // the instrument routes to the method silently. The method is never named here.
  const handleChooseDayCondition = (condition) => {
    saveDailyLog(dateKey, { dayCondition: condition.id });
    handleSelectFramework(condition.framework);
    setIsDayConditionOpen(false);
  };

  // Ask once per day, on today only, and only before a method is chosen.
  // Skipping is remembered for the session so the question never nags.
  useEffect(() => {
    // The question is about today's page. Leaving it — another view, another day —
    // closes it, so it never covers a surface it has nothing to do with. It stayed
    // mounted over Weekly after a keyboard switch until 14 September 2026. Coming
    // back asks again until it is answered or skipped.
    if (isQuickStartOpen || activeView !== 'daily' || dateKey !== todayKey) { setIsDayConditionOpen(false); return; }
    if (dailyLog.dayCondition || dailyLog.activeFramework) return;
    if (dayConditionDismissedFor === dateKey) return;
    setIsDayConditionOpen(true);
  }, [isQuickStartOpen, activeView, dateKey, todayKey, dailyLog.dayCondition, dailyLog.activeFramework, dayConditionDismissedFor]);

  // Only one priority can receive focus time at once. Starting another banks
  // the current stopwatch before the new one begins.
  const handleUpdateExecution = (itemId, session) => {
    const nextExecution = { ...(dailyLog.execution || {}) };
    if ([STATES.BREATHING, STATES.RUNNING].includes(session.state)) {
      Object.entries(nextExecution).forEach(([id, existing]) => {
        if (id !== itemId && [STATES.BREATHING, STATES.RUNNING].includes(existing?.state)) {
          nextExecution[id] = pauseSession(existing);
        }
      });
    }
    saveDailyLog(dateKey, {
      execution: { ...nextExecution, [itemId]: session }
    });
  };

  const handleUpdateHardTasks = (updatedHardTasks) => {
    telemetry.track('framework_task_added', { count: updatedHardTasks.length });
    saveDailyLog(dateKey, { hardTasks: updatedHardTasks });
  };

  const handleUpdateFrameworkData = (updatedData) => {
    telemetry.track('framework_task_added', { type: 'custom' });
    saveDailyLog(dateKey, { frameworkData: updatedData });
  };

  const handleUpdateReflection = (newReflection) => {
    telemetry.track('reflection_saved', { length: lengthBucket((newReflection?.text || '').length) });
    saveDailyLog(dateKey, { reflection: newReflection });
  };

  // Handlers for Monthly Log
  const handleUpdateMonthlyLog = (updatedMonthlyLog) => {
    saveMonthlyLog(monthKey, updatedMonthlyLog);
  };

  const refreshLicense = () => {
    setLicense(getStoredLicense());
  };

  const handleSelectMonth = (monthIdx) => {
    setCurrentDate(new Date(currentDate.getFullYear(), monthIdx, 1));
    setActiveView('monthly');
  };

  const handleOpenTodayFromIndex = (monthIdx) => {
    const today = new Date();
    if (monthIdx !== undefined && (today.getFullYear() !== currentDate.getFullYear() || today.getMonth() !== monthIdx)) {
      setCurrentDate(new Date(currentDate.getFullYear(), monthIdx, 1));
    } else {
      setCurrentDate(new Date());
    }
    setActiveView('daily');
  };

  const currentPaperParam = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('paper') : null;
  const effectivePaperStyle = currentPaperParam && ['dots', 'square', 'plain'].includes(currentPaperParam)
    ? currentPaperParam
    : (settings.paperStyle || 'dots');

  const paperClass = effectivePaperStyle === 'square'
    ? 'paper-square'
    : effectivePaperStyle === 'plain'
      ? 'paper-plain'
      : 'paper-dots';

  const paperLabel = effectivePaperStyle === 'square'
    ? 'Square Grid'
    : effectivePaperStyle === 'plain'
      ? 'Plain Edition'
      : 'Dot-Grid';

  const effectiveSettings = { ...settings, paperStyle: effectivePaperStyle };

  // Single-Page Marketing Website Route (Natural Window Scrolling)
  if (activeView === 'legal') {
    return <Suspense fallback={<ViewLoading />}><LegalPages onBack={() => setActiveView('daily')} /></Suspense>;
  }

  if (activeView === 'methods') {
    return <Suspense fallback={<ViewLoading />}><MethodsPage onBack={() => setActiveView('daily')} /></Suspense>;
  }

  return (
    <div className={`h-screen max-h-screen overflow-hidden bg-[#e9e9e9] dark:bg-[#0c0c0c] text-neutral-900 dark:text-neutral-100 p-2 sm:p-3 flex flex-col instrument-app font-sans`}>
      
      {/* Header: direct view controls and one unified menu. */}
      <HeaderToolbar
        activeView={activeView}
        setActiveView={setActiveView}
        settings={effectiveSettings}
        onOpenMenu={() => setIsMenuOpen(true)}
        menuOpen={isMenuOpen}
        activeFramework={activeFramework}
        onSelectFramework={handleSelectFramework}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Open Notebook 2-Page Spread (Bi-Fold Desktop / Two-Fold Mobile) */}
        <main ref={mainStageRef} className={`w-full max-w-[412px] md:max-w-[960px] mx-auto flex-1 min-h-0 flex flex-col justify-center print-page ${activeView === 'daily' ? 'pb-10 md:pb-0' : 'pb-0'} relative instrument-stage`}>
            
            {/* Floating day controls only belong to the daily instrument. */}
            {activeView === 'daily' && <button
              type="button"
              onClick={() => handleStepDay(-1)}
              className="page-turn-edge-btn page-turn-edge-left no-print hidden sm:flex"
              title="Previous day (or press ← Arrow)"
              aria-label="Previous Day"
            >
              <ChevronLeft className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>}

            {/* Floating Page-Turn Edge Trigger: Next Day (Right Edge) */}
            {activeView === 'daily' && <button
              type="button"
              onClick={() => handleStepDay(1)}
              className="page-turn-edge-btn page-turn-edge-right no-print hidden sm:flex"
              title="Next day (or press → Arrow)"
              aria-label="Next Day"
            >
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>}

            {/* Founder-approved paper depth, with one governed sheet anchor. */}
            <div 
              style={snappedNotebookHeight ? { height: `${snappedNotebookHeight}px`, maxHeight: `${snappedNotebookHeight}px` } : undefined}
              className={`relative ${paperClass} rounded-[20px] p-6 [@media(max-height:820px)_and_(min-height:761px)]:p-4 [@media(max-height:760px)]:p-3 instrument-sheet ${activeView === 'daily' ? 'book-sheet' : ''} w-full flex-shrink-0 flex flex-col justify-between`}
            >
            <div className="relative z-10 flex-1 min-h-0 flex flex-col overflow-hidden">
              {activeView === 'daily' ? (
                <div key={`${dateKey}-${mobileFold}`} className="book-day-step flex-1 min-h-0 flex flex-col">

                  {/* Approved open spread on desktop; the same pages alternate on phones. */}
                  <div className="book-spread flex-1 min-h-0 w-full flex flex-col gap-0">

                    {/* Left Page: Productivity Framework & Execution */}
                    <div className={`flex-1 min-w-0 min-h-0 flex flex-col border-white/[0.08] instrument-recto overflow-hidden ${
                      bookSpread || mobileFold === 'side1' ? 'flex' : 'hidden'
                    }`}>
                      <LeftPage
                        bookSpread={bookSpread}
                        date={currentDate}
                        dailyLog={dailyLog}
                        activeFramework={activeFramework}
                        onSelectFramework={handleSelectFramework}
                        hardTasks={dailyLog.hardTasks}
                        onUpdateHardTasks={handleUpdateHardTasks}
                        frameworkData={dailyLog.frameworkData}
                        onUpdateFrameworkData={handleUpdateFrameworkData}
                        onUpdateExecution={handleUpdateExecution}
                        hasEntry={hasEntry}
                        settings={settings}
                        updateSettings={updateSettings}
                        isPastDay={isPastDay}
                        onStepDay={handleStepDay}
                        setCurrentDate={setCurrentDate}
                        isInteractive={true}
                      />
                    </div>

                    {/* Right Page: the execution layer (R2) */}
                    <div className={`flex-1 min-w-0 min-h-0 flex flex-col instrument-verso overflow-hidden ${
                      bookSpread || mobileFold === 'side2' ? 'flex' : 'hidden'
                    }`}>
                      <RightPage
                        hasEntry={hasEntry}
                        bookSpread={bookSpread}
                        onTurnOver={() => handleMobileFoldSwitch('side2')}
                        date={currentDate}
                        dailyLog={dailyLog}
                        onCloseDay={() => setIsClosureModalOpen(true)}
                        onUpdateExecution={handleUpdateExecution}
                        paperLabel={paperLabel}
                        settings={settings}
                        updateSettings={updateSettings}
                        onStepDay={handleStepDay}
                        setCurrentDate={setCurrentDate}
                        isInteractive={true}
                      />
                    </div>

                  </div>

                </div>
              ) : activeView === 'weekly' ? (
                /* Sunday Executive Review & Weekly Alignment Spread */
                <Suspense fallback={<ViewLoading />}><WeeklyReviewSpread
                  currentDate={currentDate}
                  setCurrentDate={setCurrentDate}
                  data={data}
                  getDailyLog={getDailyLog}
                  saveDailyLog={saveDailyLog}
                  getWeeklyReview={getWeeklyReview}
                  saveWeeklyReview={saveWeeklyReview}
                  settings={settings}
                  isMuted={settings.isMuted}
                  onBackToDaily={() => setActiveView('daily')}
                /></Suspense>
              ) : activeView === 'monthly' ? (
                /* Monthly Log Spread */
                <Suspense fallback={<ViewLoading />}><MonthlyLogSpread
                  currentDate={currentDate}
                  setCurrentDate={setCurrentDate}
                  monthlyLog={monthlyLog}
                  onUpdateMonthlyLog={handleUpdateMonthlyLog}
                  isMuted={settings.isMuted}
                /></Suspense>
              ) : activeView === 'yearly' ? (
                /* 12-Month Annual Index Spread */
                <Suspense fallback={<ViewLoading />}><YearlyViewSpread
                  currentDate={currentDate}
                  setCurrentDate={setCurrentDate}
                  onSelectMonth={handleSelectMonth}
                  onOpenToday={handleOpenTodayFromIndex}
                  isMuted={settings.isMuted}
                /></Suspense>
              ) : (
                /* Fallback Monthly Spread */
                <Suspense fallback={<ViewLoading />}><MonthlyLogSpread
                  currentDate={currentDate}
                  setCurrentDate={setCurrentDate}
                  monthlyLog={monthlyLog}
                  onUpdateMonthlyLog={handleUpdateMonthlyLog}
                  isMuted={settings.isMuted}
                /></Suspense>
              )}
            </div>


          </div>
        </main>

      {/* Mobile Ergonomic Bottom Thumb-Zone Navigation Bar */}
      {activeView === 'daily' && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#151515]/95  border-t border-black/[0.08] dark:border-white/[0.1] px-4 py-2 flex items-center justify-around no-print" aria-label="Daily Page Sides">
          {[
            { id: 'side1', label: 'Decide' },
            { id: 'side2', label: 'Turn Over' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                handleMobileFoldSwitch(tab.id);
              }}
              className={`flex-1 mx-1 py-1 rounded-full text-xs transition-all cursor-pointer ${
                mobileFold === tab.id
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold shadow-xs'
                  : 'text-neutral-500 font-medium'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      )}

      {/* Unified Settings & Productivity Frameworks Modal */}
      {isMenuOpen && <Suspense fallback={null}><UnifiedMenuModal
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        settings={settings}
        updateSettings={updateSettings}
        activeFramework={activeFramework}
        onSelectFramework={handleSelectFramework}
        onExport={exportJSON}
        onOpenGuide={() => setIsHelpOpen(true)}
        onExportMarkdown={() => downloadMarkdownVault(data, settings)}
        onPrintAnnual={() => printAnnualBook(data, settings, currentDate.getFullYear())}
        onPrintWeeklyBriefing={handlePrintWeeklyBriefing}
        onExportEncryptedVault={handleExportEncryptedVault}
        onImportEncryptedVault={handleImportEncryptedVault}
        onOpenDecisions={() => setIsDecisionLogOpen(true)}
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
        onOpenClosure={() => setIsClosureModalOpen(true)}
        onToggleDictation={toggleDictation}
        isListening={isListening}
        onLockVault={triggerHardLock}
        onOpenMethods={() => setActiveView('methods')}
        onOpenLegal={() => setActiveView('legal')}
      /></Suspense>}

      {/* Sub-Millisecond Omnisearch & Command Palette Modal (Cmd+K) */}
      {isSearchOpen && <Suspense fallback={null}><OmniSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        dailyLogs={data.dailyLogs}
        monthlyLogs={data.monthlyLogs}
        onTeleportToPage={handleTeleportToPage}
        isMuted={settings.isMuted}
        onOpenUpgrade={() => {
          setIsSearchOpen(false);
          setIsUpgradeModalOpen(true);
        }}
      /></Suspense>}

      {/* Executive Biometric / Privacy Shutter Overlay */}
      <ExecutivePrivacyOverlay
        shutterState={shutterState}
        onResumeFromSoftFrost={resumeActive}
        onUnlockVault={unlockVaultManually}
        isMuted={settings.isMuted}
      />

      {/* Payment UI loads only when requested; checkout remains intentionally separate. */}
      {isUpgradeModalOpen && <Suspense fallback={null}><PatronUpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        isMuted={settings.isMuted}
        onLicenseUpdated={refreshLicense}
      /></Suspense>}

      {/* Analytics Drawer (Monochrome) */}
      {isAnalyticsOpen && <Suspense fallback={null}><ProductivityDrawer
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        dailyMetrics={dailyMetrics}
        monthlyStats={monthlyStats}
      /></Suspense>}

      {/* About Decide One & 9-model methodology guide modal */}
      {carryCandidate && <Suspense fallback={null}><CarryForwardModal
        isOpen={Boolean(carryCandidate)}
        candidate={carryCandidate}
        todayKey={todayKey}
        onCarry={handleCarryForward}
        onDismiss={dismissCarryForward}
      /></Suspense>}

      {isHelpOpen && <Suspense fallback={null}><QuickLegendModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      /></Suspense>}

      {/* Executive Decision Ledger Modal (Cmd+D) */}
      {isDecisionLogOpen && <Suspense fallback={null}><ExecutiveDecisionLogModal
        isOpen={isDecisionLogOpen}
        onClose={() => setIsDecisionLogOpen(false)}
        decisions={decisions}
        onAddDecision={addDecision}
        onUpdateDecision={updateDecision}
        onDeleteDecision={deleteDecision}
        isMuted={settings.isMuted}
      /></Suspense>}

      {/* C3 — "What does today look like?", asked before the day has a method. */}
      <QuickStart isOpen={isQuickStartOpen} onClose={closeQuickStart} />
      <DayConditionPrompt
        isOpen={isDayConditionOpen}
        onClose={() => {
          setDayConditionDismissedFor(dateKey);
          setIsDayConditionOpen(false);
        }}
        onChooseCondition={handleChooseDayCondition}
        dateLabel={currentDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
        isMuted={settings.isMuted}
      />

      {isClosureModalOpen && <Suspense fallback={null}><ExecutiveClosureRitualModal
        isOpen={isClosureModalOpen}
        onClose={() => setIsClosureModalOpen(false)}
        dateString={formatDateKey(currentDate)}
        dailyLog={dailyLog}
        onMigrateTask={(taskText, category) => {
          const tomorrow = new Date(currentDate);
          tomorrow.setDate(tomorrow.getDate() + 1);
          const tomorrowKey = formatDateKey(tomorrow);
          const tomorrowLog = getDailyLog(tomorrowKey);
          const emptySlot = tomorrowLog.hardTasks.find(t => !t.text.trim());
          if (emptySlot) {
            saveDailyLog(tomorrowKey, {
              hardTasks: tomorrowLog.hardTasks.map(t => 
                t.id === emptySlot.id ? { ...t, text: taskText, category: category || 'professional' } : t
              )
            });
          }
        }}
        onCloseDay={(dateKey, closureSummary) => {
          closeDay(dateKey, closureSummary);
        }}
        onLockShutter={() => {
          triggerHardLock();
        }}
        isMuted={settings.isMuted}
        ownerName={settings.ownerName}
      /></Suspense>}

      {/* Executive Voice HUD Horological Capsule */}
      {isListening && <Suspense fallback={null}><ExecutiveVoiceHUD
        isListening={isListening}
        interimTranscript={interimTranscript}
        audioLevel={audioLevel}
        targetSection={dictationTarget}
        onSelectTarget={setDictationTarget}
        onStop={stopDictation}
      /></Suspense>}

      {/* Quick Thought Scratchpad Modal (Cmd+N) */}
      {isScratchpadOpen && <Suspense fallback={null}><ExecutiveScratchpadModal
        isOpen={isScratchpadOpen}
        onClose={() => setIsScratchpadOpen(false)}
        onCommitDraft={({ text, target }) => {
          if (!text || !text.trim()) return;
          const key = formatDateKey(currentDate);
          const curLog = getDailyLog(key);
          if (target === 'top3') {
            const emptySlot = curLog.hardTasks.find(t => !t.text.trim());
            if (emptySlot) {
              saveDailyLog(key, {
                hardTasks: curLog.hardTasks.map(t =>
                  t.id === emptySlot.id ? { ...t, text: text.trim(), completed: false } : t
                )
              });
            } else {
              saveDailyLog(key, {
                rapidLog: [...curLog.rapidLog, { id: `item_${Date.now()}`, type: 'task', text: text.trim(), completed: false, category: 'work' }]
              });
            }
          } else if (target === 'reflection') {
            const prev = curLog.reflection?.text || '';
            saveDailyLog(key, {
              reflection: { ...curLog.reflection, text: prev ? `${prev}\n${text.trim()}` : text.trim() }
            });
          } else {
            saveDailyLog(key, {
              rapidLog: [...curLog.rapidLog, { id: `item_${Date.now()}`, type: 'task', text: text.trim(), completed: false, category: 'work' }]
            });
          }
        }}
        isMuted={settings.isMuted}
      /></Suspense>}

    </div>
  );
}
