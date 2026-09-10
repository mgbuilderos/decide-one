import React, { useState, useRef, useEffect } from 'react';
import { Search, SlidersHorizontal, Lock, Sun, Moon, Scale, Sunset, Mic, Compass, BookOpen, BarChart3, Target, ListOrdered, Grid2X2 } from 'lucide-react';
import { FRAMEWORKS } from './ProductivityFrameworks';
import { playSound } from '../utils/audio';

export default function HeaderToolbar({ activeView, setActiveView, settings, updateSettings, onOpenAnalytics, onOpenMenu, activeFramework = 'rule_of_3', onSelectFramework, showCover, onToggleCover, isPatron, onOpenUpgrade, onOpenSearch, onLockVault, onOpenDecisions, onOpenClosure, onToggleDictation, isListening }) {
  const [menu, setMenu] = useState(null);
  const root = useRef(null);
  const trigger = useRef(null);
  const methodIcons = { rule_of_3: Target, ivy_lee: ListOrdered, eisenhower: Grid2X2 };
  useEffect(() => {
    if (!menu) return;
    const outside = e => { if (!root.current?.contains(e.target)) setMenu(null); };
    const escape = e => { if (e.key === 'Escape') { setMenu(null); trigger.current?.focus(); } };
    document.addEventListener('pointerdown', outside); document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); };
  }, [menu]);
  const act = fn => { setMenu(null); fn?.(); };
  return <header ref={root} className="instrument-header no-print">
    <div className="instrument-masthead">
      <button className="instrument-quiet-action" onClick={() => act(onOpenSearch)} aria-label="Search Your Work"><Search size={17}/><span>Search</span></button>
      <button className="instrument-wordmark" onClick={() => setActiveView('landing')} aria-label="Decide One Overview">Decide One</button>
      <button className="instrument-quiet-action instrument-tools-trigger" ref={trigger} onClick={() => setMenu(menu === 'tools' ? null : 'tools')} aria-expanded={menu === 'tools'} aria-controls="instrument-tools"><SlidersHorizontal size={17}/><span>Tools</span></button>
    </div>
    <div className="instrument-navigation">
      <nav aria-label="Time Perspective">{[['daily','Daily'],['weekly','Weekly'],['monthly','Monthly'],['yearly','Yearly']].map(([id,label]) => <button key={id} aria-current={activeView === id && !showCover ? 'page' : undefined} onClick={() => { playSound('page',settings?.isMuted); act(() => setActiveView(id)); if(showCover) onToggleCover?.(); }}>{label}</button>)}</nav>
      <div className="instrument-method-icons" role="group" aria-label="Choose A Prioritization Method">
        {FRAMEWORKS.map(method => {
          const MethodIcon = methodIcons[method.id];
          return <button
            key={method.id}
            type="button"
            aria-label={`${method.name}: ${method.subtitle}`}
            aria-pressed={method.id === activeFramework}
            title={`${method.name} — ${method.subtitle}`}
            onClick={() => onSelectFramework?.(method.id)}
          ><MethodIcon size={16}/></button>;
        })}
      </div>
    </div>
    {menu === 'tools' && <div className="instrument-popover instrument-tools" id="instrument-tools">
      <p>Your Workspace</p>
      {[['Decisions',Scale,onOpenDecisions],['Review Progress',BarChart3,onOpenAnalytics],['Close Day',Sunset,onOpenClosure],[isListening ? 'Stop Dictation' : 'Dictate',Mic,onToggleDictation],['Privacy Shutter',Lock,onLockVault],[showCover ? 'Open Workspace' : 'View Cover',BookOpen,onToggleCover]].map(([label,Icon,fn]) => <button key={label} onClick={() => act(fn)}><Icon size={16}/><span>{label}</span></button>)}
      <div className="instrument-paper-options"><span>Page</span>{[['dots','Dots'],['square','Squared'],['plain','Plain']].map(([id,label]) => <button key={id} aria-pressed={settings?.paperStyle === id} onClick={() => updateSettings?.({paperStyle:id})}>{label}</button>)}</div>
      <button onClick={() => updateSettings?.({darkMode:!settings?.darkMode})}>{settings?.darkMode ? <Sun size={16}/> : <Moon size={16}/>}<span>{settings?.darkMode ? 'Light Appearance' : 'Dark Appearance'}</span></button>
      <button onClick={() => act(onOpenMenu)}><SlidersHorizontal size={16}/><span>All Settings</span></button>
      <button onClick={() => act(() => setActiveView('landing'))}><Compass size={16}/><span>About Decide One</span></button>
    </div>}
  </header>;
}
