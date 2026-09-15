import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

/**
 * Terms, privacy and refunds (B4). A merchant of record requires all three.
 *
 * Everything here is written to match what the product actually does — local
 * storage, no account, opt-in analytics, a shutter that is not a vault. If the
 * product changes, this changes with it.
 *
 * Items in [SQUARE BRACKETS] are facts only the founder can supply: the legal
 * entity, its address, the contact address, and the governing jurisdiction.
 * They must be filled in before launch.
 *
 * M-A8 stands: this is a careful draft, not legal advice, and an IP/commercial
 * attorney should review all three before the first sale.
 */

const ENTITY = import.meta.env.VITE_LEGAL_ENTITY || 'Legal Entity To Be Confirmed';
const ADDRESS = import.meta.env.VITE_REGISTERED_ADDRESS || 'Registered Address To Be Confirmed';
const CONTACT = import.meta.env.VITE_SUPPORT_EMAIL || 'Support Email To Be Confirmed';
const JURISDICTION = import.meta.env.VITE_LEGAL_JURISDICTION || 'Jurisdiction To Be Confirmed';
const EFFECTIVE = import.meta.env.VITE_LEGAL_EFFECTIVE_DATE || 'Effective Date To Be Confirmed';
const IS_LEGAL_DRAFT = !import.meta.env.VITE_LEGAL_ENTITY || !import.meta.env.VITE_REGISTERED_ADDRESS || !import.meta.env.VITE_SUPPORT_EMAIL || !import.meta.env.VITE_LEGAL_JURISDICTION || !import.meta.env.VITE_LEGAL_EFFECTIVE_DATE;

const TABS = [
  { id: 'terms', label: 'Terms' },
  { id: 'privacy', label: 'Privacy' },
  { id: 'refunds', label: 'Refunds' }
];

function Section({ title, children }) {
  return (
    <section className="mb-7">
      <h3 className="text-[13px] font-bold uppercase tracking-wider text-neutral-900 dark:text-white mb-2">{title}</h3>
      <div className="space-y-2.5 text-[13px] leading-[22px] text-neutral-700 dark:text-neutral-300">{children}</div>
    </section>
  );
}

