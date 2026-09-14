import React, { useState } from 'react';
import { Check, ArrowUpRight, Lock, Unlock, Target, ListOrdered, Grid2X2, Grip, Square } from 'lucide-react';
import { FRAMEWORKS } from '../ProductivityFrameworks';
const EXAMPLES = {
  rule_of_3: ['Make progress on the work that matters', 'Protect an hour for deep thinking', 'Finish the day with a clear mind'],
  ivy_lee: ['Write the first draft', 'Review the design', 'Call a collaborator', 'Read the research', 'Take a long walk', 'Reflect on the day'],
  eisenhower: ['Do · Send the proposal', 'Schedule · Plan the next chapter', 'Delegate · Organise the details', 'Eliminate · Another status meeting'],
};
export default function JournalDemo({
  onLaunchJournal
}) {
  const [method, setMethod] = useState('rule_of_3');
  const [tasks, setTasks] = useState(() => Object.fromEntries(Object.entries(EXAMPLES).map(([key, values]) => [key, values.map((text, i) => ({
    text,
    done: key === 'rule_of_3' && i === 0
  }))])));
  const [grid, setGrid] = useState('dots');
  const [minutes, setMinutes] = useState([90, 45, 60]);
  const [locked, setLocked] = useState(false);
  const completed = tasks[method].filter(t => t.done).length;
  const changeTask = (index, patch) => setTasks(prev => ({
    ...prev,
    [method]: prev[method].map((task, i) => i === index ? {
      ...task,
      ...patch
    } : task)
  }));
  return <div className="pm-demo-wrap">
    <div className="pm-demo-icon-toolbar">
      <div className="pm-approach-picker" role="group" aria-label="Prioritization Approach">
        {FRAMEWORKS.map((f,i) => { const Icon = [Target,ListOrdered,Grid2X2][i]; return <button key={f.id} title={f.name + ' · ' + f.subtitle} aria-label={f.name} aria-pressed={method === f.id} onClick={() => setMethod(f.id)}><Icon size={18} strokeWidth={1.5}/><span>{['Top 3','Sequence','Matrix'][i]}</span></button>; })}
      </div>
      <div className="pm-appearance-pickers">
        <div role="group" aria-label="Page Grid">{[['dots','Dots',Grip],['square','Squared',Grid2X2],['plain','Plain',Square]].map(([id,label,Icon]) => <button key={id} title={label + ' Grid'} aria-label={label + ' Grid'} aria-pressed={grid === id} onClick={() => setGrid(id)}><Icon size={17} strokeWidth={1.4}/></button>)}</div>
      </div>
    </div>
    <div className="pm-approach-description" aria-live="polite"><strong>{FRAMEWORKS.find(f => f.id === method)?.name}</strong><span>{FRAMEWORKS.find(f => f.id === method)?.subtitle}</span></div>
    <div className={`pm-demo pm-grid-${grid}`}>
      <div className={`pm-demo-content ${locked ? 'pm-obscured' : ''}`} inert={locked ? '' : undefined}>
        <div className="pm-demo-page"><div className="pm-demo-masthead"><span>Monday, September 07</span><span>Today&rsquo;s Decision</span></div><h3>What Comes First?</h3><p className="pm-demo-subtitle">List the work competing for your attention. Then put it in order.</p><div className="pm-demo-section-label"><span>{FRAMEWORKS.find(f => f.id === method)?.name}</span><span aria-live="polite">{completed} / {tasks[method].length}</span></div><div className="pm-demo-tasks">{tasks[method].map((task, i) => <div key={method + i} className={`pm-demo-task ${task.done ? 'is-done' : ''}`}><button role="checkbox" aria-checked={task.done} aria-label={`Complete priority ${i + 1}: ${task.text}`} onClick={() => changeTask(i, {
                done: !task.done
              })}>{task.done ? <Check size={14} /> : <span>{String(i + 1).padStart(2, '0')}</span>}</button><input aria-label={`Priority ${i + 1}`} value={task.text} onChange={e => changeTask(i, {
                text: e.target.value
              })} /></div>)}</div><div className="pm-demo-decision"><span>01</span><div><strong>List</strong><p>Get the competing work out of your head.</p></div></div><div className="pm-demo-decision"><span>02</span><div><strong>Choose</strong><p>Use the method that fits the decision.</p></div></div><div className="pm-demo-decision"><span>03</span><div><strong>Begin</strong><p>Give the first priority a realistic amount of time.</p></div></div></div>
        <div className="pm-demo-page"><div className="pm-demo-masthead"><span>Give It Time</span><span>02</span></div><h3>See what fits.<br />Before you begin.</h3><div className="pm-demo-section-label"><span>Planned</span><span>{Math.floor(minutes.reduce((a, b) => a + b, 0) / 60)}h {minutes.reduce((a, b) => a + b, 0) % 60}m</span></div><div className="pm-demo-habits">{tasks[method].slice(0, 3).map((task, row) => <div key={row}><span>{task.text.slice(0, 22)}</span><div>{[15, 45, 90].map(m => <button key={m} type="button" aria-label={`Set ${m} minutes`} className={minutes[row] === m ? 'is-on' : ''} onClick={() => setMinutes(prev => prev.map((v, r) => r === row ? m : v))}>{m}m</button>)}</div></div>)}</div><p className="pm-demo-subtitle">A realistic timebox turns an intention into a commitment you can start.</p></div>
      </div>
      {locked && <div className="pm-demo-shutter"><Lock size={28} /><h3>A moment of privacy.</h3><p>The preview is hidden from view.</p><button className="pm-button" onClick={() => setLocked(false)}><Unlock size={15} /> Reveal preview</button></div>}
    </div>
    <div className="pm-demo-footer"><p>Try a method, reorder a priority, and set a timebox.<br /><span>This preview is temporary. Your instrument saves work on this device.</span></p><button className="pm-text-link" onClick={() => setLocked(!locked)}>{locked ? <Unlock size={15} /> : <Lock size={15} />} {locked ? 'Reveal Preview' : 'Try The Privacy Shutter'}</button><button className="pm-text-link" onClick={onLaunchJournal}>Open Decide One <ArrowUpRight size={16} /></button></div>
  </div>;
}
