/**
 * Diagrams for the content pages.
 *
 * Inline SVG, not images. The reasons are specific rather than stylistic:
 *
 * - They are original. Stock photography of a person at a laptop illustrates
 *   nothing, and VISION §13 is explicit that ornament is a defect.
 * - They cost no request and no layout shift, so they cannot hurt the page
 *   experience signals the rest of this work is trying to protect.
 * - They inherit the page's colours through currentColor, so they are correct
 *   in dark mode without a second asset.
 * - They carry a real <title> and role="img", so a screen reader and a crawler
 *   both get the same sentence a sighted reader gets from the picture.
 *
 * Referenced from markdown as {{diagram:name}}. An unknown name fails the
 * build rather than leaving a literal placeholder on a published page.
 */

const F = 'font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif"';
const MUTED = 'fill="currentColor" opacity=".55"';

const wrap = (name, title, vb, body) =>
  `<figure class="dgm">
<svg viewBox="${vb}" role="img" aria-labelledby="t-${name}" xmlns="http://www.w3.org/2000/svg">
<title id="t-${name}">${title}</title>
${body}
</svg>
<figcaption>${title}</figcaption>
</figure>`;

// A row of task boxes. Used by several diagrams.
const boxes = (x, y, n, w, gap, opts = {}) => {
  let out = '';
  for (let i = 0; i < n; i++) {
    const bx = x + i * (w + gap);
    const filled = opts.filled && i < opts.filled;
    out += `<rect x="${bx}" y="${y}" width="${w}" height="26" rx="3" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.25" opacity="${filled ? '.9' : '.5'}"/>`;
  }
  return out;
};

