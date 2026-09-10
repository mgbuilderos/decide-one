import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import HeaderToolbar from './components/HeaderToolbar';
import DateHeader from './components/DateHeader';
import { LeftPage, RightPage, PageTurnLeaf } from './components/SpreadPages';
import MonthlyLogSpread from './components/MonthlyLogSpread';
import YearlyViewSpread from './components/YearlyViewSpread';
import MonthlyBreakerPage from './components/MonthlyBreakerPage';
import PatronUpgradeModal from './components/PatronUpgradeModal';
import ProductivityDrawer from './components/ProductivityDrawer';
import QuickLegendModal from './components/QuickLegendModal';
import UnifiedMenuModal from './components/UnifiedMenuModal';
import DailyVictoryCardModal from './components/DailyVictoryCardModal';
import GiftAccessModal from './components/GiftAccessModal';
import { FRAMEWORKS } from './components/ProductivityFrameworks';
import NotebookCover, { NotebookCoverFrontFace, NotebookCoverEndpaperFace, InteractiveNotebookCover } from './components/NotebookCover';
import MarketingLandingPage from './components/MarketingLandingPage';

import { useJournalStorage, formatDateKey } from './hooks/useJournalStorage';
import { useProductivity } from './hooks/useProductivity';
import { playSound } from './utils/audio';
import { getStoredLicense } from './utils/licenseManager';
import { downloadMarkdownVault, printAnnualBook } from './utils/archivalExport';
import OmniSearchModal from './components/OmniSearchModal';
import ExecutivePrivacyOverlay from './components/ExecutivePrivacyOverlay';
import { usePrivacyShutter } from './hooks/usePrivacyShutter';
import { useLicenseAutoActivation } from './hooks/useLicenseAutoActivation';
import { generateExecutiveWeeklyBriefingPDF } from './utils/weeklyBriefingPDF';
import WeeklyReviewSpread from './components/WeeklyReviewSpread';
import ExecutiveDecisionLogModal from './components/ExecutiveDecisionLogModal';
import ExecutiveClosureRitualModal from './components/ExecutiveClosureRitualModal';
import DayConditionPrompt from './components/DayConditionPrompt';
import { getFrameworkItems } from './utils/executionModel';
import VolumeSwitcherBar from './components/VolumeSwitcherBar';
import ExecutiveVoiceHUD from './components/ExecutiveVoiceHUD';
import ExecutiveScratchpadModal from './components/ExecutiveScratchpadModal';
import SpineAmbientGlow from './components/SpineAmbientGlow';
import { useExecutiveDictation } from './hooks/useExecutiveDictation';
import { useAmbientReminders } from './hooks/useAmbientReminders';
import { telemetry } from './utils/telemetry';

