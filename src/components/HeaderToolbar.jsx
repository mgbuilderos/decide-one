import React from 'react';
import { Menu, Search } from 'lucide-react';
import { playSound } from '../utils/audio';

export default function HeaderToolbar({
  activeView,
  setActiveView,
  settings,
  onOpenMenu,
  menuOpen = false,
  onOpenSearch
}) {
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
          aria-label="Menu"
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

      </div>
    </header>
  );
}
