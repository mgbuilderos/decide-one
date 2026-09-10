import React from 'react';
import { ArrowLeft } from 'lucide-react';

/**
 * Methods & Attributions (M-A7).
 *
 * Marketing, not only defence: *we did not invent these; they have worked for
 * a century, and we credit the people who found them.*
 *
 * Two rules govern every word here.
 *
 * M-A1 — only methods that are genuinely free, never renamed to avoid
 * crediting whoever found them. Renaming to dodge attribution is passing off:
 * lawful, and still wrong.
 *
 * M-A3 — the popular name for the urgent/important matrix is a
 * misattribution, and this page says so plainly rather than repeating it.
 *
 * M-A5's blacklist is observed throughout: no coined vocabulary belonging to
 * any living author or in-copyright book appears anywhere on this page.
 */

const METHODS = [
  {
    name: 'Rule of 3',
    origin: 'No single originator',
    period: 'Folk practice',
    problem: 'There is too much on today.',
    does: 'Caps the day at three things and refuses a fourth.',
    standing:
      'Nobody owns this one. Grouping work in threes is old, common, and has been arrived at independently many times over; no person or company can claim it, and we credit none.'
  },
  {
    name: 'The Ivy Lee Method',
    origin: 'Ivy Lee',
    period: '1918',
    problem: "Yesterday's work is still open.",
    does: 'Six items in order. The second cannot start until the first is closed.',
    standing:
      'Attributed to the consultant Ivy Lee, who died in 1934. The method itself was never copyrighted and no rights holder exists. The often-repeated detail about the fee he was paid comes from later retellings, so we leave it out rather than pass on a story we cannot check.'
  },
  {
    name: 'The Urgent/Important Matrix',
    origin: 'Dwight D. Eisenhower, then Stephen Covey',
    period: '1954, then 1989',
    problem: 'Everything looks urgent.',
    does: 'Asks whether a task is urgent and whether it matters, then places it.',
    standing:
      'Usually named after Eisenhower alone, and that is a misattribution worth correcting. In a 1954 address he quoted the distinction between the urgent and the important, crediting a university president rather than himself. He never drew a matrix. The four-quadrant form was built by Stephen Covey in 1989. We credit both, use neither man as a brand, and keep Covey’s coined vocabulary out of the product entirely.'
  }
];

const SUPPORTING = [
  {
    name: 'Timeboxing',
    origin: 'C. Northcote Parkinson',
    period: '1955',
    standing:
      'Parkinson observed that work expands to fill the time available for its completion. Putting a duration on a line is the practical answer to that, and the observation is a published idea nobody owns.'
  },
  {
    name: 'If-then planning',
    origin: 'Peter Gollwitzer',
    period: '1999',
    standing:
      'Deciding in advance when and where you will do something. This is the one place where we have a real body of evidence rather than an intuition, and it is stated exactly on the science note below.'
  }
];

function Row({ name, origin, period, problem, does, standing }) {
  return (
    <section className="py-6 border-b border-black/[0.08] dark:border-white/[0.1] last:border-0">
      <div className="flex items-baseline justify-between gap-4 flex-wrap">
        <h3 className="text-[15px] font-bold text-neutral-900 dark:text-white">{name}</h3>
        <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
          {origin} · {period}
        </p>
      </div>
      {problem && (
        <p className="mt-2 text-[13px] leading-[22px] text-neutral-700 dark:text-neutral-300">
          <span className="text-neutral-400">Treats: </span>{problem}
          <span className="text-neutral-400"> — </span>{does}
        </p>
      )}
      <p className="mt-2 text-[12px] leading-[20px] text-neutral-500 dark:text-neutral-400">{standing}</p>
    </section>
  );
}

export default function MethodsPage({ onBack }) {
  return (
    <div className="min-h-screen w-full bg-white dark:bg-[#0f0f10] text-neutral-900 dark:text-neutral-100">
      <div className="max-w-[720px] mx-auto px-5 sm:px-8 py-10">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>

        <h1 className="mt-6 text-2xl font-bold tracking-tight">Methods &amp; attributions</h1>
        <p className="mt-2 text-[13px] leading-[22px] text-neutral-600 dark:text-neutral-300 max-w-[560px]">
          We did not invent any of these. They have worked for the better part of a century, and
          we credit the people who found them. None is renamed, and none is dressed up as ours.
        </p>

        <h2 className="mt-9 text-[11px] font-bold uppercase tracking-widest text-neutral-400">
          The three methods
        </h2>
        <div className="mt-1">
          {METHODS.map(m => <Row key={m.name} {...m} />)}
        </div>

        <h2 className="mt-9 text-[11px] font-bold uppercase tracking-widest text-neutral-400">
          What the right-hand side is built on
        </h2>
        <div className="mt-1">
          {SUPPORTING.map(m => <Row key={m.name} {...m} />)}
        </div>

        <h2 className="mt-9 text-[11px] font-bold uppercase tracking-widest text-neutral-400">
          Why none of this is owned
        </h2>
        <p className="mt-2 text-[13px] leading-[22px] text-neutral-700 dark:text-neutral-300">
          Copyright protects the expression of an idea, never the idea itself. US law puts it
          plainly: protection does not extend to <em>any idea, procedure, process, system, method
          of operation</em> — 17 U.S.C. §102(b), a rule settled since <em>Baker v. Selden</em> in
          1879. A method can be described, taught and used freely. What can be owned is a
          <em> name</em>, which is exactly why we use the plain descriptive ones.
        </p>

        <h2 className="mt-9 text-[11px] font-bold uppercase tracking-widest text-neutral-400">
          The one claim we make about evidence
        </h2>
        <p className="mt-2 text-[13px] leading-[22px] text-neutral-700 dark:text-neutral-300">
          Gollwitzer and Sheeran&rsquo;s 2006 meta-analysis covered 94 studies and more than 8,000
          participants, and found a medium-to-large effect for if-then planning
          (<span className="tabular-nums">d = 0.65</span>). <strong>That finding is about if-then
          planning and nothing else.</strong> It is not a study of this product, it does not
          transfer to the other methods here, and we make no claim that using Decide One will
          produce any particular result for you.
        </p>

        <p className="mt-10 pt-5 border-t border-black/[0.08] dark:border-white/[0.1] text-[11px] leading-[18px] text-neutral-400">
          Corrections are welcome. If something on this page is wrong, we would rather fix it than
          keep repeating it.
        </p>
      </div>
    </div>
  );
}
