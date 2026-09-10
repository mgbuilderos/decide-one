import React, { useState } from 'react';
import { Check, Plus, ArrowUpRight, Lock, Unlock, Target, ListOrdered, Grid2X2, Layers3, ListTree, ChartPie, Grip, Square, Circle, PenLine } from 'lucide-react';
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
  const [tone, setTone] = useState('white');
  const [grid, setGrid] = useState('dots');
  const [ink, setInk] = useState('carbon');
  const [notes, setNotes] = useState(['A thought worth holding on to.', 'Leave a little room for the unexpected.']);
  const [newNote, setNewNote] = useState('');
  const [habits, setHabits] = useState([[true, true, true, false, false], [true, true, false, true, false], [true, true, true, true, false]]);
  const [reflection, setReflection] = useState('Today, I made time for what matters.');
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
        {FRAMEWORKS.map((f,i) => { const Icon = [Target,ListOrdered,Grid2X2,Layers3,ListTree,ChartPie][i]; return <button key={f.id} title={f.name + ' · ' + f.subtitle} aria-label={f.name} aria-pressed={method === f.id} onClick={() => setMethod(f.id)}><Icon size={18} strokeWidth={1.5}/><span>{['Top 3','Sequence','Matrix','Must / Could','1–3–5','80 / 20'][i]}</span></button>; })}
      </div>
      <div className="pm-appearance-pickers">
        <div role="group" aria-label="Paper Tone">{[['white','White','#ffffff'],['slate','Soft Gray','#eeeeee']].map(([id,label,color]) => <button key={id} title={label + ' Paper'} aria-label={label + ' Paper'} aria-pressed={tone === id} onClick={() => setTone(id)}><span className="pm-paper-swatch" style={{background:color}}/></button>)}</div>
        <div role="group" aria-label="Page Grid">{[['dots','Dots',Grip],['square','Squared',Grid2X2],['plain','Plain',Square]].map(([id,label,Icon]) => <button key={id} title={label + ' Grid'} aria-label={label + ' Grid'} aria-pressed={grid === id} onClick={() => setGrid(id)}><Icon size={17} strokeWidth={1.4}/></button>)}</div>
        <div role="group" aria-label="Ink Tone">{[['carbon','Black','#111111'],['graphite','Graphite','#555555']].map(([id,label,color]) => <button key={id} title={label + ' Ink'} aria-label={label + ' Ink'} aria-pressed={ink === id} onClick={() => setInk(id)}><PenLine size={17} color={color}/></button>)}</div>
      </div>
    </div>
    <div className="pm-approach-description" aria-live="polite"><strong>{FRAMEWORKS.find(f => f.id === method)?.name}</strong><span>{FRAMEWORKS.find(f => f.id === method)?.subtitle}</span></div>
    <div className={`pm-demo pm-paper-${tone} pm-grid-${grid} pm-ink-${ink}`}>
      <div className={`pm-demo-content ${locked ? 'pm-obscured' : ''}`} inert={locked ? '' : undefined}>
        <div className="pm-demo-page"><div className="pm-demo-masthead"><span>Monday, September 07</span><span>Your Daily Spread</span></div><h3>What Comes First?</h3><p className="pm-demo-subtitle">Choose the tasks that deserve your attention today.</p><div className="pm-demo-section-label"><span>{FRAMEWORKS.find(f => f.id === method)?.name}</span><span aria-live="polite">{completed} / {tasks[method].length}</span></div><div className="pm-demo-tasks">{tasks[method].map((task, i) => <div key={method + i} className={`pm-demo-task ${task.done ? 'is-done' : ''}`}><button role="checkbox" aria-checked={task.done} aria-label={`Complete priority ${i + 1}: ${task.text}`} onClick={() => changeTask(i, {
                done: !task.done
              })}>{task.done ? <Check size={14} /> : <span>{String(i + 1).padStart(2, '0')}</span>}</button><input aria-label={`Priority ${i + 1}`} value={task.text} onChange={e => changeTask(i, {
                text: e.target.value
              })} /></div>)}</div><div className="pm-demo-section-label"><span>Notes & Passing Thoughts</span><span>+</span></div><div className="pm-demo-notes">{notes.map((note, i) => <p key={i}><span>—</span>{note}</p>)}</div><form onSubmit={e => {
            e.preventDefault();
            if (newNote.trim()) {
              setNotes([...notes, newNote.trim()]);
              setNewNote('');
            }
          }}><input value={newNote} onChange={e => setNewNote(e.target.value)} aria-label="Add a passing thought" placeholder="A little room for a new thought…" maxLength={140} /><button type="submit" aria-label="Add note"><Plus size={17} /></button></form></div>
        <div className="pm-demo-page"><div className="pm-demo-masthead"><span>A Little Better, Every Day</span><span>01</span></div><h3>Small rituals.<br />Lasting change.</h3><div className="pm-demo-section-label"><span>Keep Coming Back</span><span>M · T · W · T · F</span></div><div className="pm-demo-habits">{['Read a few pages', 'Move my body', 'One quiet moment'].map((name, row) => <div key={name}><span>{name}</span><div>{habits[row].map((done, day) => <button key={day} role="checkbox" aria-checked={done} aria-label={`${name}, ${['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'][day]}`} className={done ? 'is-done' : ''} onClick={() => setHabits(prev => prev.map((r, ri) => ri === row ? r.map((d, di) => di === day ? !d : d) : r))}>{done && <Check size={10} />}</button>)}</div></div>)}</div><div className="pm-demo-section-label"><span>A Moment To Reflect</span></div><label className="pm-reflection-label" htmlFor="pm-reflection">What made today worthwhile?</label><textarea id="pm-reflection" rows={3} value={reflection} onChange={e => setReflection(e.target.value)} /><div className="pm-demo-reminder">Your priorities guide the day.<br />You do the work.</div></div>
      </div>
      {locked && <div className="pm-demo-shutter"><Lock size={28} /><h3>A moment of privacy.</h3><p>The preview is hidden from view.</p><button className="pm-button" onClick={() => setLocked(false)}><Unlock size={15} /> Reveal preview</button></div>}
    </div>
    <div className="pm-demo-footer"><p>Make it yours. Try a checkbox, change the ink, write a thought.<br /><span>This is a sample spread. Your changes here are temporary.</span></p><button className="pm-text-link" onClick={() => setLocked(!locked)}>{locked ? <Unlock size={15} /> : <Lock size={15} />} {locked ? 'Reveal preview' : 'Try the privacy shutter'}</button><button className="pm-text-link" onClick={onLaunchJournal}>Open Decide One <ArrowUpRight size={16} /></button></div>
  </div>;
}
