import React from 'react';
import { Grid2X2, ListOrdered, Menu, Search, Target } from 'lucide-react';
import { FRAMEWORKS } from './ProductivityFrameworks';
import { playSound } from '../utils/audio';

export default function HeaderToolbar({
  activeView,
  setActiveView,
  settings,
  onOpenMenu,
  menuOpen = false,
  activeFramework = 'rule_of_3',
  onSelectFramework,
  onOpenSearch
}) {
  const methodIcons = { rule_of_3: Target, ivy_lee: ListOrdered, eisenhower: Grid2X2 };

  return (
    <header className="instrument-header no-print">
      <div className="instrument-masthead">
        <button type="button" className="instrument-quiet-action" onClick={onOpenSearch} aria-label="Search Your Work">
          <Search size={17} />
          <span>Search</span>
        </button>

        <button type="button" className="instrument-wordmark" onClick={() => setActiveView('daily')} aria-label="Open Daily">
          DECIDE ONE
        </button>

        <button
          id="instrument-menu-trigger"
          type="button"
          className="instrument-quiet-action instrument-tools-trigger"
          onClick={onOpenMenu}
          aria-haspopup="dialog"
          aria-expanded={menuOpen}
          aria-controls="unified-menu"
        >
          <Menu size={17} />
          <span>Menu</span>
        </button>
      </div>

      <div className="instrument-navigation">
        <nav aria-label="Time Perspective">
          {[
            ['daily', 'Daily', 'Day'],
            ['weekly', 'Weekly', 'Week'],
            ['monthly', 'Monthly', 'Month'],
            ['yearly', 'Yearly', 'Year']
          ].map(([id, label, compactLabel]) => (
            <button
              key={id}
              type="button"
              aria-label={label}
              aria-current={activeView === id ? 'page' : undefined}
              onClick={() => {
                playSound('page', settings?.isMuted);
                setActiveView(id);
              }}
            >
              <span className="perspective-label-full">{label}</span>
              <span className="perspective-label-compact" aria-hidden="true">{compactLabel}</span>
            </button>
          ))}
        </nav>

        <div className="instrument-method-slot">
        {activeView === 'daily' && (
          <div className="instrument-method-icons" role="group" aria-label="Choose A Prioritization Method">
            {FRAMEWORKS.map((method) => {
              const MethodIcon = methodIcons[method.id];
              return (
                <button
                  key={method.id}
                  type="button"
                  aria-label={`${method.name}: ${method.subtitle}`}
                  aria-pressed={method.id === activeFramework}
                  title={`${method.name} — ${method.subtitle}`}
                  onClick={() => onSelectFramework?.(method.id)}
                >
                  <MethodIcon size={16} />
                </button>
              );
            })}
          </div>
        )}
        </div>
      </div>
    </header>
  );
}