export default function App() {
  const [activeView, setActiveView] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const v = params.get('view');
      if (v === 'daily' || v === 'weekly' || v === 'monthly' || v === 'yearly' || v === 'breaker' || v === 'landing') return v;
      if (window.location.hash && ['#overview', '#highlights', '#design', '#craft', '#devices', '#privacy', '#pricing', '#anatomy', '#audience'].includes(window.location.hash)) {
        return 'landing';
      }
    }
    return 'landing';
  });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeFilter, setActiveFilter] = useState('all');
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isVictoryCardOpen, setIsVictoryCardOpen] = useState(false);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [selectedBreakerMonth, setSelectedBreakerMonth] = useState(() => new Date().getMonth());
  const [license, setLicense] = useState(() => getStoredLicense());
  const [showCover, setShowCover] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('view') === 'cover';
    }
    return false;
  });
  const [coverAnimation, setCoverAnimation] = useState('idle'); // 'idle' | 'opening' | 'closing'
  const coverTimerRef = useRef(null);
  
  // FlippingBook-Grade 3D Physical Spine-Hinged Page Turn State ('idle' | 'flipping-next' | 'flipping-prev')
  const [flipState, setFlipState] = useState('idle');
  const [targetDate, setTargetDate] = useState(null);
  const pendingTurnRef = useRef(null);
  const flipTimerRef = useRef(null);

  // Two-Fold Mobile Switcher State ('side1' | 'side2')
  // P11 — one sheet, two sides. Only ever one is visible; you turn it over.
  const [mobileFold, setMobileFold] = useState('side1');
  const [mobileFlip, setMobileFlip] = useState(false);
  const [closureOfferedFor, setClosureOfferedFor] = useState(null);

  // 24px Universal Grid Cadence Height Snapper for Embossed Notebook Canvas
  const [snappedNotebookHeight, setSnappedNotebookHeight] = useState(null);
  const mainStageRef = useRef(null);

  useEffect(() => {
    const updateNotebookCadenceHeight = () => {
      if (!mainStageRef.current) return;
      const stageStyle = getComputedStyle(mainStageRef.current);
      const avail = mainStageRef.current.clientHeight - parseFloat(stageStyle.paddingTop) - parseFloat(stageStyle.paddingBottom);
      if (avail > 100) {
        // Snap canvas height H to strict multiple of 24px so the bottom footer border-t falls exactly on grid lines
        const snapped = Math.max(240, Math.floor(avail / 24) * 24);
        setSnappedNotebookHeight(snapped);
      }
    };

    updateNotebookCadenceHeight();
    const stage = mainStageRef.current;
    const observer = new ResizeObserver(updateNotebookCadenceHeight);
    if (stage) observer.observe(stage);
    window.addEventListener('resize', updateNotebookCadenceHeight);
    return () => { observer.disconnect(); window.removeEventListener('resize', updateNotebookCadenceHeight); };
  }, [activeView, showCover]);

  // Hash Navigation Sync for Overview / Landing Page
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash && ['#overview', '#anatomy', '#audience', '#performance', '#methods', '#gallery', '#privacy', '#pricing'].includes(window.location.hash)) {
        setActiveView('landing');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

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
    activeVolumeId,
    activeVolume,
    volumes,
    switchVolume
  } = useJournalStorage();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDecisionLogOpen, setIsDecisionLogOpen] = useState(false);
  const [isClosureModalOpen, setIsClosureModalOpen] = useState(false);
  const [isDayConditionOpen, setIsDayConditionOpen] = useState(false);
  const [dayConditionDismissedFor, setDayConditionDismissedFor] = useState(null);
  const [isScratchpadOpen, setIsScratchpadOpen] = useState(false);

  // Executive Thought Dictation Hook (Cmd+Shift+V)
  const {
    isListening,
    interimTranscript,
    finalTranscript,
    audioLevel,
    targetSection: dictationTarget,
    setTargetSection: setDictationTarget,
    stopDictation,
    toggleDictation
  } = useExecutiveDictation({
    isMuted: settings?.isMuted,
    onTranscriptionCommit: ({ text, target }) => {
      if (!text || !text.trim()) return;
      telemetry.track('dictation_completed', { target_section: target, word_count: text.trim().split(/\s+/).length });
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
    enabled: activeView !== 'landing'
  });

  // Dark mode class sync on load
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  // Viewport scroll locking: locked inside app, natural vertical scrolling on marketing landing page
  useEffect(() => {
    if (activeView === 'landing') {
      document.documentElement.classList.remove('app-locked');
      document.body.classList.remove('app-locked');
      document.documentElement.classList.add('landing-page-active');
      document.body.classList.add('landing-page-active');
    } else {
      document.documentElement.classList.remove('landing-page-active');
      document.body.classList.remove('landing-page-active');
      document.documentElement.classList.add('app-locked');
      document.body.classList.add('app-locked');
    }
    telemetry.setCurrentView(activeView);
  }, [activeView]);

  // Frame-Accurate Page Turn Completion (Immune to React closure stales)
  const completeFlip = (target) => {
    if (flipTimerRef.current) {
      clearTimeout(flipTimerRef.current);
      flipTimerRef.current = null;
    }
    const dateToSet = target || pendingTurnRef.current;
    if (dateToSet) {
      setCurrentDate(dateToSet);
      pendingTurnRef.current = null;
    }
    setFlipState('idle');
    setTargetDate(null);
  };

  // Frame-Accurate 3D Book Opening Handler
  const handleOpenJournal = () => {
    if (coverAnimation !== 'idle') return;
    playSound('book-open', settings.isMuted);
    setCurrentDate(new Date());
    setCoverAnimation('opening');

    if (coverTimerRef.current) {
      clearTimeout(coverTimerRef.current);
    }
    coverTimerRef.current = setTimeout(() => {
      completeCoverOpen();
    }, 580);
  };

  const completeCoverOpen = () => {
    if (coverTimerRef.current) {
      clearTimeout(coverTimerRef.current);
      coverTimerRef.current = null;
    }
    setShowCover(false);
    setCoverAnimation('idle');
  };

  // Frame-Accurate 3D Book Closing Handler
  const handleCloseJournal = () => {
    if (coverAnimation !== 'idle') return;
    playSound('book-close', settings.isMuted);
    setShowCover(true);
    setCoverAnimation('closing');

    if (coverTimerRef.current) {
      clearTimeout(coverTimerRef.current);
    }
    coverTimerRef.current = setTimeout(() => {
      completeCoverClose();
    }, 580);
  };

  const completeCoverClose = () => {
    if (coverTimerRef.current) {
      clearTimeout(coverTimerRef.current);
      coverTimerRef.current = null;
    }
    setCoverAnimation('idle');
  };

  const handleToggleCover = () => {
    if (showCover) {
      handleOpenJournal();
    } else {
      handleCloseJournal();
    }
  };

  // FlippingBook-Grade 3D Physical Page Turn Handler (Spine-Hinged 50% Page Sheet)
  const handleStepDay = (delta, directTargetDate = null) => {
    if (flipState !== 'idle') return; // Prevent double trigger during turn

    const newDate = directTargetDate ? new Date(directTargetDate) : new Date(currentDate);
    if (!directTargetDate) {
      newDate.setDate(newDate.getDate() + delta);
    }

    playSound('page', settings.isMuted);

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    if (isMobile) {
      setMobileFlip(true);
      setCurrentDate(newDate);
      setTimeout(() => setMobileFlip(false), 560);
      return;
    }

    // Desktop: Spine-hinged 3D turning leaf across center spine
    if (flipTimerRef.current) {
      clearTimeout(flipTimerRef.current);
    }
    const state = delta >= 0 ? 'flipping-next' : 'flipping-prev';
    pendingTurnRef.current = newDate;
    setTargetDate(newDate);
    setFlipState(state);

    // Reliable fallback cleanup at 750ms (CSS animation is 0.72s = 720ms)
    flipTimerRef.current = setTimeout(() => {
      completeFlip(newDate);
    }, 750);
  };

  /**
   * P11/P12 — turning the sheet over.
   *
   * The turn to the verso is the day-closure gesture. P4 kept day closure but
   * gave it no physical act; this is the act. It fires once per day, and only
   * when there is something to close, so the ritual never nags an empty page.
   */
  const handleMobileFoldSwitch = (fold) => {
    if (mobileFold === fold) return;
    playSound('page', settings.isMuted);
    setMobileFlip(true);
    setMobileFold(fold);
    setTimeout(() => setMobileFlip(false), 560);

    const turningToVerso = fold === 'side2';
    const hasSomethingToClose = getFrameworkItems(dailyLog).length > 0;
    const alreadyClosedToday = !!dailyLog.closedAt || closureOfferedFor === dateKey;
    if (turningToVerso && hasSomethingToClose && !alreadyClosedToday && dateKey === todayKey) {
      setClosureOfferedFor(dateKey);
      setTimeout(() => setIsClosureModalOpen(true), 620);
    }
  };

  // Executive Universal Keyboard Shortcuts & Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeView === 'landing') return;
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
      
      if (e.key === 'ArrowLeft' || e.key === 'h') {
        handleStepDay(-1);
      } else if (e.key === 'ArrowRight' || e.key === 'l') {
        handleStepDay(1);
      } else if (e.key === '1') {
        playSound('page', settings.isMuted);
        if (showCover) handleOpenJournal();
        setActiveView('daily');
      } else if (e.key === '2') {
        playSound('page', settings.isMuted);
        if (showCover) handleOpenJournal();
        setActiveView('monthly');
      } else if (e.key === '3') {
        playSound('page', settings.isMuted);
        if (showCover) handleOpenJournal();
        setActiveView('yearly');
      } else if (e.key === 'c' || e.key === 'C') {
        handleToggleCover();
      } else if (e.key === 't' || e.key === 'T') {
        playSound('page', settings.isMuted);
        if (showCover) handleOpenJournal();
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
      } else if ((e.metaKey || e.ctrlKey) && ['1', '2', '3', '4'].includes(e.key)) {
        e.preventDefault();
        const volIdx = parseInt(e.key, 10) - 1;
        if (volumes[volIdx]) {
          playSound('page', settings.isMuted);
          switchVolume(volumes[volIdx].id);
        }
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
  }, [activeView, currentDate, flipState, showCover, settings.isMuted, volumes, switchVolume, toggleDictation]);

  // Teleportation to specific page from Omnisearch
  const handleTeleportToPage = (dateObj) => {
    if (showCover) {
      completeCoverOpen();
    }
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

  // Keys
  const dateKey = formatDateKey(currentDate);
  const todayKey = formatDateKey(new Date());
  const isPastDay = dateKey < todayKey;
  const monthKey = dateKey.slice(0, 7); // "YYYY-MM"

  // Target date calculations (for turning leaf and underlying spread during transition)
  const targetDateKey = targetDate ? formatDateKey(targetDate) : null;
  const targetDailyLog = targetDateKey ? getDailyLog(targetDateKey) : null;
  const targetFramework = targetDailyLog?.activeFramework || settings.activeFramework || 'rule_of_3';

  // Current Logs
  const dailyLog = getDailyLog(dateKey);
  const monthlyLog = getMonthlyLog(monthKey);

  // Active Productivity Framework (Rule of 3 / Eisenhower Matrix / Ivy Lee Method)
  const activeFramework = dailyLog.activeFramework || settings.activeFramework || 'rule_of_3';

  // Productivity metrics
  const { dailyMetrics, categoryDistribution, streak, monthlyStats } = useProductivity(
    dailyLog,
    data.dailyLogs,
    monthKey
  );

  // Discreet Ambient Cognitive Nudges & Local Reminders
  const {
    needsClosureGlow
  } = useAmbientReminders({
    currentDate,
    dailyLog,
    settings,
    onTriggerClosureModal: () => setIsClosureModalOpen(true)
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
    if (activeView !== 'daily') return;
    if (dateKey !== todayKey) return;
    if (dailyLog.dayCondition || dailyLog.activeFramework) return;
    if (dayConditionDismissedFor === dateKey) return;
    setIsDayConditionOpen(true);
  }, [activeView, dateKey, todayKey, dailyLog.dayCondition, dailyLog.activeFramework, dayConditionDismissedFor]);

  // R7 — planned-versus-actual accounting, stored per decided item.
  const handleUpdateExecution = (itemId, session) => {
    saveDailyLog(dateKey, {
      execution: { ...(dailyLog.execution || {}), [itemId]: session }
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

  const handleUpdateRapidLog = (updatedRapidLog) => {
    telemetry.track('rapid_log_created', { count: updatedRapidLog.length });
    saveDailyLog(dateKey, { rapidLog: updatedRapidLog });
  };

  const handleUpdateReflection = (newReflection) => {
    telemetry.track('reflection_saved', { char_count: (newReflection?.text || '').length });
    saveDailyLog(dateKey, { reflection: newReflection });
  };

  // Handlers for Monthly Log
  const handleUpdateMonthlyLog = (updatedMonthlyLog) => {
    saveMonthlyLog(monthKey, updatedMonthlyLog);
  };

  const refreshLicense = () => {
    setLicense(getStoredLicense());
  };

  const handleSelectBreakerMonth = (monthIdx) => {
    setSelectedBreakerMonth(monthIdx);
    setActiveView('breaker');
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

  const handleOpenTodayFromBreaker = (monthIdx) => {
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

  const paperToneClass = settings.paperTone === 'cream'
    ? 'paper-tone-cream'
    : settings.paperTone === 'washi'
      ? 'paper-tone-washi'
      : '';

  const inkClass = settings.inkColor === 'oxblood'
    ? 'ink-oxblood'
    : settings.inkColor === 'konpeki'
      ? 'ink-konpeki'
      : settings.inkColor === 'sepia'
        ? 'ink-sepia'
        : '';

  const effectiveSettings = { ...settings, paperStyle: effectivePaperStyle };

  // Single-Page Marketing Website Route (Natural Window Scrolling)
  if (activeView === 'landing') {
    return (
      <div className="w-full min-h-screen selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-neutral-900">
        <MarketingLandingPage
          onLaunchJournal={() => {
            playSound('page', settings.isMuted);
            const url = new URL(window.location.href);
            url.searchParams.set('view', 'daily');
            url.hash = '';
            window.history.replaceState({}, '', url);
            window.scrollTo({ top: 0, behavior: 'instant' });
            setActiveView('daily');
          }}
          onOpenUpgrade={() => setIsUpgradeModalOpen(true)}
          settings={settings}
          updateSettings={updateSettings}
          isPatron={license.isPatron}
        />
        <PatronUpgradeModal
          isOpen={isUpgradeModalOpen}
          onClose={() => setIsUpgradeModalOpen(false)}
          isMuted={settings.isMuted}
          onLicenseUpdated={refreshLicense}
          currentLicense={license}
        />
      </div>
    );
  }

  return (
    <div className={`h-screen max-h-screen overflow-hidden bg-[#EAEAE7] dark:bg-[#0B0B0D] text-neutral-900 dark:text-neutral-100 p-2 sm:p-3 flex flex-col kindle-turn-container font-sans`}>
      
      {/* Floating Header Toolbar: Minimalist Single Bar with Framework Selector & Settings */}
      <HeaderToolbar
        activeView={activeView}
        setActiveView={setActiveView}
        settings={effectiveSettings}
        updateSettings={updateSettings}
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
        onOpenMenu={() => setIsMenuOpen(true)}
        activeFramework={activeFramework}
        onSelectFramework={handleSelectFramework}
        score={dailyMetrics.score}
        showCover={showCover}
        onToggleCover={handleToggleCover}
        isPatron={license.isPatron}
        onOpenUpgrade={() => setIsUpgradeModalOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onLockVault={triggerHardLock}
        onOpenDecisions={() => setIsDecisionLogOpen(true)}
        decisionsCount={decisions?.length || 0}
        onOpenClosure={() => setIsClosureModalOpen(true)}
        onToggleDictation={toggleDictation}
        isListening={isListening}
      />

      {/* Closed Notebook Cover (Single Minimalist Stationery Notepad Centered on Viewport) */}
      {showCover ? (
        <div className={`w-full max-w-[412px] md:max-w-[420px] mx-auto flex-1 min-h-0 flex flex-col justify-center items-center relative pt-5 sm:pt-6 pb-12 sm:pb-0 ${
          coverAnimation === 'opening' 
            ? 'cover-opening-transition pointer-events-none' 
            : coverAnimation === 'closing' 
              ? 'cover-closing-transition' 
              : 'animate-in fade-in zoom-in-98 duration-200'
        }`}>
          <InteractiveNotebookCover
            ownerName={settings.ownerName || 'Maulik'}
            onUpdateOwnerName={(name) => updateSettings({ ownerName: name })}
            currentDate={currentDate}
            onOpenJournal={handleOpenJournal}
            activeVolume={activeVolume}
            volumes={volumes}
            onSelectVolume={switchVolume}
          />
        </div>
      ) : (
        /* Open Notebook 2-Page Spread (Bi-Fold Desktop / Two-Fold Mobile) */
        <main ref={mainStageRef} className={`w-full max-w-[412px] md:max-w-[960px] mx-auto flex-1 min-h-0 flex flex-col justify-center print-page transition-all pb-12 sm:pb-0 relative pt-5 sm:pt-6 stage-book-open flippingbook-stage ${
          coverAnimation === 'opening' ? 'book-spread-reveal' : ''
        }`}>
            
            {/* Floating Page-Turn Edge Trigger: Previous Day (Left Edge) */}
            <button
              type="button"
              onClick={() => handleStepDay(-1)}
              className="page-turn-edge-btn page-turn-edge-left no-print hidden sm:flex"
              title="Previous day (or press ← Arrow)"
              aria-label="Previous Day"
            >
              <ChevronLeft className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>

            {/* Floating Page-Turn Edge Trigger: Next Day (Right Edge) */}
            <button
              type="button"
              onClick={() => handleStepDay(1)}
              className="page-turn-edge-btn page-turn-edge-right no-print hidden sm:flex"
              title="Next day (or press → Arrow)"
              aria-label="Next Day"
            >
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>

            {/* Authentic Japanese Stationery Paper Block Canvas */}
            <div 
              style={snappedNotebookHeight ? { height: `${snappedNotebookHeight}px`, maxHeight: `${snappedNotebookHeight}px` } : undefined}
              className={`relative ${paperClass} ${paperToneClass} ${inkClass} rounded-[20px] p-6 embossed-notebook w-full flex-shrink-0 flex flex-col justify-between transition-all`}
            >
              {/* Authentic Folded Woven Twill Brand Tag (Tucked under paper edge) */}
              <button
                type="button"
                onClick={() => {
                  playSound('click', settings.isMuted);
                  setIsMenuOpen(true);
                }}
                className="woven-fabric-tag cursor-pointer"
                title="Decide One Executive Instrument (Click to open menu)"
              >
                DECIDE ONE
              </button>

              {/* Discreet Ambient Gold Spine Glow (Lights up past 6 PM if Top 3 uncompleted) */}
              <SpineAmbientGlow
                show={needsClosureGlow}
                onClick={() => setIsClosureModalOpen(true)}
              />

            <div className="relative z-10 flex-1 min-h-0 flex flex-col overflow-hidden">
              {activeView === 'daily' ? (
                <div className="flex-1 min-h-0 flex flex-col">

                  {/* One sheet, one side at a time (P11). No spread at any width. */}
                  <div className="flex-1 min-h-0 w-full flex flex-col gap-0 overflow-hidden">

                    {/* Left Page: Productivity Framework & Execution */}
                    <div className={`flex-1 min-w-0 min-h-0 flex flex-col border-white/[0.08] bifold-left-page overflow-hidden ${
                      mobileFold === 'side1' ? 'flex' : 'hidden'
                    } ${mobileFlip && mobileFold === 'side1' ? 'mobile-fold-turn' : ''}`}>
                      <LeftPage
                        date={flipState === 'flipping-prev' && targetDate ? targetDate : currentDate}
                        dailyLog={flipState === 'flipping-prev' && targetDailyLog ? targetDailyLog : dailyLog}
                        activeFramework={flipState === 'flipping-prev' && targetFramework ? targetFramework : activeFramework}
                        onSelectFramework={handleSelectFramework}
                        hardTasks={flipState === 'flipping-prev' && targetDailyLog ? targetDailyLog.hardTasks : dailyLog.hardTasks}
                        onUpdateHardTasks={handleUpdateHardTasks}
                        frameworkData={flipState === 'flipping-prev' && targetDailyLog ? targetDailyLog.frameworkData : dailyLog.frameworkData}
                        onUpdateFrameworkData={handleUpdateFrameworkData}
                        rapidLog={flipState === 'flipping-prev' && targetDailyLog ? targetDailyLog.rapidLog : dailyLog.rapidLog}
                        onUpdateRapidLog={handleUpdateRapidLog}
                        onUpdateExecution={handleUpdateExecution}
                        activeFilter={activeFilter}
                        setActiveFilter={setActiveFilter}
                        settings={settings}
                        updateSettings={updateSettings}
                        isPastDay={flipState === 'flipping-prev' ? targetDateKey < todayKey : isPastDay}
                        onStepDay={handleStepDay}
                        setCurrentDate={setCurrentDate}
                        isInteractive={flipState === 'idle' && coverAnimation === 'idle'}
                      />
                    </div>

                    {/* Right Page: the execution layer (R2) */}
                    <div className={`flex-1 min-w-0 min-h-0 flex flex-col bifold-right-page extension-booklet-paper overflow-hidden ${
                      mobileFold === 'side2' ? 'flex' : 'hidden'
                    } ${mobileFlip && mobileFold === 'side2' ? 'mobile-fold-turn' : ''}`}>
                      <RightPage
                        date={flipState === 'flipping-next' && targetDate ? targetDate : currentDate}
                        dailyLog={flipState === 'flipping-next' && targetDailyLog ? targetDailyLog : dailyLog}
                        onCloseDay={() => setIsClosureModalOpen(true)}
                        paperLabel={paperLabel}
                        settings={settings}
                        updateSettings={updateSettings}
                        onStepDay={handleStepDay}
                        setCurrentDate={setCurrentDate}
                        isInteractive={flipState === 'idle' && coverAnimation === 'idle'}
                        onOpenVictoryCard={() => setIsVictoryCardOpen(true)}
                      />
                    </div>

                  </div>

                </div>
              ) : activeView === 'weekly' ? (
                /* Sunday Executive Review & Weekly Alignment Spread */
                <WeeklyReviewSpread
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
                />
              ) : activeView === 'monthly' ? (
                /* Monthly Log Spread */
                <MonthlyLogSpread
                  currentDate={currentDate}
                  setCurrentDate={setCurrentDate}
                  monthlyLog={monthlyLog}
                  onUpdateMonthlyLog={handleUpdateMonthlyLog}
                  isMuted={settings.isMuted}
                />
              ) : activeView === 'yearly' ? (
                /* 12-Month Annual Index Spread */
                <YearlyViewSpread
                  currentDate={currentDate}
                  setCurrentDate={setCurrentDate}
                  onSelectMonth={handleSelectBreakerMonth}
                  onOpenToday={handleOpenTodayFromIndex}
                  isMuted={settings.isMuted}
                />
              ) : activeView === 'breaker' ? (
                /* Bespoke Monthly Chapter Breaker Spread */
                <MonthlyBreakerPage
                  monthIndex={selectedBreakerMonth}
                  year={currentDate.getFullYear()}
                  onOpenToday={handleOpenTodayFromBreaker}
                  onOpenMonthlyLog={() => setActiveView('monthly')}
                  onBackToYearly={() => setActiveView('yearly')}
                  isMuted={settings.isMuted}
                />
              ) : (
                /* Fallback Monthly Spread */
                <MonthlyLogSpread
                  currentDate={currentDate}
                  setCurrentDate={setCurrentDate}
                  monthlyLog={monthlyLog}
                  onUpdateMonthlyLog={handleUpdateMonthlyLog}
                  isMuted={settings.isMuted}
                />
              )}
            </div>

            {/* FlippingBook-Grade 3D Spine-Hinged Turning Page Sheet (Mounted exclusively on desktop during flip) */}
            {activeView === 'daily' && flipState !== 'idle' && targetDate && (
              <div 
                className={`page-leaf-container ${flipState === 'flipping-next' ? 'leaf-turn-next' : 'leaf-turn-prev'}`}
                onAnimationEnd={(e) => {
                  if (e.target === e.currentTarget) {
                    completeFlip(targetDate);
                  }
                }}
              >
                <PageTurnLeaf
                  direction={flipState === 'flipping-next' ? 'leaf-turn-next' : 'leaf-turn-prev'}
                  currentDate={currentDate}
                  targetDate={targetDate}
                  currentDailyLog={dailyLog}
                  targetDailyLog={targetDailyLog}
                  currentFramework={activeFramework}
                  targetFramework={targetFramework}
                  onSelectFramework={handleSelectFramework}
                  onUpdateHardTasks={handleUpdateHardTasks}
                  onUpdateFrameworkData={handleUpdateFrameworkData}
                  onUpdateRapidLog={handleUpdateRapidLog}
                  activeFilter={activeFilter}
                  setActiveFilter={setActiveFilter}
                  paperClass={paperClass}
                  paperLabel={paperLabel}
                  settings={settings}
                  updateSettings={updateSettings}
                  onStepDay={handleStepDay}
                  setCurrentDate={setCurrentDate}
                  todayKey={todayKey}
                />
              </div>
            )}

          </div>
        </main>
      )}

      {/* Mobile Ergonomic Bottom Thumb-Zone Navigation Bar */}
      {activeView === 'daily' && !showCover && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#141416]/95 backdrop-blur-xl border-t border-black/[0.08] dark:border-white/[0.1] px-4 py-2 flex items-center justify-around no-print">
          {[
            { id: 'side1', label: 'Decide' },
            { id: 'side2', label: 'Turn over' }
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
      <UnifiedMenuModal
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        settings={settings}
        updateSettings={updateSettings}
        activeFramework={activeFramework}
        onSelectFramework={handleSelectFramework}
        onExport={exportJSON}
        onOpenGuide={() => setIsHelpOpen(true)}
        onOpenLanding={() => setActiveView('landing')}
        onOpenVictoryCard={() => {
          setIsMenuOpen(false);
          setIsVictoryCardOpen(true);
        }}
        onOpenGiftModal={() => {
          setIsMenuOpen(false);
          setIsGiftModalOpen(true);
        }}
        onViewCover={handleCloseJournal}
        isPatron={license.isPatron}
        onOpenUpgrade={() => setIsUpgradeModalOpen(true)}
        onExportMarkdown={() => downloadMarkdownVault(data, settings)}
        onPrintAnnual={() => printAnnualBook(data, settings, currentDate.getFullYear())}
        onPrintWeeklyBriefing={handlePrintWeeklyBriefing}
        onExportEncryptedVault={handleExportEncryptedVault}
        onImportEncryptedVault={handleImportEncryptedVault}
        activeVolumeId={activeVolumeId}
        volumes={volumes}
        onSwitchVolume={(volId) => {
          if (!license.isPatron && volId !== 'vol_strategy') {
            setIsMenuOpen(false);
            setIsUpgradeModalOpen(true);
          } else {
            switchVolume(volId);
          }
        }}
      />

      {/* Sub-Millisecond Omnisearch & Command Palette Modal (Cmd+K) */}
      <OmniSearchModal
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
      />

      {/* Executive Biometric / Privacy Shutter Overlay */}
      <ExecutivePrivacyOverlay
        shutterState={shutterState}
        ownerName={settings.ownerName}
        onResumeFromSoftFrost={resumeActive}
        onUnlockVault={unlockVaultManually}
        isMuted={settings.isMuted}
        activeVolume={activeVolume}
        volumes={volumes}
        currentDate={currentDate}
        settings={settings}
        updateSettings={updateSettings}
      />

      {/* Lifetime Patron Upgrade & Activation Modal */}
      <PatronUpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        isMuted={settings.isMuted}
        onLicenseUpdated={refreshLicense}
        currentLicense={license}
      />

      {/* Analytics Drawer (Monochrome) */}
      <ProductivityDrawer
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        dailyMetrics={dailyMetrics}
        categoryDistribution={categoryDistribution}
        monthlyStats={monthlyStats}
        reflection={dailyLog.reflection}
      />

      {/* About Decide One & 9-model methodology guide modal */}
      <QuickLegendModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {/* Daily Victory Card Modal (Viral Loop / Aesthetic Accomplishment Snapshot) */}
      <DailyVictoryCardModal
        isOpen={isVictoryCardOpen}
        onClose={() => setIsVictoryCardOpen(false)}
        date={currentDate}
        tasks={dailyLog?.hardTasks || []}
        activeFrameworkName={FRAMEWORKS.find(f => f.id === activeFramework)?.name || 'Top 3'}
        isMuted={settings.isMuted}
        ownerName={settings.ownerName}
      />

      {/* Peer Gift Referral Modal (Viral Peer Invitation Engine) */}
      <GiftAccessModal
        isOpen={isGiftModalOpen}
        onClose={() => setIsGiftModalOpen(false)}
        ownerName={settings.ownerName}
        isMuted={settings.isMuted}
      />

      {/* Executive Decision Ledger Modal (Cmd+D) */}
      <ExecutiveDecisionLogModal
        isOpen={isDecisionLogOpen}
        onClose={() => setIsDecisionLogOpen(false)}
        decisions={decisions}
        onAddDecision={addDecision}
        onUpdateDecision={updateDecision}
        onDeleteDecision={deleteDecision}
        isMuted={settings.isMuted}
      />

      {/* Executive Evening Closure Ritual Modal */}
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

      <ExecutiveClosureRitualModal
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
      />

      {/* Executive Voice HUD Horological Capsule */}
      <ExecutiveVoiceHUD
        isListening={isListening}
        interimTranscript={interimTranscript}
        finalTranscript={finalTranscript}
        audioLevel={audioLevel}
        targetSection={dictationTarget}
        onSelectTarget={setDictationTarget}
        onStop={stopDictation}
      />

      {/* Quick Thought Scratchpad Modal (Cmd+N) */}
      <ExecutiveScratchpadModal
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
      />

    </div>
  );
}
