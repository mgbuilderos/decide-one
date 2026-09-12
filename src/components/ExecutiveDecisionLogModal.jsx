import React, { useState } from 'react';
import { 
  X, 
  Scale, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Sparkles, 
  Trash2, 
  Edit3, 
  ChevronRight,
  ShieldAlert,
  Sliders
} from 'lucide-react';
import { playSound } from '../utils/audio';

const MENTAL_MODELS = [
  { id: 'First Principles', label: 'First Principles', desc: 'Boil down to fundamental truths and reason up.' },
  { id: 'Inversion', label: 'Inversion', desc: 'Invert the problem: How could this fail catastrophically?' },
  { id: 'Second-Order', label: 'Second-Order Thinking', desc: 'And then what? Long-term systemic ripple effects.' },
  { id: 'Regret Minimization', label: 'Regret Minimization', desc: 'At age 80, will I regret not taking this path?' },
  { id: 'Margin of Safety', label: 'Margin of Safety', desc: 'Tolerance for error, downside protection.' },
  { id: 'Opportunity Cost', label: 'Opportunity Cost', desc: 'What irreplaceable priority am I sacrificing?' }
];

const STAKE_LEVELS = [
  { id: 'Strategic', label: 'Strategic', color: 'text-neutral-700 dark:text-neutral-300 bg-neutral-500/10' },
  { id: 'Critical', label: 'Critical', color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10' },
  { id: 'High', label: 'High Stakes', color: 'text-red-600 dark:text-red-400 bg-red-500/10' }
];

export default function ExecutiveDecisionLogModal({
  isOpen,
  onClose,
  decisions = [],
  onAddDecision,
  onUpdateDecision,
  onDeleteDecision,
  isMuted = false
}) {
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'create' | 'review'
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'pending' | 'reviewed'
  const [selectedDecision, setSelectedDecision] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [context, setContext] = useState('');
  const [mentalModel, setMentalModel] = useState('First Principles');
  const [stake, setStake] = useState('Critical');
  const [confidence, setConfidence] = useState(85);
  const [reviewDays, setReviewDays] = useState(30);
  const [prediction, setPrediction] = useState('');
  const [retrospectiveText, setRetrospectiveText] = useState('');

  if (!isOpen) return null;

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    playSound('check', isMuted);
    const reviewDate = new Date();
    reviewDate.setDate(reviewDate.getDate() + Number(reviewDays));
    const y = reviewDate.getFullYear();
    const m = String(reviewDate.getMonth() + 1).padStart(2, '0');
    const d = String(reviewDate.getDate()).padStart(2, '0');

    onAddDecision?.({
      title: title.trim(),
      context: context.trim(),
      mentalModel,
      stake,
      confidence: Number(confidence),
      reviewDate: `${y}-${m}-${d}`,
      prediction: prediction.trim()
    });

    setTitle('');
    setContext('');
    setPrediction('');
    setActiveTab('list');
  };

  const handleSaveRetrospective = (decisionId) => {
    if (!retrospectiveText.trim()) return;
    playSound('check', isMuted);
    onUpdateDecision?.(decisionId, {
      status: 'reviewed',
      retrospective: retrospectiveText.trim()
    });
    setSelectedDecision(null);
    setRetrospectiveText('');
  };

  const filteredDecisions = decisions.filter(d => {
    if (filterStatus === 'pending') return d.status === 'pending';
    if (filterStatus === 'reviewed') return d.status === 'reviewed';
    return true;
  });

  return (
    <div className="fixed inset-0 z-[115] flex items-center justify-center p-3 sm:p-5 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-in fade-in select-none">
      
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Stage */}
      <div 
        className="relative z-10 w-full max-w-2xl bg-white dark:bg-[#141416] text-neutral-900 dark:text-neutral-100 rounded-3xl shadow-2xl border border-black/[0.12] dark:border-white/[0.12] flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="h-14 px-5 sm:px-6 flex items-center justify-between border-b border-black/[0.08] dark:border-white/[0.08] shrink-0 bg-black/[0.015] dark:bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 flex items-center justify-center shadow-xs">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-2">
                <span>Decision Log</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-neutral-500 dark:text-neutral-400 font-semibold">
                  {decisions.length} Logged
                </span>
              </div>
              <div className="text-[10px] text-neutral-500">
                Mental models, confidence calibration & 30/90-day retrospectives
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                playSound('click', isMuted);
                setActiveTab(activeTab === 'create' ? 'list' : 'create');
              }}
              className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              {activeTab === 'create' ? (
                <span>View Ledger</span>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Log Decision</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                playSound('click', isMuted);
                onClose();
              }}
              className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          
          {activeTab === 'create' ? (
            /* Tab: Create New Decision */
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block">
                  Decision Title & Core Hypothesis
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Pivot runtime architecture to 100% on-device local silicon"
                  className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-black/[0.12] dark:border-white/[0.15] bg-black/[0.02] dark:bg-white/[0.03] text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block">
                  Context & Strategic Trade-off
                </label>
                <textarea
                  rows={3}
                  value={context}
                  onChange={e => setContext(e.target.value)}
                  placeholder="What is the problem? What alternatives are being rejected, and why?"
                  className="w-full px-3.5 py-2 text-xs font-normal leading-relaxed rounded-xl border border-black/[0.12] dark:border-white/[0.15] bg-black/[0.02] dark:bg-white/[0.03] text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors resize-none"
                />
              </div>

              {/* Mental Model Selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block">
                  Governing Mental Model
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {MENTAL_MODELS.map(model => (
                    <button
                      key={model.id}
                      type="button"
                      onClick={() => {
                        playSound('click', isMuted);
                        setMentalModel(model.id);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        mentalModel === model.id
                          ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900 shadow-xs'
                          : 'border-black/[0.08] dark:border-white/[0.1] bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/[0.04] dark:hover:bg-white/[0.05] text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      <span className="text-[11px] font-bold block">{model.label}</span>
                      <span className="text-[9px] opacity-70 block mt-0.5 leading-tight">{model.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Row: Stake Level & Confidence Slider */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* Stakes */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block">
                    Stake Level
                  </label>
                  <div className="flex gap-2">
                    {STAKE_LEVELS.map(s => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          playSound('click', isMuted);
                          setStake(s.id);
                        }}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                          stake === s.id
                            ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900'
                            : 'border-black/[0.08] dark:border-white/[0.1] text-neutral-600 dark:text-neutral-400 hover:bg-black/[0.03]'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Confidence Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                      Confidence Calibration
                    </label>
                    <span className="text-xs font-bold text-neutral-900 dark:text-white">
                      {confidence}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    step="5"
                    value={confidence}
                    onChange={e => setConfidence(e.target.value)}
                    className="w-full accent-neutral-900 dark:accent-white cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-neutral-500">
                    <span>50% (Coin Toss)</span>
                    <span>75% (Strong Edge)</span>
                    <span>100% (Certainty)</span>
                  </div>
                </div>
              </div>

              {/* Row: Review Cadence & Prediction */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block">
                    Retrospective Review Trigger
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { days: 14, label: '14 Days' },
                      { days: 30, label: '30 Days' },
                      { days: 90, label: '90 Days' },
                      { days: 180, label: '6 Mos' }
                    ].map(r => (
                      <button
                        key={r.days}
                        type="button"
                        onClick={() => {
                          playSound('click', isMuted);
                          setReviewDays(r.days);
                        }}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                          reviewDays === r.days
                            ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900'
                            : 'border-black/[0.08] dark:border-white/[0.1] text-neutral-600 dark:text-neutral-400 hover:bg-black/[0.03]'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block">
                    Falsifiable Prediction
                  </label>
                  <input
                    type="text"
                    value={prediction}
                    onChange={e => setPrediction(e.target.value)}
                    placeholder="What evidence proves this right or wrong?"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-black/[0.12] dark:border-white/[0.15] bg-black/[0.02] dark:bg-white/[0.03] text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors"
                  />
                </div>
              </div>

              {/* Submit Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-black/[0.06] dark:border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Commit Decision to Ledger
                </button>
              </div>
            </form>
          ) : (
            /* Tab: Decision List */
            <div className="space-y-4">
              {/* Filter Pills */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 bg-black/[0.04] dark:bg-white/[0.06] p-1 rounded-xl">
                  {[
                    { id: 'all', label: 'All Decisions' },
                    { id: 'pending', label: 'Active & Pending' },
                    { id: 'reviewed', label: 'Retrospectives' }
                  ].map(f => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => {
                        playSound('click', isMuted);
                        setFilterStatus(f.id);
                      }}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                        filterStatus === f.id
                          ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs'
                          : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                <div className="text-[11px] text-neutral-500 font-medium">
                  {filteredDecisions.length} of {decisions.length} shown
                </div>
              </div>

              {/* Decision Feed */}
              {filteredDecisions.length === 0 ? (
                <div className="py-12 text-center space-y-2 border border-dashed border-black/[0.1] dark:border-white/[0.1] rounded-2xl">
                  <Scale className="w-8 h-8 mx-auto text-neutral-300 dark:text-neutral-600" />
                  <p className="text-xs font-bold text-neutral-500">No decisions match this filter.</p>
                  <p className="text-[11px] text-neutral-500">Click "Log Decision" to register high-stakes architectural or venture milestones.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredDecisions.map(dec => {
                    const isPending = dec.status === 'pending';
                    const isReviewFormOpen = selectedDecision === dec.id;

                    return (
                      <div
                        key={dec.id}
                        className="p-4 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-black/[0.015] dark:bg-white/[0.02] space-y-3 transition-all"
                      >
                        {/* Title Row */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                dec.stake === 'Critical'
                                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                  : dec.stake === 'High'
                                    ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                                    : 'bg-neutral-500/10 text-neutral-700 dark:text-neutral-300'
                              }`}>
                                {dec.stake || 'Strategic'}
                              </span>

                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-neutral-700 dark:text-neutral-300">
                                {dec.mentalModel || 'First Principles'}
                              </span>

                              <span className="text-[10px] font-bold text-neutral-500">
                                Confidence: {dec.confidence || 85}%
                              </span>

                              {dec.status === 'reviewed' ? (
                                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Reviewed</span>
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-neutral-500 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>Review Date: {dec.reviewDate}</span>
                                </span>
                              )}
                            </div>

                            <h4 className="text-sm font-bold text-neutral-900 dark:text-white pt-0.5">
                              {dec.title}
                            </h4>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              playSound('click', isMuted);
                              onDeleteDecision?.(dec.id);
                            }}
                            className="p-1 rounded-lg text-neutral-400 hover:text-red-500 transition-colors cursor-pointer shrink-0"
                            title="Delete decision"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Context & Prediction */}
                        {dec.context && (
                          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            {dec.context}
                          </p>
                        )}

                        {dec.prediction && (
                          <div className="p-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] text-[11px] text-neutral-700 dark:text-neutral-300">
                            <strong className="font-bold text-neutral-900 dark:text-white">Falsifiable Prediction: </strong>
                            {dec.prediction}
                          </div>
                        )}

                        {/* Retrospective Section */}
                        {dec.retrospective ? (
                          <div className="p-3 rounded-xl bg-emerald-500/[0.05] border border-emerald-500/20 text-xs space-y-1">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                              Review &amp; Lesson
                            </div>
                            <p className="text-emerald-950 dark:text-emerald-200 leading-relaxed font-serif italic">
                              "{dec.retrospective}"
                            </p>
                          </div>
                        ) : isReviewFormOpen ? (
                          <div className="pt-2 space-y-2 border-t border-black/[0.06] dark:border-white/[0.08]">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
                              Record Retrospective: Was this decision validated? What did reality teach you?
                            </label>
                            <textarea
                              rows={2}
                              value={retrospectiveText}
                              onChange={e => setRetrospectiveText(e.target.value)}
                              placeholder="Document actual outcome, unintended second-order effects, and calibration accuracy..."
                              className="w-full px-3 py-2 text-xs rounded-xl border border-black/[0.12] dark:border-white/[0.15] bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedDecision(null)}
                                className="px-3 py-1 text-xs text-neutral-500 hover:text-neutral-700"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveRetrospective(dec.id)}
                                className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700"
                              >
                                Save Retrospective
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="pt-1 flex justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                playSound('click', isMuted);
                                setSelectedDecision(dec.id);
                                setRetrospectiveText('');
                              }}
                              className="text-[11px] font-bold text-neutral-500 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Record Retrospective Review</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Bottom Bar */}
        <div className="h-10 px-6 bg-black/[0.015] dark:bg-white/[0.02] border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between text-[10px] text-neutral-500 shrink-0">
          <span>Keyboard Shortcut: Cmd+D</span>
          <span>100% On-Device Cryptographic Ledger</span>
        </div>

      </div>

    </div>
  );
}
