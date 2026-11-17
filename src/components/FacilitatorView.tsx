import React from 'react';

interface FacilitatorViewProps {
  onReturnToMission: () => void;
}

export const FacilitatorView: React.FC<FacilitatorViewProps> = ({
  onReturnToMission,
}) => {
  const observationRows = [
    {
      observation: 'Learners cannot tell where to begin.',
      response: 'Shorten the opening and make the first action more visible.',
    },
    {
      observation: 'Learners skip directly to the answer.',
      response:
        'Ask why; consider whether the earlier prompts feel too long or unclear. Do not assume skipping means a lack of motivation.',
    },
    {
      observation: 'Learners use a clue but cannot explain the boundary.',
      response:
        'Revise the trace prompt or add a worked example before the mission. Retest with a different problem.',
    },
    {
      observation: 'Milestones distract from debugging.',
      response:
        'Reduce or remove them rather than adding more game features.',
    },
    {
      observation: 'Help feels punitive or unavailable.',
      response:
        'Make the support choices more visible and discuss realistic access with learners.',
    },
    {
      observation: 'Technical English is confusing.',
      response:
        'Test a plain-language glossary or learner-requested translation; do not assume every multilingual learner needs the same support.',
    },
  ];

  const designChoices = [
    {
      label: 'Segmenting',
      detail: 'One main action is presented at a time.',
    },
    {
      label: 'Signaling',
      detail: 'The loop condition is highlighted at the moment it matters.',
    },
    {
      label: 'Coherence',
      detail:
        'No timer, advertising, public rankings, or decorative distractions compete with the task.',
    },
    {
      label: 'Learner control',
      detail: 'Hints and human help remain available without penalty.',
    },
    {
      label: 'Accessibility',
      detail:
        'The experience is text-based and does not depend on color or audio; learners can explain in writing, aloud, or through a trace.',
    },
    {
      label: 'Gamification',
      detail:
        'The mission and self-marked milestones recognize reasoning and revision rather than speed.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <p className="text-xs font-medium text-slate-500">
            Facilitator Notes · Formative Testing Protocol
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 [text-wrap:balance]">
            Testing This Prototype
          </h1>
        </div>
        <button
          type="button"
          onClick={onReturnToMission}
          className="px-4 py-2 min-h-[40px] text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap"
        >
          Return to Mission
        </button>
      </div>

      {/* Design Question */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">
          The Design Question
        </h2>
        <p className="text-base font-medium text-slate-900 leading-relaxed">
          When a novice encounters an unexpected Java output, do staged hints and
          a short explanation prompt help them continue reasoning without making
          the experience feel like extra hoops?
        </p>
        <p className="text-sm text-slate-600 leading-relaxed">
          This prototype tests a small part of the proposed learning journey:
          the moment from noticing a bug to explaining a fix. It does not yet
          test a live AI helper, an entire course, or long-term learning.
        </p>
      </section>

      {/* Suggested Formative Session */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Suggested Formative Session
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Invite a small number of real learners who represent different levels
          of programming experience and language backgrounds, where feasible.
          Follow school requirements for consent, assent, privacy, and
          participation.
        </p>
        <ol className="list-decimal pl-5 space-y-2.5 text-sm text-slate-800 leading-relaxed">
          <li>
            Explain that the <strong>prototype is being tested, not the student</strong>.
            Participation and responses should not affect grades.
          </li>
          <li>
            Ask the learner to work through the mission and think aloud.
          </li>
          <li>
            Observe where they hesitate, which hints they choose, what they
            test, and whether they can explain the result.
          </li>
          <li>
            Ask follow-up questions:
            <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-700">
              <li>&ldquo;What would you normally do at this point in a lab?&rdquo;</li>
              <li>&ldquo;Which step helped you? Which felt like extra work?&rdquo;</li>
              <li>
                &ldquo;Were any words, instructions, or code displays difficult to
                understand?&rdquo;
              </li>
              <li>
                &ldquo;How comfortable would you feel asking a peer or teacher for
                help?&rdquo;
              </li>
            </ul>
          </li>
          <li>
            Record observations without unnecessary identifying information. Do
            not invent results or present a persona as a real participant.
          </li>
        </ol>
      </section>

      {/* What to Look For */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">
          What to Look For — and What to Change
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600">
                <th className="py-2.5 pr-4 font-semibold">Observation</th>
                <th className="py-2.5 pl-4 font-semibold">
                  Possible design response
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {observationRows.map((row) => (
                <tr key={row.observation} className="align-top">
                  <td className="py-3 pr-4 font-medium text-slate-900">
                    {row.observation}
                  </td>
                  <td className="py-3 pl-4 text-slate-700">{row.response}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-600 pt-2">
          Interpretation: A small usability round can reveal design problems, but
          it cannot establish that the experience improves learning. The
          independent challenge offers an early signal, not proof of transfer or
          long-term effectiveness.
        </p>
      </section>

      {/* Design Choices */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Design Choices</h2>
        <dl className="grid sm:grid-cols-2 gap-4">
          {designChoices.map((item) => (
            <div
              key={item.label}
              className="p-4 bg-slate-50 border border-slate-200 rounded-lg"
            >
              <dt className="text-sm font-semibold text-slate-900">
                {item.label}
              </dt>
              <dd className="text-sm text-slate-600 mt-1 leading-relaxed">
                {item.detail}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
};
