import React, { useEffect, useMemo, useState } from 'react';
import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Plus,
  Target,
  Trash2,
} from 'lucide-react';
import { playSound } from '../utils/audio';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function formatSelectedDate(year, monthIndex, day) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date(year, monthIndex, day));
}

export default function MonthlyLogSpread({
  currentDate,
  setCurrentDate,
  monthlyLog,
  onUpdateMonthlyLog,
  isMuted = false,
}) {
  // App.jsx owns the visible month as one Date, the way the weekly and yearly
  // spreads also receive it. This view thinks in year and month numbers, so
  // the two are reconciled here rather than at App.jsx's two call sites.
  //
  // The guard is not defensive habit: an invalid date reaches Intl.format as
  // NaN and throws RangeError, which took the whole app to a blank page rather
  // than degrading to a broken month.
  const viewDate =
    currentDate instanceof Date && !Number.isNaN(currentDate.getTime())
      ? currentDate
      : new Date();
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth() + 1;
  const onUpdate = onUpdateMonthlyLog;
  const onNavigate = (delta) =>
    setCurrentDate?.(new Date(year, viewDate.getMonth() + delta, 1));

  const monthIndex = month - 1;
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === monthIndex;
  const daysInMonth = new Date(year, month, 0).getDate();
  const [view, setView] = useState('calendar');
  const [selectedDay, setSelectedDay] = useState(isCurrentMonth ? today.getDate() : 1);
  const [newPriority, setNewPriority] = useState('');
  const events = monthlyLog?.events || {};
  const masterTasks = monthlyLog?.masterTasks || [];

  useEffect(() => {
    setSelectedDay(isCurrentMonth ? today.getDate() : 1);
  }, [isCurrentMonth, month, year]);

  const calendarDays = useMemo(() => {
    const mondayOffset = (new Date(year, monthIndex, 1).getDay() + 6) % 7;
    return Array.from({ length: 42 }, (_, index) => {
      const day = index - mondayOffset + 1;
      return day > 0 && day <= daysInMonth ? day : null;
    });
  }, [daysInMonth, monthIndex, year]);

  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
    new Date(year, monthIndex, 1),
  );

  const updateEvent = (day, text) => {
    onUpdate({
      ...monthlyLog,
      events: { ...events, [String(day)]: text },
    });
  };

  const addPriority = () => {
    const text = newPriority.trim();
    if (!text) return;
    playSound('write', isMuted);
    onUpdate({
      ...monthlyLog,
      masterTasks: [
        ...masterTasks,
        { id: `monthly_${Date.now()}`, text, completed: false },
      ],
    });
    setNewPriority('');
  };

  const updatePriority = (id, changes) => {
    onUpdate({
      ...monthlyLog,
      masterTasks: masterTasks.map((task) => (task.id === id ? { ...task, ...changes } : task)),
    });
  };

  const deletePriority = (id) => {
    playSound('erase', isMuted);
    onUpdate({
      ...monthlyLog,
      masterTasks: masterTasks.filter((task) => task.id !== id),
    });
  };

  return (
    <section className="flex min-h-0 flex-1 flex-col select-none" aria-label={`${monthName} ${year}`}>
      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-black/10 pb-3 dark:border-white/10">
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500">
            Monthly View
          </p>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-2xl">
            {monthName} <span className="font-normal text-neutral-500">{year}</span>
          </h1>
        </div>

        <div className="flex w-full flex-wrap items-center justify-between gap-2 sm:w-auto sm:flex-nowrap sm:justify-end">
          <div className="flex rounded-full border border-black/10 bg-black/[0.025] p-1 dark:border-white/10 dark:bg-white/[0.04]" role="group" aria-label="Monthly View">
            <button
              type="button"
              className={`flex min-h-9 items-center gap-1.5 rounded-full px-2.5 sm:px-3 text-[11px] font-semibold transition-colors ${view === 'calendar' ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'}`}
              aria-pressed={view === 'calendar'}
              onClick={() => setView('calendar')}
            >
              <CalendarDays className="h-3.5 w-3.5" /> Calendar
            </button>
            <button
              type="button"
              className={`flex min-h-9 items-center gap-1.5 rounded-full px-2.5 sm:px-3 text-[11px] font-semibold transition-colors ${view === 'priorities' ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'}`}
              aria-pressed={view === 'priorities'}
              onClick={() => setView('priorities')}
            >
              <Target className="h-3.5 w-3.5" /> Priorities
            </button>
          </div>

          <div className="flex shrink-0 items-center rounded-full border border-black/10 bg-white dark:border-white/10 dark:bg-neutral-900">
            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-full text-neutral-500 hover:bg-black/[0.04] hover:text-neutral-900 dark:hover:bg-white/[0.06] dark:hover:text-white"
              aria-label="Previous Month"
              onClick={() => onNavigate(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="min-w-10 text-center text-[11px] font-semibold text-neutral-600 dark:text-neutral-300">
              {monthName.slice(0, 3)}
            </span>
            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-full text-neutral-500 hover:bg-black/[0.04] hover:text-neutral-900 dark:hover:bg-white/[0.06] dark:hover:text-white"
              aria-label="Next Month"
              onClick={() => onNavigate(1)}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {view === 'calendar' ? (
        <div className="flex min-h-0 flex-1 flex-col pt-3">
          <div className="grid grid-cols-7 border-b border-black/10 pb-2 dark:border-white/10" aria-hidden="true">
            {WEEKDAYS.map((day) => (
              <span key={day} className="text-center text-[9px] font-bold uppercase tracking-[0.12em] text-neutral-500 sm:text-[10px]">
                {day}
              </span>
            ))}
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-7 grid-rows-6 overflow-hidden rounded-b-xl border-x border-b border-black/[0.08] dark:border-white/[0.08]">
            {calendarDays.map((day, index) => {
              if (!day) return <div key={`empty_${index}`} className="border-r border-t border-black/[0.06] bg-black/[0.012] dark:border-white/[0.06] dark:bg-white/[0.01]" />;
              const event = events[String(day)] || '';
              const isToday = isCurrentMonth && day === today.getDate();
              const isSelected = selectedDay === day;
              return (
                <button
                  key={day}
                  type="button"
                  className={`group relative min-h-11 overflow-hidden border-r border-t border-black/[0.06] p-1.5 text-left transition-colors dark:border-white/[0.06] sm:min-h-16 sm:p-2 ${isSelected ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900' : 'bg-white hover:bg-black/[0.025] dark:bg-neutral-950 dark:hover:bg-white/[0.035]'}`}
                  aria-label={`${formatSelectedDate(year, monthIndex, day)}${event ? `: ${event}` : ''}`}
                  aria-pressed={isSelected}
                  aria-current={isToday ? 'date' : undefined}
                  onClick={() => setSelectedDay(day)}
                >
                  <span className={`inline-grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold sm:h-6 sm:w-6 sm:text-[11px] ${isToday && !isSelected ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900' : ''}`}>
                    {day}
                  </span>
                  {event && (
                    <>
                      <span className={`absolute bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full sm:hidden ${isSelected ? 'bg-white dark:bg-neutral-900' : 'bg-neutral-900 dark:bg-white'}`} />
                      <span className={`mt-1 hidden line-clamp-2 text-[9px] leading-snug sm:block ${isSelected ? 'text-white/75 dark:text-neutral-700' : 'text-neutral-500 dark:text-neutral-400'}`}>
                        {event}
                      </span>
                    </>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex min-h-11 items-center gap-3 border-t border-black/10 pt-3 dark:border-white/10">
            <label htmlFor="monthly-event" className="hidden min-w-36 text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-500 sm:block">
              {formatSelectedDate(year, monthIndex, selectedDay)}
            </label>
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-black/10 text-[10px] font-bold text-neutral-600 dark:border-white/10 dark:text-neutral-300 sm:hidden">
              {selectedDay}
            </span>
            <input
              id="monthly-event"
              className="min-w-0 flex-1 select-text border-0 bg-transparent py-2 text-sm text-neutral-900 outline-none placeholder:text-neutral-300 dark:text-white dark:placeholder:text-neutral-600"
              value={events[String(selectedDay)] || ''}
              onChange={(event) => updateEvent(selectedDay, event.target.value)}
              placeholder="Add an event or milestone"
              autoComplete="off"
            />
          </div>
        </div>
      ) : (
        <div className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col pt-5">
          <div className="mb-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500">What Matters This Month</p>
            <h2 className="mt-1 text-lg font-bold tracking-tight text-neutral-900 dark:text-white">Keep the important work visible.</h2>
          </div>

          <form
            className="flex min-h-11 items-center gap-2 border-b border-black/15 dark:border-white/15"
            onSubmit={(event) => {
              event.preventDefault();
              addPriority();
            }}
          >
            <input
              className="min-w-0 flex-1 select-text bg-transparent py-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-300 dark:text-white dark:placeholder:text-neutral-600"
              value={newPriority}
              onChange={(event) => setNewPriority(event.target.value)}
              placeholder="Add a monthly priority"
              autoComplete="off"
            />
            <button type="submit" className="grid h-10 w-10 place-items-center rounded-full text-neutral-500 hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-900" aria-label="Add Monthly Priority">
              <Plus className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-2 min-h-0 flex-1 overflow-y-auto">
            {masterTasks.length === 0 ? (
              <div className="grid h-full min-h-40 place-items-center text-center">
                <div>
                  <Target className="mx-auto mb-3 h-7 w-7 text-neutral-300 dark:text-neutral-700" strokeWidth={1.25} />
                  <p className="text-sm font-semibold text-neutral-500">Nothing chosen for this month yet.</p>
                  <p className="mt-1 text-xs text-neutral-500">Add only the work that deserves to remain visible.</p>
                </div>
              </div>
            ) : (
              masterTasks.map((task, index) => (
                <div key={task.id} className="group flex min-h-12 items-center gap-3 border-b border-black/[0.08] dark:border-white/[0.08]">
                  <span className="w-6 text-[10px] font-bold text-neutral-500 dark:text-neutral-700">{String(index + 1).padStart(2, '0')}</span>
                  <button
                    type="button"
                    className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-colors ${task.completed ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900' : 'border-neutral-300 text-transparent hover:border-neutral-900 dark:border-neutral-700 dark:hover:border-white'}`}
                    onClick={() => updatePriority(task.id, { completed: !task.completed })}
                    aria-label={task.completed ? 'Mark Incomplete' : 'Mark Complete'}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                  <input
                    className={`min-w-0 flex-1 select-text bg-transparent py-3 text-sm outline-none ${task.completed ? 'text-neutral-400 line-through' : 'text-neutral-800 dark:text-neutral-200'}`}
                    value={task.text}
                    onChange={(event) => updatePriority(task.id, { text: event.target.value })}
                    aria-label={`Monthly Priority ${index + 1}`}
                  />
                  <button
                    type="button"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-neutral-300 opacity-100 hover:bg-black/[0.04] hover:text-neutral-700 dark:text-neutral-700 dark:hover:bg-white/[0.06] dark:hover:text-neutral-300 sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100"
                    onClick={() => deletePriority(task.id)}
                    aria-label="Delete Monthly Priority"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <footer className="mt-3 flex items-center justify-between border-t border-black/10 pt-2 text-[9px] font-semibold tracking-wide text-neutral-500 dark:border-white/10">
        <span>{view === 'calendar' ? 'A familiar month. One important line per day.' : 'The work that should shape this month.'}</span>
        <span>{masterTasks.filter((task) => !task.completed).length} Priorities</span>
      </footer>
    </section>
  );
}