export default function LegalPages({ onBack }) {
  const [tab, setTab] = useState('terms');

  return (
    <div className="min-h-screen w-full bg-white dark:bg-[#0f0f0f] text-neutral-900 dark:text-neutral-100">
      <div className="max-w-[720px] mx-auto px-5 sm:px-8 py-10">

        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>

        <h1 className="mt-6 text-2xl font-bold tracking-tight">Decide One — legal</h1>
        <p className="mt-1.5 text-[12px] text-neutral-500 dark:text-neutral-400">
          Effective {EFFECTIVE}. Written to describe what the software actually does.
        </p>

        {IS_LEGAL_DRAFT && <p role="status" className="mt-4 rounded-lg border border-black/10 bg-neutral-50 px-4 py-3 text-[12px] leading-5 text-neutral-600 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300">
          Draft for product review. Legal entity, address, support email, jurisdiction, and effective date must be supplied before publication.
        </p>}

        <div className="mt-6 flex items-center gap-1 border-b border-black/[0.08] dark:border-white/[0.1]">
          {TABS.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`px-3 py-2 text-[12px] font-semibold transition-colors cursor-pointer border-b-2 -mb-px ${
                tab === t.id
                  ? 'border-neutral-900 dark:border-white text-neutral-900 dark:text-white'
                  : 'border-transparent text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-7">
          {tab === 'terms' && (
            <>
              <Section title="Who you are dealing with">
                <p>Decide One is published by {ENTITY}, {ADDRESS}. You can reach a person at {CONTACT}.</p>
                <p>Payment is processed by a third-party merchant of record, who is the seller of record for your purchase and issues your receipt. Their terms apply to the payment itself; these terms cover the software.</p>
              </Section>
              <Section title="What you are buying">
                <p>A one-time licence to use Decide One on your own devices, for as long as you like. There is no subscription and no recurring charge.</p>
                <p>The licence is personal and non-transferable. You may not resell it, share your licence key publicly, or redistribute the software as your own.</p>
              </Section>
              <Section title="What the software does and does not do">
                <p>Decide One stores your entries in your browser's local storage on the device you use it on. There is no account and no cloud sync. Exports are available, and are encrypted if you set a passphrase.</p>
                <p><strong>Because your data lives only on your device, keeping a backup is your responsibility.</strong> Clearing your browser data, losing the device, or using a different browser will lose entries that were not exported. We cannot recover them, because we never had a copy.</p>
                <p>The privacy shutter clears the screen from view. It is not a security boundary, and it does not encrypt anything.</p>
              </Section>
              <Section title="The methods">
                <p>The decision methods Decide One implements are long-established and used under their ordinary names, with attribution. Decide One is not affiliated with, endorsed by, or connected to any originator or their estate.</p>
              </Section>
              <Section title="Warranty and liability">
                <p>The software is provided as it is. We do not warrant that it will be uninterrupted or error-free, or that it will produce any particular result for you.</p>
                <p>To the extent the law allows, our total liability to you is limited to what you paid. Nothing here limits any right you have under consumer law that cannot be limited by contract.</p>
              </Section>
              <Section title="Changes and governing law">
                <p>If these terms change materially, the effective date above changes and the current version is always the one published here. These terms are governed by the laws of {JURISDICTION}.</p>
              </Section>
            </>
          )}

          {tab === 'privacy' && (
            <>
              <Section title="The short version">
                <p><strong>What you write never leaves your device.</strong> Entries, priorities, notes and timings are saved in your browser's local storage. They are not uploaded, not synced, and not visible to us.</p>
                <p>There is no account, so we do not hold your name, email or password for using the app.</p>
              </Section>
              <Section title="Anonymous usage analytics — off unless you turn them on">
                <p>Decide One can report anonymous usage — which features are opened, how long a session lasts, where errors occur. <strong>This is off by default and only runs if you switch it on</strong> in the menu under “Anonymous usage.” You can switch it off again at any time.</p>
                <p>When it is on, the text you write is stripped before anything is sent: task text, notes, reflections and search queries are never transmitted. What is sent is that an action happened, not what it contained.</p>
                <p>An anonymous identifier is stored on your device so repeat sessions can be counted. It is not linked to your name or email, because we do not have them.</p>
              </Section>
              <Section title="Payment data">
                <p>We never see or store your card details. Payment is handled by our merchant of record, who processes the transaction and holds the billing information under their own privacy policy.</p>
              </Section>
              <Section title="Your control">
                <p>You can export everything at any time, delete everything by clearing the app's data, and turn analytics off. Because your entries are on your device rather than our servers, deletion is immediate and complete.</p>
                <p>For anything else, or to ask what is held about a purchase, write to {CONTACT}.</p>
              </Section>
            </>
          )}

          {tab === 'refunds' && (
            <>
              <Section title="Sixty days, no questions">
                <p><strong>If Decide One is not for you, write to {CONTACT} within 60 days of purchase and we will refund you in full.</strong> You do not need to give a reason, and you do not need to justify it.</p>
                <p>Refunds are issued to the original payment method by our merchant of record. It usually reaches you within a few business days, depending on your bank.</p>
              </Section>
              <Section title="Why the policy is this generous">
                <p>Decide One is a one-time purchase with a free version you can use first. If someone pays and finds it does not suit how they work, keeping their money helps nobody.</p>
              </Section>
              <Section title="After a refund">
                <p>Your licence key stops being valid, and the app returns to its free version. <strong>Your entries stay exactly where they are</strong> — on your device, untouched. A refund never deletes your work.</p>
              </Section>
              <Section title="Statutory rights">
                <p>This policy sits on top of your legal rights, it does not replace them. If the law where you live gives you a stronger right to a refund, that right applies.</p>
              </Section>
            </>
          )}
        </div>

        <p className="mt-10 pt-5 border-t border-black/[0.08] dark:border-white/[0.1] text-[11px] leading-[18px] text-neutral-500">
          Questions about any of this: {CONTACT}.
        </p>
      </div>
    </div>
  );
}