export const DIAGRAMS = {

  'wip-vs-cycle-time': wrap('wip', 'Six things open finish later than three, because average completion time rises with the number in progress', '0 0 680 200', `
<text x="0" y="14" ${F} font-size="12" font-weight="700" fill="currentColor">SIX OPEN AT ONCE</text>
${boxes(0, 26, 6, 96, 8)}
<line x1="0" y1="70" x2="616" y2="70" stroke="currentColor" stroke-width="1.5"/>
<text x="628" y="74" ${F} font-size="11" ${MUTED}>later</text>
<text x="0" y="86" ${F} font-size="11" ${MUTED}>each one waits behind the others — everything finishes late</text>
<text x="0" y="130" ${F} font-size="12" font-weight="700" fill="currentColor">THREE OPEN AT ONCE</text>
${boxes(0, 142, 3, 96, 8)}
<line x1="0" y1="186" x2="304" y2="186" stroke="currentColor" stroke-width="1.5"/>
<text x="318" y="190" ${F} font-size="11" ${MUTED}>same work, shorter queue, sooner done</text>`),

  'convoy-effect': wrap('convoy', 'One long item at the front of the queue delays every short item behind it', '0 0 680 148', `
<text x="0" y="14" ${F} font-size="12" font-weight="700" fill="currentColor">ARRIVAL ORDER</text>
<rect x="0" y="26" width="300" height="30" rx="3" fill="currentColor" opacity=".9"/>
<text x="12" y="46" ${F} font-size="12" fill="var(--paper,#fff)" font-weight="700">one long awkward task</text>
${boxes(310, 28, 4, 82, 6)}
<path d="M0 74 L660 74" stroke="currentColor" stroke-width="1" opacity=".3"/>
<text x="0" y="92" ${F} font-size="11" ${MUTED}>four ten-minute tasks wait all day behind it. Nobody chose that —</text>
<text x="0" y="110" ${F} font-size="11" ${MUTED}>the list chose it, by having no opinion.</text>
<text x="0" y="132" ${F} font-size="11" font-weight="700" fill="currentColor">This is the convoy effect, and it is what a plain list does by default.</text>`),

  'urgent-important': wrap('matrix', 'Urgency is about when; importance is about consequence. Sorting on both axes keeps them apart', '0 0 680 300', `
<line x1="60" y1="16" x2="60" y2="264" stroke="currentColor" stroke-width="1.25"/>
<line x1="60" y1="264" x2="660" y2="264" stroke="currentColor" stroke-width="1.25"/>
<line x1="360" y1="16" x2="360" y2="264" stroke="currentColor" stroke-width="1" opacity=".3"/>
<line x1="60" y1="140" x2="660" y2="140" stroke="currentColor" stroke-width="1" opacity=".3"/>
<text x="72" y="42" ${F} font-size="12" font-weight="700" fill="currentColor">IMPORTANT · URGENT</text>
<text x="72" y="62" ${F} font-size="11" ${MUTED}>do it now, and it is loud enough</text>
<text x="72" y="78" ${F} font-size="11" ${MUTED}>that you will</text>
<text x="372" y="42" ${F} font-size="12" font-weight="700" fill="currentColor">IMPORTANT · NOT URGENT</text>
<text x="372" y="62" ${F} font-size="11" ${MUTED}>the quadrant that starves, because</text>
<text x="372" y="78" ${F} font-size="11" ${MUTED}>nothing here ever asks</text>
<text x="72" y="170" ${F} font-size="12" font-weight="700" fill="currentColor">NOT IMPORTANT · URGENT</text>
<text x="72" y="190" ${F} font-size="11" ${MUTED}>the loudest work on most days,</text>
<text x="72" y="206" ${F} font-size="11" ${MUTED}>and the reason above is empty</text>
<text x="372" y="170" ${F} font-size="12" font-weight="700" fill="currentColor">NEITHER</text>
<text x="372" y="190" ${F} font-size="11" ${MUTED}>cheap to drop once it is written</text>
<text x="372" y="206" ${F} font-size="11" ${MUTED}>down where you can see it</text>
<text x="72" y="286" ${F} font-size="11" font-weight="700" fill="currentColor">MORE URGENT</text>
<text x="372" y="286" ${F} font-size="11" font-weight="700" fill="currentColor">LESS URGENT</text>
<text x="20" y="126" ${F} font-size="11" font-weight="700" fill="currentColor" transform="rotate(-90 20 126)">MORE IMPORTANT</text>
<text x="20" y="250" ${F} font-size="11" font-weight="700" fill="currentColor" transform="rotate(-90 20 250)">LESS IMPORTANT</text>`),

  'starvation-aging': wrap('starve', 'Urgent work keeps arriving ahead of the important task, so it never reaches the front. Aging is the fix', '0 0 680 228', `
<text x="0" y="14" ${F} font-size="12" font-weight="700" fill="currentColor">WITHOUT AGING</text>
${boxes(0, 26, 5, 74, 8, { filled: 5 })}
<rect x="410" y="26" width="180" height="26" rx="3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 3"/>
<text x="420" y="44" ${F} font-size="11" fill="currentColor" font-weight="700">the important thing</text>
<text x="0" y="72" ${F} font-size="11" ${MUTED}>new urgent work keeps arriving on the left. The dashed item never runs.</text>
<text x="0" y="90" ${F} font-size="11" ${MUTED}>It is not forgotten — it never reaches the front. That is starvation.</text>
<line x1="0" y1="110" x2="660" y2="110" stroke="currentColor" stroke-width="1" opacity=".3"/>
<text x="0" y="140" ${F} font-size="12" font-weight="700" fill="currentColor">WITH AGING</text>
<rect x="0" y="152" width="180" height="26" rx="3" fill="none" stroke="currentColor" stroke-width="1.5"/>
<text x="10" y="170" ${F} font-size="11" fill="currentColor" font-weight="700">the important thing</text>
${boxes(196, 152, 5, 74, 8, { filled: 5 })}
<text x="0" y="198" ${F} font-size="11" ${MUTED}>a waiting item's priority rises until it must run. Every operating system</text>
<text x="0" y="216" ${F} font-size="11" ${MUTED}>does this. A standing first slot is the same idea, by hand.</text>`),

  'context-switch': wrap('switch', 'The same two hours in four pieces produces less, because each return pays to rebuild where you were', '0 0 680 198', `
<text x="0" y="14" ${F} font-size="12" font-weight="700" fill="currentColor">TWO HOURS, ONE BLOCK</text>
<rect x="0" y="26" width="600" height="26" rx="3" fill="currentColor" opacity=".9"/>
<text x="0" y="70" ${F} font-size="11" ${MUTED}>one load-in, then work</text>
<line x1="0" y1="90" x2="660" y2="90" stroke="currentColor" stroke-width="1" opacity=".3"/>
<text x="0" y="118" ${F} font-size="12" font-weight="700" fill="currentColor">TWO HOURS, FOUR PIECES</text>
<rect x="0" y="130" width="118" height="26" rx="3" fill="currentColor" opacity=".9"/>
<rect x="118" y="130" width="32" height="26" fill="currentColor" opacity=".18"/>
<rect x="150" y="130" width="118" height="26" rx="3" fill="currentColor" opacity=".9"/>
<rect x="268" y="130" width="32" height="26" fill="currentColor" opacity=".18"/>
<rect x="300" y="130" width="118" height="26" rx="3" fill="currentColor" opacity=".9"/>
<rect x="418" y="130" width="32" height="26" fill="currentColor" opacity=".18"/>
<rect x="450" y="130" width="118" height="26" rx="3" fill="currentColor" opacity=".9"/>
<text x="0" y="174" ${F} font-size="11" ${MUTED}>the pale blocks are the reload: what was pending, what you had ruled out.</text>
<text x="0" y="188" ${F} font-size="11" ${MUTED}>They are never on any list, which is why nobody budgets for them.</text>`),

  'ivy-lee-order': wrap('ivylee', 'Six tasks in strict order: the second does not open until the first is closed', '0 0 680 248', `
${[1,2,3,4,5,6].map((n,i)=>{const y=8+i*36;const done=n===1;return `
<text x="0" y="${y+18}" ${F} font-size="11" ${MUTED}>0${n}</text>
<rect x="26" y="${y}" width="${n===1?420:300}" height="26" rx="3" fill="${done?'currentColor':'none'}" stroke="currentColor" stroke-width="1.25" opacity="${done?'.9':(n===2?'.55':'.28')}"/>
${n===2?`<text x="340" y="${y+18}" ${F} font-size="11" fill="currentColor" font-weight="700">← opens when 01 closes</text>`:''}
${n>2?`<text x="340" y="${y+18}" ${F} font-size="11" ${MUTED}>waiting</text>`:''}`}).join('')}
<text x="26" y="240" ${F} font-size="11" font-weight="700" fill="currentColor">The order is decided the night before and is not renegotiated in the morning.</text>`),

  'estimate-vs-capacity': wrap('capacity', 'Adding up the estimates is the test: if the total exceeds the hours, no ordering rule fixes it', '0 0 680 188', `
<text x="0" y="14" ${F} font-size="12" font-weight="700" fill="currentColor">HOURS ACTUALLY AVAILABLE</text>
<rect x="0" y="24" width="380" height="28" rx="3" fill="none" stroke="currentColor" stroke-width="1.5"/>
<text x="392" y="43" ${F} font-size="11" ${MUTED}>what is left of the day</text>
<text x="0" y="86" ${F} font-size="12" font-weight="700" fill="currentColor">WHAT YOU PLANNED, ADDED UP</text>
<rect x="0" y="96" width="380" height="28" rx="3" fill="currentColor" opacity=".9"/>
<rect x="380" y="96" width="240" height="28" rx="3" fill="currentColor" opacity=".25"/>
<line x1="380" y1="88" x2="380" y2="134" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 3"/>
<text x="0" y="154" ${F} font-size="11" ${MUTED}>the shaded overhang is a capacity problem, not a prioritisation one.</text>
<text x="0" y="172" ${F} font-size="11" font-weight="700" fill="currentColor">Putting the right things first still leaves the same number of hours.</text>`),

  'priority-inversion': wrap('inversion', 'A small task can hold something a large one needs, so the important work is blocked by the trivial work', '0 0 680 216', `
<text x="0" y="14" ${F} font-size="12" font-weight="700" fill="currentColor">WHAT YOU SEE</text>
<rect x="0" y="26" width="420" height="30" rx="3" fill="currentColor" opacity=".9"/>
<text x="12" y="46" ${F} font-size="12" fill="var(--paper,#fff)" font-weight="700">the quarter's work — high priority, not moving</text>
<text x="0" y="76" ${F} font-size="11" ${MUTED}>ranked first, worked on by nobody, no obvious reason</text>
<line x1="0" y1="94" x2="660" y2="94" stroke="currentColor" stroke-width="1" opacity=".3"/>
<text x="0" y="122" ${F} font-size="12" font-weight="700" fill="currentColor">WHAT IS ACTUALLY HAPPENING</text>
<rect x="0" y="134" width="420" height="30" rx="3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 3"/>
<text x="12" y="154" ${F} font-size="12" fill="currentColor" font-weight="700">blocked</text>
<rect x="436" y="134" width="150" height="30" rx="3" fill="currentColor" opacity=".9"/>
<text x="446" y="154" ${F} font-size="11" fill="var(--paper,#fff)" font-weight="700">a two-line reply</text>
<path d="M436 149 L424 149" stroke="currentColor" stroke-width="1.5"/>
<path d="M430 145 L424 149 L430 153" fill="none" stroke="currentColor" stroke-width="1.5"/>
<text x="0" y="186" ${F} font-size="11" ${MUTED}>Mars Pathfinder reset repeatedly in 1997 for exactly this reason: a low-priority</text>
<text x="0" y="204" ${F} font-size="11" ${MUTED}>task held a lock the high-priority one needed. The blocker's size tells you nothing.</text>`),

  'utilisation-vs-wait': wrap('util', 'Waiting time rises steeply as a system approaches full utilisation, which is why a fully booked day has nowhere to put an overrun', '0 0 680 256', `
<line x1="56" y1="16" x2="56" y2="200" stroke="currentColor" stroke-width="1.25"/>
<line x1="56" y1="200" x2="640" y2="200" stroke="currentColor" stroke-width="1.25"/>
<path d="M56 196 C 240 190, 400 172, 500 140 S 596 60, 614 20" fill="none" stroke="currentColor" stroke-width="2"/>
<line x1="500" y1="20" x2="500" y2="200" stroke="currentColor" stroke-width="1" stroke-dasharray="3 3" opacity=".5"/>
<line x1="336" y1="20" x2="336" y2="200" stroke="currentColor" stroke-width="1" stroke-dasharray="3 3" opacity=".5"/>
<text x="120" y="176" ${F} font-size="11" ${MUTED}>plenty of room</text>
<text x="344" y="120" ${F} font-size="11" ${MUTED}>getting tight</text>
<text x="508" y="60" ${F} font-size="11" font-weight="700" fill="currentColor">no room at all</text>
<text x="56" y="222" ${F} font-size="11" font-weight="700" fill="currentColor">50%</text>
<text x="320" y="222" ${F} font-size="11" font-weight="700" fill="currentColor">75%</text>
<text x="482" y="222" ${F} font-size="11" font-weight="700" fill="currentColor">90%</text>
<text x="596" y="222" ${F} font-size="11" font-weight="700" fill="currentColor">100%</text>
<text x="280" y="244" ${F} font-size="11" font-weight="700" fill="currentColor">HOW FULL THE DAY IS →</text>
<text x="18" y="200" ${F} font-size="11" font-weight="700" fill="currentColor" transform="rotate(-90 18 200)">DELAY WHEN SOMETHING SLIPS →</text>`),

  'three-and-no-fourth': wrap('top3', 'Three lines and no fourth: the limit is what turns a list into a decision', '0 0 680 182', `
${[1,2,3].map((n,i)=>`<text x="0" y="${26+i*40}" ${F} font-size="11" ${MUTED}>0${n}</text>
<rect x="26" y="${8+i*40}" width="560" height="26" rx="3" fill="none" stroke="currentColor" stroke-width="1.25"/>`).join('')}
<text x="0" y="146" ${F} font-size="11" ${MUTED}>04</text>
<rect x="26" y="128" width="560" height="26" rx="3" fill="none" stroke="currentColor" stroke-width="1.25" stroke-dasharray="4 4" opacity=".3"/>
<text x="38" y="146" ${F} font-size="11" ${MUTED} font-style="italic">there is no fourth line</text>
<text x="0" y="168" ${F} font-size="11" font-weight="700" fill="currentColor">A constraint you can exceed is a suggestion. This one is enforced.</text>`)
};
