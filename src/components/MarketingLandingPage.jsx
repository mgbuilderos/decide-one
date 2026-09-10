import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowDown, ArrowUpRight, Pause, Play, ChevronLeft, ChevronRight, Plus, Minus, Laptop, Tablet, Smartphone, Check, Lock, BookOpen, Sun, Moon } from 'lucide-react';
import JournalDemo from './landing/JournalDemo';
import { MONTH_ILLUSTRATIONS } from '../data/monthIllustrations';
import './landing/landing.css';
const JournalScene = lazy(() => import('./landing/JournalScene'));
const HIGHLIGHTS = [{
  label: "01 / Find Your Focus",
  title: <>A full life.<br />A clearer day.</>,
  description: 'Choose a small set of meaningful outcomes before the day fills up. Keep the next action visible while you work.',
  type: 'focus'
}, {
  label: "02 / Give It Time",
  title: <>Decide once.<br />Then give it time.</>,
  description: 'Put a duration on each thing you chose. Three tasks at three hours is nine hours, and the day has not got nine hours \u2014 you find that out now, not at six.',
  type: 'ritual'
}, {
  label: "03 / See The Bigger Picture",
  title: <>Turn the page.<br />Keep perspective.</>,
  description: 'Connect today’s actions to the week ahead. Step back each month to check whether your effort is taking you where you want to go.',
  type: 'perspective'
}];
const FAQ = [['What Makes Decide One A Priority Instrument?', 'Decide One brings priorities, decision frameworks, timeboxing, and weekly review into one focused workspace. Use it to decide what deserves attention, act on that decision, and learn from your progress.'], ['What Is The Science Behind The Approach?', 'The design draws on research into attention when switching tasks, specific action planning, and repeated behavior in a consistent context. These studies inform the approach; they are not trials of Decide One and do not guarantee a particular result.'], ['Where Is My Work Stored?', 'Your entries are saved in this browser on this device. Export a backup before clearing browser data. Passphrase-protected exports are available.'], ['Can I Move Between Devices?', 'Use export and import to transfer your work. Each browser keeps its own local data; there is no automatic cloud sync.'], ['Can I Try Decide One First?', 'Yes. Open Decide One and try the priority instrument. Patron checkout is currently a demonstration and does not charge you.']];
function Scene(props) {
  return <Suspense fallback={<div className="pm-scene"><img className="pm-scene-fallback" src="/renders/decideone-studio-d1.png" alt="Decide One instrument preview" /></div>}><JournalScene {...props} /></Suspense>;
}
export default function MarketingLandingPage({
  onLaunchJournal,
  onOpenLegal,
  onOpenMethods,
  onOpenUpgrade,
  updateSettings,
  isPatron = false
}) {
  const root = useRef(null);
  const [paused, setPaused] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [highlight, setHighlight] = useState(0);
  const [device, setDevice] = useState('desktop');
  const [finish, setFinish] = useState('#161616');
  const [perspective, setPerspective] = useState('daily');
  const [viewpoint, setViewpoint] = useState('angled');
  const [deviceView, setDeviceView] = useState('angled');
  const [exploded, setExploded] = useState(false);
  const [faq, setFaq] = useState(null);
  const [month, setMonth] = useState(8);
  const [light, setLight] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('pm-visible');
        observer.unobserve(entry.target);
      }
    }), {
      threshold: 0.08
    });
    root.current.querySelectorAll('.pm-reveal').forEach(el => observer.observe(el));
    let raf;
    const scroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        root.current?.style.setProperty('--pm-scroll', Math.min(window.scrollY / 900, 1));
        raf = null;
      });
    };
    window.addEventListener('scroll', scroll, {
      passive: true
    });
    const oldTitle = document.title;
    document.title = 'Decide One — The Daily Decision Instrument';
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', scroll);
      cancelAnimationFrame(raf);
      document.title = oldTitle;
    };
  }, []);
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      if (!document.hidden && root.current?.querySelector('#highlights')?.getBoundingClientRect().top < window.innerHeight && root.current?.querySelector('#highlights')?.getBoundingClientRect().bottom > 0) setHighlight(i => (i + 1) % HIGHLIGHTS.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [paused]);
  const selectHighlight = n => {
    setHighlight((n + HIGHLIGHTS.length) % HIGHLIGHTS.length);
    setPaused(true);
  };
  const toggleLight = () => {
    setLight(!light);
    updateSettings?.({
      darkMode: light
    });
  };
  const illustration = MONTH_ILLUSTRATIONS[month];
  return <div ref={root} className={`pm-landing ${light ? 'pm-light' : ''} ${paused ? 'pm-motion-paused' : ''}`}>
    <a className="pm-skip-link" href="#design">Skip to the interactive instrument</a>
    <header className="pm-nav"><a className="pm-brand" href="#overview" aria-label="Decide One home"><img className="pm-brand-mark" src="/icon.svg" alt="" width="44" height="44" /> <span className="pm-brand-name">Decide One</span></a><nav aria-label="Main navigation"><a href="#design">The Instrument</a><a href="#craft">The Details</a><a href="#pricing">Own Decide One</a></nav><div className="pm-nav-actions"><button className="pm-theme-button" onClick={toggleLight} aria-label={light ? 'Use dark appearance' : 'Use light appearance'}>{light ? <Moon size={16} /> : <Sun size={16} />}</button><button className="pm-button pm-button-small" onClick={onLaunchJournal}>Open Decide One <ArrowRight size={14} /></button></div></header>
    <main>
      <section className="pm-hero" id="overview"><div className="pm-hero-copy"><p className="pm-eyebrow">The Daily Decision Instrument</p><h1>First has room for one.<br /><span>Decide what comes first.</span></h1><p className="pm-hero-description">Turn a crowded list into a clear order.<br />Name the work. Choose a method. Leave with one first move.</p><div className="pm-actions"><button className="pm-button" onClick={onLaunchJournal}>Open The Instrument <ArrowRight size={16} /></button><a className="pm-text-link" href="#design">See How It Works <ArrowDown size={15} /></a></div></div><div className="pm-hero-product"><div className="pm-stage-glow" /><div className="pm-hero-render"><img src="/renders/decideone-studio-d1.png" alt="Decide One open with crisp white priority pages, fine stacked paper edges, a black cover and woven Decide One label" width="1536" height="1024" fetchpriority="high" /></div><div className="pm-product-caption"><span><i /> Designed For One Clear Decision</span><button onClick={() => setPaused(!paused)} aria-label={paused ? 'Play all animations' : 'Pause all animations'}>{paused ? <Play size={14} /> : <Pause size={14} />}</button><a href="#perspectives">Inspect In 3D <ArrowDown size={13} /></a></div></div></section>
      <div className="pm-belief-strip"><span>Nothing shares first.</span><div><span>Three Decision Methods</span><i /><span>Your Work Stays On Your Device</span><i /><span>No Subscription</span></div></div>
      <section className="pm-section pm-highlights" id="highlights"><div className="pm-section-heading pm-reveal"><div><p className="pm-eyebrow">Less Friction. More Intention.</p><h2>Get to know Decide One.</h2></div><a className="pm-text-link" href="#design">Try It For Yourself <ArrowDown size={16} /></a></div><div className="pm-highlight-card" aria-roledescription="carousel" aria-label="Product highlights"><div className="pm-highlight-copy" key={highlight}><p className="pm-eyebrow">{HIGHLIGHTS[highlight].label}</p><h3>{HIGHLIGHTS[highlight].title}</h3><p>{HIGHLIGHTS[highlight].description}</p><a href="#design" className="pm-circle-link" aria-label="Try the daily spread"><ArrowUpRight size={22} /></a></div><div className={`pm-highlight-visual pm-highlight-${HIGHLIGHTS[highlight].type}`} aria-hidden="true">{highlight === 0 ? <div className="pm-focus-preview"><span>The Three That Matter</span><div><b>01</b><p>Create something<br />meaningful.</p><Check size={22} /></div><div><b>02</b><p>Make space for<br />deep work.</p><span className="pm-empty-check" /></div><div><b>03</b><p>Be fully<br />present.</p><span className="pm-empty-check" /></div><footer>One Day. A Little More Clarity.</footer></div> : highlight === 1 ? <div className="pm-ritual-preview"><span>Your Daily Rhythm</span><h4>A little better.<br />Every day.</h4>{['Read', 'Move', 'Reflect'].map((x, r) => <div key={x}><span>{x}</span>{Array.from({
                  length: 5
                }, (_, i) => <i className={i < 4 - r ? 'is-done' : ''} key={i}>{i < 4 - r && <Check size={12} />}</i>)}</div>)}<p>Consistency starts with coming back.</p></div> : <div className="pm-calendar-preview"><span>The Bigger Picture</span><h4>September.</h4><div>{Array.from({
                  length: 35
                }, (_, i) => <span key={i} className={i === 8 ? 'selected' : ''}>{i > 1 && i < 32 ? i - 1 : ''}</span>)}</div><p>Give the important things a place.</p></div>}</div></div><div className="pm-carousel-controls"><span className="pm-carousel-label">{String(highlight + 1).padStart(2, '0')} <span>/ 03</span></span><div className="pm-dots">{HIGHLIGHTS.map((h, i) => <button key={h.label} aria-label={`Show highlight ${i + 1}`} aria-current={highlight === i ? 'true' : undefined} className={highlight === i ? 'is-active' : ''} onClick={() => selectHighlight(i)} />)}</div><div className="pm-arrow-controls"><button aria-label="Previous highlight" onClick={() => selectHighlight(highlight - 1)}><ChevronLeft size={19} /></button><button aria-label="Next highlight" onClick={() => selectHighlight(highlight + 1)}><ChevronRight size={19} /></button></div></div></section>
      <section className="pm-section pm-science-section" id="approach">
        <div className="pm-section-heading"><div><p className="pm-eyebrow">Designed Around How You Work</p><h2>Honest timeboxes.<br /><span>Grounded in research.</span></h2></div><p>Make fewer decisions about the tool.<br />Save your attention for the work.</p></div>
        <div className="pm-science-grid">
          <article><span>01 / Protect Your Attention</span><h3>Stay with one thing.</h3><p>Switching tasks can leave part of your attention on unfinished work. Keep your next priority visible and capture passing thoughts in one place.</p><a href="https://doi.org/10.1016/j.obhdp.2009.04.002" target="_blank" rel="noreferrer">Leroy, 2009 <ArrowUpRight size={14} /></a></article>
          <article><span>02 / Make The Next Step Specific</span><h3>Give intention a plan.</h3><p>Research on if–then planning supports deciding when and how to act. Write the cue and next action together: “After my first coffee, I’ll draft the proposal.”</p><a href="https://doi.org/10.1016/S0065-2601(06)38002-1" target="_blank" rel="noreferrer">Gollwitzer &amp; Sheeran, 2006 <ArrowUpRight size={14} /></a></article>
          <article><span>03 / Build A Repeatable Rhythm</span><h3>Return. Repeat. Refine.</h3><p>Repeating a behavior in a consistent context can help it become more automatic. Track the routines you want to return to, and review what helps.</p><a href="https://doi.org/10.1002/ejsp.674" target="_blank" rel="noreferrer">Lally et al., 2010 <ArrowUpRight size={14} /></a></article>
        </div><p className="pm-research-note">Research informs the approach. Decide One itself has not been independently evaluated for productivity outcomes.</p>
      </section>
      <section className="pm-design-section" id="design"><div className="pm-section-heading pm-reveal"><div><p className="pm-eyebrow">Familiar By Feel. Different By Design.</p><h2>Your tasks.<br /><span>A clear order.</span></h2></div><p>Write down what needs your attention.<br />Choose a framework to decide what comes first.<br />Keep your priorities in view as you work.</p></div><JournalDemo onLaunchJournal={onLaunchJournal} /></section>
      <section className="pm-section pm-craft-section" id="craft"><div className="pm-section-heading pm-reveal"><div><p className="pm-eyebrow">Considered. Down To The Last Detail.</p><h2>Digital.<br /><span>With a human touch.</span></h2></div><p>Black ink. White pages. Room to think.<br />A familiar surface for deciding what matters.</p></div><div className="pm-studio-detail pm-reveal"><img src="/renders/decideone-studio-d1.png" alt="Detailed white Decide One pages with priority rows, habits, sewn binding and paper edges" width="1536" height="1024" loading="lazy"/><div><p className="pm-eyebrow">Made To Keep Your Priorities In View</p><h3>Nothing between you<br />and what comes first.</h3><p>A clear hierarchy. A familiar page.<br />Space to choose before you begin.</p></div></div><div className="pm-material-explorer"><div className="pm-material-copy"><p className="pm-eyebrow">03 / Explore The Object</p><h3>Every layer.<br />A little intention.</h3><p>Turn it. Look closer. Discover the details that make a digital space feel familiar.</p><div className="pm-finishes" role="group" aria-label="3D cover finish">{[['#161616', 'Black'], ['#555555', 'Graphite'], ['#aaaaaa', 'Silver']].map(([value, name]) => <button aria-pressed={finish === value} aria-label={name} key={name} style={{
                '--finish': value
              }} onClick={() => setFinish(value)}>{finish === value && <Check size={13} />}</button>)}<span>{finish === '#161616' ? 'Black' : finish === '#555555' ? 'Graphite' : 'Silver'}</span></div><button className="pm-outline-button" aria-pressed={exploded} onClick={() => setExploded(!exploded)}>{exploded ? <Minus size={15} /> : <Plus size={15} />} {exploded ? 'Bring It Together' : 'Explore The Layers'}</button><p className="pm-small-note">A tactile interface for focused work.</p></div><Scene finish={finish} paused={paused} exploded={exploded} /></div></section>
      <section className="pm-section pm-perspectives-section" id="perspectives">
        <div className="pm-section-heading"><div><p className="pm-eyebrow">A Closer Look</p><h2>Today’s priorities.<br /><span>A longer perspective.</span></h2></div><p>See your work at three scales.<br />Choose a perspective. Take a closer look.</p></div>
        <div className="pm-explorer-toolbar"><div className="pm-segmented" role="group" aria-label="Choose a perspective">{[['daily','Daily'],['monthly','Monthly'],['yearly','Yearly']].map(([id,label]) => <button key={id} aria-pressed={perspective === id} onClick={() => setPerspective(id)}>{label}</button>)}</div><div className="pm-segmented pm-view-controls" role="group" aria-label="Choose a camera view">{[['front','Front View'],['angled','Angled View'],['close','Close-Up']].map(([id,label]) => <button key={id} aria-pressed={viewpoint === id} onClick={() => setViewpoint(id)}>{label}</button>)}</div></div>
        <div className="pm-perspective-stage"><Scene paused={paused} perspective={perspective} viewpoint={viewpoint}/></div>
        <div className="pm-perspective-caption" aria-live="polite"><strong>{perspective === 'daily' ? 'Choose What Comes First.' : perspective === 'monthly' ? 'Keep The Important Work In View.' : 'Remember What Deserves Your Time.'}</strong><p>{perspective === 'daily' ? 'List the work on your mind. Use a framework to choose your top priorities for today.' : perspective === 'monthly' ? 'Step back from individual tasks and consider the commitments competing for your attention.' : 'Review the themes that matter to you, and use them to guide your everyday choices.'}</p><span>Illustrative Sample Pages · Drag To Rotate</span></div>
      </section>
      <section className="pm-device-section" id="devices"><div className="pm-centered-heading pm-reveal"><p className="pm-eyebrow">Same Calm. A Different Canvas.</p><h2>A place for focus.<br /><span>Wherever you find it.</span></h2><p>At your desk. On the sofa. Between places.<br />An experience that fits the screen in front of you.</p></div><img className="pm-device-studio" src="/renders/decideone-pro-devices-d1.png" alt="Illustrative MacBook Pro, iPad Pro and iPhone Pro mockups with white Decide One interfaces" width="1536" height="1024" loading="lazy"/><div className="pm-device-tabs" role="group" aria-label="Choose a device preview">{[['desktop', Laptop, 'MacBook Pro'], ['tablet', Tablet, 'iPad Pro'], ['mobile', Smartphone, 'iPhone Pro']].map(([id, Icon, label]) => <button key={id} aria-pressed={device === id} className={device === id ? 'is-active' : ''} onClick={() => setDevice(id)}><Icon size={16} />{label}</button>)}</div><div className="pm-device-view-controls pm-segmented" role="group" aria-label="Device camera view">{[["front","Front View"],["angled","Angled View"],["close","Close-Up"]].map(([id,label]) => <button key={id} aria-pressed={deviceView === id} onClick={() => setDeviceView(id)}>{label}</button>)}</div><div className="pm-device-stage"><Scene kind={device} paused={paused} viewpoint={deviceView} perspective={perspective}/></div><p className="pm-device-note">Illustrative device concepts for this private prototype. Decide One is not affiliated with Apple.<br />Your work stays in this browser. Move it between devices with export and import.</p></section>
      <section className="pm-section pm-seasons-section" id="gallery"><div className="pm-season-art" aria-hidden="true">{illustration?.render('pm-month-illustration')}</div><div className="pm-season-copy"><p className="pm-eyebrow">A New Chapter, Every Month.</p><h2>Time passes.<br /><span>Make it meaningful.</span></h2><p>Twelve illustrated chapter pages. A small pause between what has been and what comes next.</p><div className="pm-month-tabs" role="group" aria-label="Preview a monthly illustration">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, i) => <button className={month === i ? 'is-active' : ''} aria-pressed={month === i} onClick={() => setMonth(i)} key={m}>{m}</button>)}</div><span className="pm-season-caption" aria-live="polite">{String(month + 1).padStart(2, '0')} / {illustration?.name || new Date(2026, month).toLocaleString('en', {
              month: 'long'
            })}</span></div></section>
      <section className="pm-privacy-section" id="privacy"><div className="pm-privacy-icon"><Lock size={30} strokeWidth={1.2} /></div><p className="pm-eyebrow">Personal Means Personal.</p><h2>Your thoughts.<br /><span>Your place to keep them.</span></h2><p>Your entries stay in this browser. Export a copy to keep.<br />Use the privacy shutter when you need a little space.</p><a className="pm-text-link" href="#faq">Understand How Your Work Is Stored <ArrowDown size={15} /></a></section>
      <section className="pm-section pm-pricing-section" id="pricing"><div className="pm-pricing-copy"><p className="pm-eyebrow">Less To Manage. More To Own.</p><h2>Make it<br /><span>part of your day.</span></h2><p>A little structure. A little space.<br />A daily ritual that belongs to you.</p><button className="pm-text-link" onClick={onLaunchJournal}>Start With Decide One <ArrowUpRight size={17} /></button></div><div className="pm-pricing-card"><div className="pm-pricing-top"><BookOpen size={22} strokeWidth={1.4} /><span>Decide One Patron</span><span>Lifetime</span></div><div className="pm-price">$24<span>USD / one time</span></div><p className="pm-inr">or ₹1,999 INR · No recurring subscription.</p><ul>{['Daily, weekly, monthly & yearly perspectives', 'Six ways to find your priorities', 'Timeboxes, planned vs actual & decision notes', 'Portable exports and printable reviews'].map(text => <li key={text}><Check size={15} />{text}</li>)}</ul><button className="pm-button" onClick={isPatron ? onLaunchJournal : onOpenUpgrade}>{isPatron ? 'Open Decide One' : 'Explore Lifetime Access'}<ArrowRight size={16} /></button><p className="pm-pricing-disclosure">Prototype checkout. No payment will be taken.</p></div></section>
      <section className="pm-section pm-faq-section" id="faq"><div><p className="pm-eyebrow">A Few Things To Know.</p><h2>Simply answered.</h2></div><div>{FAQ.map(([question, answer], i) => <div className="pm-faq-item" key={question}><h3><button aria-expanded={faq === i} aria-controls={`pm-answer-${i}`} onClick={() => setFaq(faq === i ? null : i)}>{question}{faq === i ? <Minus size={17} /> : <Plus size={17} />}</button></h3><div id={`pm-answer-${i}`} hidden={faq !== i}><p>{answer}</p></div></div>)}</div></section>
      <section className="pm-final-cta"><p className="pm-eyebrow">A Clearer Day Starts Here.</p><h2>Make room<br />for what matters.</h2><button className="pm-button" onClick={onLaunchJournal}>Open Decide One <ArrowRight size={16} /></button></section>
    </main><footer className="pm-footer"><a className="pm-brand" href="#overview"><img className="pm-brand-mark" src="/icon.svg" alt="" width="32" height="32" /> <span className="pm-brand-name">Decide One</span></a><p>The Priority Instrument.</p><div><a href="#privacy">Your Data</a><a href="#faq">Questions</a><button type="button" className="pm-footer-link" onClick={onOpenMethods}>Methods &amp; Attributions</button><button type="button" className="pm-footer-link" onClick={onOpenLegal}>Terms, Privacy &amp; Refunds</button><a href="https://decideone.app/">decideone.app</a><span>© {new Date().getFullYear()} Decide One</span></div></footer>
  </div>;
}
