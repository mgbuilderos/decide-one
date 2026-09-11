import React, { useState } from 'react';
import { BookOpen, Sparkles, Edit2, Check, Bookmark } from 'lucide-react';
import { MONTH_ILLUSTRATIONS } from '../data/monthIllustrations';

/**
 * NotebookCoverFrontFace:
 * Pure visual render of the warm cream cardstock minimalist stationery cover.
 * Matches the reference photo (RODA Slim style stationery card with woven tab & monthly line art).
 * Shared by both the static closed cover and the 3D rotating cover leaf.
 */
export function NotebookCoverFrontFace({
  ownerName = 'Maulik',
  isEditingName = false,
  nameInput = '',
  setNameInput,
  handleSaveName,
  setIsEditingName,
  formattedMonth,
  year,
  formattedWeekday,
  dayOfMonth,
  currentDate,
  onOpenJournal,
  isInteractive = true,
  monogramStyle = 'gold',
  onToggleMonogram,
  giftFrom = null,
  activeVolume = null,
  volumes = [],
  onSelectVolume = null
}) {
  const dateObj = currentDate || new Date();
  const monthIndex = dateObj.getMonth();
  const monthData = MONTH_ILLUSTRATIONS[monthIndex] || MONTH_ILLUSTRATIONS[8];

  return (
    <div className="w-full h-full bg-white dark:bg-[#141416] text-neutral-900 dark:text-neutral-100 p-6 sm:p-8 rounded-[26px] flex flex-col justify-between items-center relative shadow-2xl embossed-notebook paper-block-edge border border-black/[0.08] dark:border-white/[0.08] select-none">
      
      {/* Authentic Sewn Woven Fabric Label at Top Center */}
      <div 
        className="woven-fabric-tag cursor-default"
        title="Decide One Priority Instrument"
      >
        DECIDE ONE
      </div>

      {/* Silk Volume Ribbon Tabs on Right Edge */}
      {isInteractive && volumes && volumes.length > 0 && (
        <div className="absolute -right-3 top-28 bottom-28 flex flex-col justify-center gap-2 z-20 pointer-events-auto">
          {volumes.map((vol) => {
            const isSel = vol.id === activeVolume?.id;
            return (
              <button
                key={vol.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectVolume?.(vol.id);
                }}
                title={`Volume ${vol.volumeNumber}: ${vol.name} — ${vol.subtitle}`}
                className={`w-6 h-9 rounded-r-lg border-y border-r flex items-center justify-center transition-all cursor-pointer shadow-xs hover:translate-x-1 ${
                  isSel
                    ? 'bg-neutral-900 border-neutral-950 text-amber-400 dark:bg-white dark:border-white dark:text-neutral-950 translate-x-0.5 font-bold'
                    : 'bg-[#EAE5DC] dark:bg-[#222226] border-black/10 dark:border-white/15 text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <span className="text-[9px] font-serif font-bold rotate-90 whitespace-nowrap">
                  {vol.volumeNumber}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Subtle Hairline Perimeter Inner Frame */}
      <div className="w-full h-full border border-black/[0.06] dark:border-white/[0.06] rounded-[20px] p-5 sm:p-6 flex flex-col justify-between items-center text-center relative">
        
        {/* Top Header Monogram */}
        <div className="flex flex-col items-center pt-1 sm:pt-2 gap-1.5">
          <span className="text-[10px] uppercase font-bold tracking-[0.28em] text-neutral-400 dark:text-neutral-500">
            The Priority Instrument
          </span>
        </div>

        {/* Center Minimalist Illustration & Typography */}
        <div className="my-auto py-2 flex flex-col items-center w-full">
          
          {/* Bespoke Vector Line Illustration for the Active Month */}
          <div 
            className="mb-4 text-neutral-800 dark:text-neutral-200 transition-transform duration-300 hover:scale-105"
            title={`${monthData?.name || formattedMonth} • ${monthData?.theme || 'Stationery'}`}
          >
            {monthData?.render ? (
              monthData.render("w-32 h-32 sm:w-36 sm:h-36 text-neutral-800 dark:text-neutral-200")
            ) : (
              <Sparkles className="w-8 h-8 text-neutral-400" />
            )}
          </div>

          {/* Month Name & Year */}
          <div className="flex flex-col items-center gap-0.5 mb-2">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-[0.16em] text-neutral-900 dark:text-white">
              {formattedMonth || monthData?.name}
            </h2>
            <span className="text-xs font-semibold tracking-widest text-neutral-400 dark:text-neutral-500 uppercase">
              {year}
            </span>
          </div>

          {/* Executive Personalized Monogram Seal */}
          <div className="flex flex-col items-center gap-1.5 mb-2.5 w-full">
            <button
              type="button"
              onClick={() => isInteractive && onToggleMonogram?.()}
              className={`inline-flex items-center justify-center w-8 h-8 rounded-full border border-black/10 dark:border-white/15 cursor-pointer transition-all hover:scale-105 shadow-2xs ${
                monogramStyle === 'blind' 
                  ? 'bg-black/[0.03] dark:bg-white/[0.04]' 
                  : 'bg-amber-500/[0.06] border-amber-600/25'
              }`}
              title="Click to toggle 24K Gold Foil / Blind Deboss Stamping"
            >
              <span className={`text-[11px] font-bold ${monogramStyle === 'blind' ? 'monogram-blind-deboss' : 'monogram-gold-foil'}`}>
                {(ownerName || 'M').split(' ').filter(Boolean).map(w => w[0].toUpperCase()).slice(0, 2).join('.')}
              </span>
            </button>

            {/* Owner Personalized Name */}
            <div className="flex items-center justify-center gap-2 w-full group">
              {isEditingName && isInteractive ? (
                <form onSubmit={handleSaveName} className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput?.(e.target.value)}
                    className="bg-black/[0.04] dark:bg-white/[0.08] text-neutral-900 dark:text-white font-bold text-base text-center px-3 py-1 rounded-lg border border-black/20 dark:border-white/30 focus:outline-none focus:border-neutral-900 dark:focus:border-white"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="p-1.5 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white bg-black/[0.05] dark:bg-white/[0.1] rounded-lg cursor-pointer transition-colors"
                    title="Save Name"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <div 
                  onClick={() => isInteractive && setIsEditingName?.(true)}
                  className={`flex items-center gap-1.5 ${isInteractive ? 'cursor-pointer hover:opacity-80' : 'cursor-default'} transition-opacity`}
                  title={isInteractive ? 'Click to personalize name' : undefined}
                >
                  <span className="text-sm font-semibold tracking-tight text-neutral-700 dark:text-neutral-300">
                    {ownerName}'s Decide One
                  </span>
                  {isInteractive && (
                    <Edit2 className="w-3 h-3 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors" />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Gift Ribbon Greeting if opened via a gifted link */}
          {giftFrom && (
            <div className="inline-flex items-center gap-1.5 bg-amber-400/15 border border-amber-500/30 text-amber-900 dark:text-amber-200 rounded-full px-3.5 py-1 text-[11px] font-serif italic mb-2 animate-in fade-in">
              <span>✨ A quiet day gifted by {giftFrom}</span>
            </div>
          )}

          {/* Poetic Seasonal Theme Badge (User-Centric & Mindful) */}
          <div className="inline-flex items-center gap-2 bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.08] dark:border-white/[0.1] rounded-full px-3.5 py-1 text-[11px] font-medium text-neutral-600 dark:text-neutral-400 tracking-wide mb-2">
            <span>{monthData?.theme || 'A Mindful Space for Daily Clarity'}</span>
          </div>

          {/* Date Stamp */}
          <div className="text-[11px] text-neutral-400 dark:text-neutral-500 tracking-wider">
            {formattedWeekday} • Day {dayOfMonth}
          </div>
        </div>

        {/* Bottom Open Action */}
        <div className="w-full pb-1">
          {isInteractive ? (
            <button
              type="button"
              onClick={onOpenJournal}
              className="w-full py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 active:scale-[0.99] transition-all shadow-md cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Open Decide One Instrument</span>
            </button>
          ) : (
            <div className="w-full py-3 px-4 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] text-neutral-600 dark:text-neutral-400 font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 border border-black/[0.06] dark:border-white/[0.08]">
              <BookOpen className="w-4 h-4" />
              <span>Decide One Priority Edition</span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

/**
 * NotebookCoverEndpaperFace:
 * Renders the inside front cover / archival endpaper with the debossed "Ex Libris" bookplate.
 * Used on the reverse face (rotateY(180deg)) of the 3D rotating cover leaf.
 */
export function NotebookCoverEndpaperFace({
  ownerName = 'Maulik',
  formattedMonth,
  year
}) {
  return (
    <div className="w-full h-full bg-white dark:bg-[#141416] text-neutral-900 dark:text-neutral-100 p-6 sm:p-8 rounded-[26px] flex flex-col justify-between items-center relative shadow-2xl embossed-notebook paper-block-edge border border-black/[0.08] dark:border-white/[0.08] select-none">
      
      {/* Subtle Inner Framing Border */}
      <div className="w-full h-full border border-black/[0.06] dark:border-white/[0.06] rounded-[20px] p-6 flex flex-col justify-between items-center text-center relative">
        
        {/* Top Header Monogram */}
        <div className="flex flex-col items-center pt-2">
          <div className="w-9 h-9 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center mb-2.5 bg-black/[0.02] dark:bg-white/[0.03]">
            <Bookmark className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
          </div>
          <span className="text-[9px] uppercase font-bold tracking-[0.3em] text-neutral-400 dark:text-neutral-500">
            Archival Endpaper
          </span>
        </div>

        {/* Center Ex Libris Bookplate */}
        <div className="flex flex-col items-center my-auto py-4 px-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white/70 dark:bg-black/30 w-full max-w-[280px] shadow-xs">
          <div className="text-[10px] uppercase font-extrabold tracking-[0.35em] text-neutral-700 dark:text-neutral-300 mb-1">
            EX LIBRIS
          </div>
          <div className="w-8 h-px bg-neutral-300 dark:bg-neutral-700 my-2" />
          <div className="text-[11px] italic text-neutral-500 dark:text-neutral-400 mb-1.5">
            This notebook belongs to
          </div>
          <div className="text-lg font-bold uppercase tracking-tight text-neutral-900 dark:text-white">
            {ownerName}
          </div>
          <div className="w-12 h-px bg-neutral-200 dark:bg-neutral-800 my-2.5" />
          <div className="text-[9px] uppercase font-semibold tracking-wider text-neutral-400 dark:text-neutral-500">
            Daily Priority Instrument • {year}
          </div>
        </div>

        {/* Bottom Pocket Sleeve Stitching */}
        <div className="w-full pt-3 border-t border-dashed border-black/[0.10] dark:border-white/[0.10] flex items-center justify-between text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-widest px-2">
          <span>Decide One Edition</span>
          <span>{formattedMonth}</span>
        </div>

      </div>

    </div>
  );
}

/**
 * InteractiveNotebookCover:
 * Self-contained interactive cover that handles name editing and opening action.
 */
export function InteractiveNotebookCover({
  ownerName = 'Maulik',
  onUpdateOwnerName,
  currentDate,
  onOpenJournal,
  activeVolume,
  volumes,
  onSelectVolume
}) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(ownerName);
  const [monogramStyle, setMonogramStyle] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('DECIDEONE_MONOGRAM_STYLE') || localStorage.getItem('PRIMACY_MONOGRAM_STYLE') || localStorage.getItem('POCKETBOOK_MONOGRAM_STYLE') || 'gold';
    }
    return 'gold';
  });

  const [giftFrom] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('giftFrom');
    }
    return null;
  });

  const toggleMonogram = () => {
    const next = monogramStyle === 'gold' ? 'blind' : 'gold';
    setMonogramStyle(next);
    try {
      localStorage.setItem('DECIDEONE_MONOGRAM_STYLE', next);
    } catch (e) {}
  };

  const dateObj = currentDate || new Date();
  const formattedMonth = dateObj.toLocaleDateString('en-US', { month: 'long' });
  const year = dateObj.getFullYear();
  const dayOfMonth = dateObj.getDate();
  const formattedWeekday = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

  const handleSaveName = (e) => {
    e?.preventDefault();
    if (nameInput.trim()) {
      onUpdateOwnerName?.(nameInput.trim());
    }
    setIsEditingName(false);
  };

  return (
    <NotebookCoverFrontFace
      ownerName={ownerName}
      isEditingName={isEditingName}
      nameInput={nameInput}
      setNameInput={setNameInput}
      handleSaveName={handleSaveName}
      setIsEditingName={setIsEditingName}
      formattedMonth={formattedMonth}
      year={year}
      formattedWeekday={formattedWeekday}
      dayOfMonth={dayOfMonth}
      currentDate={dateObj}
      onOpenJournal={onOpenJournal}
      isInteractive={true}
      monogramStyle={monogramStyle}
      onToggleMonogram={toggleMonogram}
      giftFrom={giftFrom}
      activeVolume={activeVolume}
      volumes={volumes}
      onSelectVolume={onSelectVolume}
    />
  );
}

/**
 * Standalone NotebookCover:
 * Rendered when the journal is in closed state.
 */
export default function NotebookCover({
  ownerName = 'Maulik',
  onUpdateOwnerName,
  currentDate,
  onOpenJournal,
  isMuted = false,
  activeVolume,
  volumes,
  onSelectVolume
}) {
  return (
    <div className="w-full max-w-[412px] md:max-w-[420px] mx-auto flex-1 min-h-0 flex flex-col justify-center items-center relative pt-5 sm:pt-6 pb-12 sm:pb-0 animate-in fade-in zoom-in-98 duration-200">
      <InteractiveNotebookCover
        ownerName={ownerName}
        onUpdateOwnerName={onUpdateOwnerName}
        currentDate={currentDate}
        onOpenJournal={onOpenJournal}
        activeVolume={activeVolume}
        volumes={volumes}
        onSelectVolume={onSelectVolume}
      />
    </div>
  );
}
