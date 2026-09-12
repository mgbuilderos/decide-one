import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowDown, ArrowUpRight, Pause, Play, ChevronLeft, ChevronRight, Check, Lock, Sun, Moon, Target } from 'lucide-react';
import JournalDemo from './landing/JournalDemo';
import './landing/landing.css';
const JournalScene = lazy(() => import('./landing/JournalScene'));
const HIGHLIGHTS = [{
  label: "01 / List What Is Competing",
  title: <>See the choice<br />in front of you.</>,
  description: 'Write the work asking for your attention. A bounded page makes the tradeoffs visible before the day fills up.',
  type: 'focus'
}, {
  label: "02 / Choose A Method",
  title: <>Use structure<br />when choice is hard.</>,
  description: 'Choose Top 3, Ivy Lee, or the Urgent/Important Matrix. Each framework helps with a different kind of prioritization problem.',
  type: 'ritual'
}, {
  label: "03 / Put One Thing First",
  title: <>Leave with<br />a clear first move.</>,
  description: 'Give the first priority a realistic timebox. Decide One holds the choice in view while you do the work.',
  type: 'perspective'
}];
function Scene(props) {
  return <Suspense fallback={<div className="pm-scene"><img className="pm-scene-fallback" src="/renders/decideone-studio-d1.webp" srcSet="/renders/decideone-studio-d1-768.webp 768w, /renders/decideone-studio-d1.webp 1536w" sizes="(max-width: 768px) 100vw, 1536px" width="1536" height="1024" alt="Decide One instrument preview" decoding="async" /></div>}><JournalScene {...props} /></Suspense>;
}
export default function MarketingLandingPage({
  onLaunchJournal,
  onOpenLegal,
  onOpenMethods,
  updateSettings,
}) {
  const root = useRef(null);
  const [paused, setPaused] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [highlight, setHighlight] = useState(0);
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
  return <div ref={root} className={`pm-landing ${light ? 'pm-light' : ''} ${paused ? 'pm-motion-paused' : ''}`}>
    <a className="pm-skip-link" href="#design">Skip to the interactive instrument</a>
    <header className="pm-nav"><a className="pm-brand" href="#overview" aria-label="Decide One Home"><img className="pm-brand-mark" src="/icon.svg?v=2" alt="" width="44" height="44" /> <span className="pm-brand-name">Decide One</span></a><nav aria-label="Main Navigation"><a href="#design">How It Works</a><a href="/guides/">Guides</a><a href="#access">Start Free</a></nav><div className="pm-nav-actions"><button className="pm-theme-button" onClick={toggleLight} aria-label={light ? 'Use Dark Appearance' : 'Use Light Appearance'}>{light ? <Moon size={16} /> : <Sun size={16} />}</button><button className="pm-button pm-button-small" onClick={onLaunchJournal}>Start Free <ArrowRight size={14} /></button></div></header>
    <main>
      <section className="pm-hero" id="overview"><div className="pm-hero-copy"><p className="pm-eyebrow">The Priority Instrument<br /><span className="pm-eyebrow-free">Free Forever</span></p><h1>You already know what matters.<br /><span>This helps you choose it.</span></h1><p className="pm-hero-description">Some mornings hold eleven things and no obvious first one. Bring them into view, then pick the method that fits the day &mdash; Top 3, Ivy Lee, or the Urgent/Important Matrix.<br />Give the first one a real amount of time. You make the decision. The instrument holds it steady while you work.</p><div className="pm-actions"><button className="pm-button" onClick={onLaunchJournal}>Start Free <ArrowRight size={16} /></button><a className="pm-text-link" href="#design">See How It Works <ArrowDown size={15} /></a></div></div><div className="pm-hero-product"><div className="pm-stage-glow" /><div className="pm-hero-render"><Scene paused={paused} perspective="daily" viewpoint="front" /></div><div className="pm-product-caption"><span><i /> Built For One Clear Decision</span><button onClick={() => setPaused(!paused)} aria-label={paused ? 'Play All Animations' : 'Pause All Animations'}>{paused ? <Play size={14} /> : <Pause size={14} />}</button></div></div></section>
      <div className="pm-belief-strip"><span>One clear order.</span><div><span>Three Methods That Have Worked For A Century</span><i /><span>Nothing Ever Leaves Your Device</span><i /><span>Free, With Nothing Held Back</span></div></div>
      <section className="pm-section pm-highlights" id="highlights"><div className="pm-section-heading pm-reveal"><div><p className="pm-eyebrow">How It Works</p><h2>From eleven things<br /><span>to a clear first move.</span></h2></div><a className="pm-text-link" href="#design">Try It For Yourself <ArrowDown size={16} /></a></div><div className="pm-highlight-card" aria-roledescription="carousel" aria-label="How Decide One Works"><div className="pm-highlight-copy" key={highlight}><p className="pm-eyebrow">{HIGHLIGHTS[highlight].label}</p><h3>{HIGHLIGHTS[highlight].title}</h3><p>{HIGHLIGHTS[highlight].description}</p><a href="#design" className="pm-circle-link" aria-label="Try The Prioritization Instrument"><ArrowUpRight size={22} /></a></div><div className={`pm-highlight-visual pm-highlight-${HIGHLIGHTS[highlight].type}`} aria-hidden="true">{highlight === 0 ? <div className="pm-focus-preview"><span>The Work Competing For Today</span><div><b>01</b><p>Finish the client<br />proposal.</p><span className="pm-empty-check" /></div><div><b>02</b><p>Review the<br />product direction.</p><span className="pm-empty-check" /></div><div><b>03</b><p>Prepare tomorrow&rsquo;s<br />brief.</p><span className="pm-empty-check" /></div><footer>First make the choice visible.</footer></div> : highlight === 1 ? <div className="pm-ritual-preview"><span>Choose The Method</span><h4>Three ways<br />to find first.</h4>{['Top 3 · narrow the day', 'Ivy Lee · work in sequence', 'Matrix · separate urgency'].map((x, r) => <div key={x}><span>{x}</span><i className={r === 0 ? 'is-done' : ''}>{r === 0 && <Check size={12} />}</i></div>)}<p>Use the structure that fits the decision.</p></div> : <div className="pm-focus-preview"><span>Your First Move</span><div><b>01</b><p>Finish the client<br />proposal.</p><Check size={22} /></div><div><b>90m</b><p>Time reserved<br />for focused work.</p><span className="pm-empty-check" /></div><footer>The instrument decides nothing for you. It helps you decide.</footer></div>}</div></div><div className="pm-carousel-controls"><span className="pm-carousel-label">{String(highlight + 1).padStart(2, '0')} <span>/ 03</span></span><div className="pm-dots">{HIGHLIGHTS.map((h, i) => <button key={h.label} aria-label={`Show Step ${i + 1}`} aria-current={highlight === i ? 'true' : undefined} className={highlight === i ? 'is-active' : ''} onClick={() => selectHighlight(i)} />)}</div><div className="pm-arrow-controls"><button aria-label="Previous Step" onClick={() => selectHighlight(highlight - 1)}><ChevronLeft size={19} /></button><button aria-label="Next Step" onClick={() => selectHighlight(highlight + 1)}><ChevronRight size={19} /></button></div></div></section>
      <section className="pm-section pm-science-section" id="approach">
        <div className="pm-section-heading"><div><p className="pm-eyebrow">Honest About What We Know</p><h2>Research where it applies.<br /><span>Time-tested where it does not.</span></h2></div><p>Decide One uses evidence to shape the instrument.<br />It never makes claims the evidence cannot support.</p></div>
        <div className="pm-science-grid">
          <article><span>01 / Protect Your Attention</span><h3>Keep first visible.</h3><p>Switching away from unfinished work can leave part of your attention behind. A clear order reduces the need to choose again each time you look up.</p><a href="https://doi.org/10.1016/j.obhdp.2009.04.002" target="_blank" rel="noreferrer">Leroy, 2009 <ArrowUpRight size={14} /></a></article>
          <article><span>02 / Make Action Specific</span><h3>Give the choice a time.</h3><p>Research on implementation intentions supports deciding when and how to act. A realistic timebox makes the first move more concrete.</p><a href="https://doi.org/10.1016/S0065-2601(06)38002-1" target="_blank" rel="noreferrer">Gollwitzer &amp; Sheeran, 2006 <ArrowUpRight size={14} /></a></article>
          <article><span>03 / Use The Method Deliberately</span><h3>Know where it came from.</h3><p>Top 3, Ivy Lee, and the Urgent/Important Matrix have different histories and limits. Decide One documents those origins instead of treating every method as science.</p><button className="pm-article-link" type="button" onClick={onOpenMethods}>Methods &amp; Attributions <ArrowUpRight size={14} /></button></article>
        </div><p className="pm-research-note">Research informs the approach. Decide One itself has not been independently evaluated for productivity outcomes.</p>
      </section>
      <section className="pm-design-section" id="design"><div className="pm-section-heading pm-reveal"><div><p className="pm-eyebrow">Try It Right Now &mdash; Nothing To Sign Up For</p><h2>See the decision<br /><span>take shape.</span></h2></div><p>1. List the work competing for your day.<br />2. Choose the framework that fits.<br />3. Put one thing first and give it time.</p></div><JournalDemo onLaunchJournal={onLaunchJournal} /></section>
      <section className="pm-privacy-section" id="privacy"><div className="pm-privacy-icon"><Lock size={30} strokeWidth={1.2} /></div><p className="pm-eyebrow">Yours, And Only Yours</p><h2>What you write<br /><span>never leaves this device.</span></h2><p>Your work stays in this browser. Export a protected copy before clearing browser data,<br />or use the privacy shutter when you need to hide the page.</p><a className="pm-text-link" href="/faq/">Understand How Your Work Is Stored <ArrowDown size={15} /></a></section>
      <section className="pm-section pm-pricing-section" id="access"><div className="pm-pricing-copy"><p className="pm-eyebrow">Free, And It Stays Free</p><h2>Everything, from today.<br /><span>Nothing held back.</span></h2><p>Everything needed to choose, order,<br />and time today&rsquo;s priorities is ready.</p><button className="pm-text-link" onClick={onLaunchJournal}>Start Free <ArrowUpRight size={17} /></button></div><div className="pm-pricing-card"><div className="pm-pricing-top"><Target size={22} strokeWidth={1.4} /><span>Decide One</span><span>Free To Use</span></div><h3 className="pm-access-title">Three methods. One clear order.</h3><ul>{['Top 3, Ivy Lee, and Urgent/Important Matrix', 'Realistic timeboxes and planned versus actual time', 'Daily, weekly, monthly, and yearly perspectives', 'Device-local storage, protected exports, and print'].map(text => <li key={text}><Check size={15} />{text}</li>)}</ul><button className="pm-button" onClick={onLaunchJournal}>Open Decide One <ArrowRight size={16} /></button><p className="pm-pricing-disclosure">Free, and it stays free. No account, no subscription, nothing held back. If it earns it, you will be asked once at the end of a day you have closed — never before, and never in the way.</p></div></section>
      <section className="pm-section pm-reading-section" id="reading">
        <div className="pm-section-heading pm-reveal"><div><p className="pm-eyebrow">The Writing</p><h2>Where each method<br /><span>actually comes from.</span></h2></div><div className="pm-reading-links"><a className="pm-text-link" href="/methods/">The Three Methods <ArrowUpRight size={16} /></a><a className="pm-text-link" href="/guides/">Every Guide <ArrowUpRight size={16} /></a></div></div>
        <div className="pm-reading-grid">
          <a href="/methods/top-3-method/"><p className="pm-eyebrow">Method</p><h3>The Top 3 method</h3><p>Three things for today and no fourth, for a day holding more than it can.</p></a>
          <a href="/methods/ivy-lee-method/"><p className="pm-eyebrow">Method</p><h3>The Ivy Lee method</h3><p>Six tasks in strict order, given to Charles Schwab at Bethlehem Steel in 1918.</p></a>
          <a href="/methods/urgent-important-matrix/"><p className="pm-eyebrow">Method</p><h3>The urgent/important matrix</h3><p>Sorting on two axes before deciding what to do.</p></a>
          <a href="/guides/how-to-prioritise-tasks/"><p className="pm-eyebrow">Guide</p><h3>How to prioritise your tasks</h3><p>The three conditions a day arrives in, and which method each one calls for.</p></a>
          <a href="/guides/"><p className="pm-eyebrow">Guides</p><h3>Every guide</h3><p>Why lists stop working, what switching between things costs, and what the scheduling literature does and does not support.</p></a>
          <a href="/faq/"><p className="pm-eyebrow">Questions</p><h3>Frequently asked</h3><p>What it costs, where your writing is kept, and what happens if you miss a day.</p></a>
        </div>
      </section>
      <section className="pm-final-cta"><p className="pm-eyebrow">Today Is Still Yours.</p><h2>Three lines.<br />Then get to work.</h2><button className="pm-button" onClick={onLaunchJournal}>Open Decide One <ArrowRight size={16} /></button></section>
    </main><footer className="pm-footer"><a className="pm-brand" href="#overview"><img className="pm-brand-mark" src="/icon.svg?v=2" alt="" width="32" height="32" /> <span className="pm-brand-name">Decide One</span></a><p>The Priority Instrument.</p><div><a href="#privacy">Your Data</a><a href="/guides/">Guides</a><a href="/faq/">Questions</a><button type="button" className="pm-footer-link" onClick={onOpenMethods}>Methods &amp; Attributions</button><button type="button" className="pm-footer-link" onClick={onOpenLegal}>Terms, Privacy &amp; Refunds</button><a href="https://decideone.app/">decideone.app</a><span>© {new Date().getFullYear()} Decide One</span></div></footer>
  </div>;
}
