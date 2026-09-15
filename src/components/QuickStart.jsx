import React, { useEffect, useRef, useState } from 'react';

export default function QuickStart({ isOpen, onClose }) {
  const [step, setStep] = useState(0);
  const panel = useRef(null);
  const heading = useRef(null);
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement;
    heading.current?.focus();
    const keyboard = event => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopImmediatePropagation(); onClose(); }
      if (event.key === 'Tab') {
        const items = [...panel.current.querySelectorAll('button:not(:disabled), a[href]')];
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && (document.activeElement === first || document.activeElement === heading.current)) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', keyboard, true);
    return () => { document.removeEventListener('keydown', keyboard, true); if (previous?.isConnected) previous.focus(); };
  }, [isOpen, onClose]);
  useEffect(() => { if (isOpen) heading.current?.focus(); }, [step, isOpen]);
  if (!isOpen) return null;
  const titles = ['You already know what matters. This helps you choose it.', 'Three methods. One clear order.', 'One page. Nothing leaves your device.'];
  return <div className="quick-start-backdrop">
    <section ref={panel} className="quick-start" role="dialog" aria-modal="true" aria-labelledby="quick-start-title">
      <header><span>DECIDE ONE</span><span aria-label={`Step ${step + 1} of 3`}>{step + 1}/3</span></header>
      <div className="quick-start-body">
        <h1 id="quick-start-title" ref={heading} tabIndex={-1}>{titles[step]}</h1>
        {step === 0 && <p>Some mornings hold eleven things and no obvious first one.</p>}
        {step === 1 && <>
          <p>Pick the method that fits the day.</p>
          <dl>
            <div><dt>Top 3</dt><dd>Three things for today and no fourth.</dd></div>
            <div><dt>Ivy Lee</dt><dd>Six tasks in strict order.</dd></div>
            <div><dt>Urgent/Important Matrix</dt><dd>Sorting on two axes before deciding what to do.</dd></div>
          </dl>
          <p>Choose at the top of the page. Start the stopwatch beside the first line. Turn Over to close the day.</p>
        </>}
        {step === 2 && <><p>Free, for everyone, with nothing held back.</p><p>No account. No subscription.</p><nav aria-label="Read more"><a href="/guides/">Guides</a><a href="/methods/">Methods</a><a href="/faq/">Questions</a></nav></>}
      </div>
      <footer><button onClick={onClose}>Skip</button><div>{step > 0 && <button onClick={() => setStep(step - 1)}>Back</button>}<button className="quick-start-next" onClick={() => step === 2 ? onClose() : setStep(step + 1)}>{step === 2 ? 'Start' : 'Next'}</button></div></footer>
    </section>
  </div>;
}
