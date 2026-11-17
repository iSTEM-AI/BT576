import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Circle,
  Copy,
  HelpCircle,
  Lightbulb,
  RotateCcw,
} from 'lucide-react';
import { JavaRunResult } from '../logic/javaLoopRunner';
import {
  LearnerNotes,
  MILESTONES,
  MilestoneId,
  StageId,
  evaluateClueOneRow,
} from '../logic/missionState';

interface StageContentProps {
  stage: StageId;
  previousStage: StageId;
  milestones: Record<MilestoneId, boolean>;
  notes: LearnerNotes;
  lastRunResult: JavaRunResult | null;
  onNavigate: (nextStage: StageId) => void;
  onToggleMilestone: (id: MilestoneId) => void;
  onUpdateNotes: (patch: Partial<LearnerNotes>) => void;
  onOpenExport: () => void;
  onRestartMission: () => void;
}

const MilestoneToggleButton: React.FC<{
  milestoneId: MilestoneId;
  checked: boolean;
  onToggle: (id: MilestoneId) => void;
}> = ({ milestoneId, checked, onToggle }) => {
  const def = MILESTONES.find((m) => m.id === milestoneId)!;
  return (
    <div className="pt-4 border-t border-slate-200">
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => onToggle(milestoneId)}
        className={`w-full flex items-center justify-between gap-3 px-4 py-3 min-h-[44px] rounded-lg border text-left transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 ${
          checked
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
            : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
        }`}
      >
        <span className="flex items-center gap-3">
          {checked ? (
            <CheckCircle2
              className="w-5 h-5 text-emerald-600 shrink-0"
              aria-hidden="true"
            />
          ) : (
            <Circle
              className="w-5 h-5 text-slate-400 shrink-0"
              aria-hidden="true"
            />
          )}
          <span>
            <span className="text-sm font-semibold">
              Mark {def.title} milestone
            </span>
            <span className="block text-xs text-slate-600">
              {def.description}
            </span>
          </span>
        </span>
        <span className="text-xs font-medium text-slate-600 shrink-0">
          {checked ? 'Marked' : 'Unmarked'}
        </span>
      </button>
    </div>
  );
};

export const StageContent: React.FC<StageContentProps> = ({
  stage,
  previousStage,
  milestones,
  notes,
  lastRunResult,
  onNavigate,
  onToggleMilestone,
  onUpdateNotes,
  onOpenExport,
  onRestartMission,
}) => {
  const [clueChecked, setClueChecked] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);

  const copyText = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPrompt(id);
      setTimeout(() => setCopiedPrompt(null), 2000);
    } catch {
      // Ignore clipboard failure
    }
  };

  if (stage === 'mission') {
    return (
      <article className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
        <header className="space-y-2 pb-5 border-b border-slate-200">
          <p className="text-xs font-medium text-slate-500">
            Beginning Java · 10–15 minutes · No timer or penalty for hints
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 [text-wrap:balance]">
            Debug Quest: The Missing Number
          </h1>
          <p className="text-base text-slate-700 leading-relaxed">
            Investigate a Java program, test one idea, and explain what you
            discover. A bug is not a failure. It is a clue.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">
            Your Mission Map
          </h2>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            A small Java program is supposed to print the numbers{' '}
            <strong className="font-semibold text-slate-900">1, 2, and 3</strong>,
            each on a separate line. But the final number has disappeared.
          </p>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Your job is not simply to make the output look right. Your job is to
            figure out <strong className="font-semibold text-slate-900">why</strong>{' '}
            the program stops early.
          </p>
        </section>

        <section className="pt-4 border-t border-slate-200 space-y-2.5">
          <h2 className="text-sm font-semibold text-slate-900">
            What this prototype can and cannot do
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-600 leading-relaxed">
            <li>
              Navigate freely between challenges, staged clues, and help
              options at any point.
            </li>
            <li>
              Run and edit the Java code right in the workbench, or copy it into
              your usual Java environment.
            </li>
            <li>
              Mark your own milestones on your Progress Card. Export your notes
              anytime if you want a copy.
            </li>
            <li>
              The hints are written in advance. There is no live AI in this
              version, and peer/teacher options provide message prompts rather
              than sending messages automatically.
            </li>
          </ul>
        </section>

        <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('case')}
            className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors whitespace-nowrap"
          >
            Start the mission
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onNavigate('help')}
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap"
          >
            <HelpCircle className="w-4 h-4" aria-hidden="true" />
            Get help
          </button>
        </div>
      </article>
    );
  }

  if (stage === 'case') {
    return (
      <article className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
        <header className="space-y-1 pb-4 border-b border-slate-200">
          <p className="text-xs font-medium text-slate-500">
            Stage 1 of 5 · MissingNumber.java
          </p>
          <h1 className="text-2xl font-bold text-slate-900">
            Open the Case
          </h1>
        </header>

        <div className="space-y-3 text-sm sm:text-base text-slate-700 leading-relaxed">
          <p>
            Look at <code className="font-mono text-slate-900">MissingNumber.java</code>{' '}
            in the workbench. Run it using <strong>Run Java Program</strong> (or
            copy it into your Java environment) and compare the actual output
            with what it should print: <code className="font-mono">1, 2, 3</code>.
          </p>
        </div>

        <div className="space-y-4 pt-2">
          <div>
            <label
              htmlFor="case-expected"
              className="block text-sm font-medium text-slate-800 mb-1.5"
            >
              I expected:
            </label>
            <input
              id="case-expected"
              type="text"
              value={notes.caseExpected}
              onChange={(e) => onUpdateNotes({ caseExpected: e.target.value })}
              placeholder="For example: 1, 2, 3 on separate lines"
              className="w-full px-3.5 py-2.5 min-h-[42px] text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label
              htmlFor="case-observed"
              className="block text-sm font-medium text-slate-800 mb-1.5"
            >
              I observed:
            </label>
            <input
              id="case-observed"
              type="text"
              value={notes.caseObserved}
              onChange={(e) => onUpdateNotes({ caseObserved: e.target.value })}
              placeholder="What did the program actually print?"
              className="w-full px-3.5 py-2.5 min-h-[42px] text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label
              htmlFor="case-difference"
              className="block text-sm font-medium text-slate-800 mb-1.5"
            >
              One difference I notice:
            </label>
            <textarea
              id="case-difference"
              rows={2}
              value={notes.caseDifference}
              onChange={(e) =>
                onUpdateNotes({ caseDifference: e.target.value })
              }
              placeholder="Describe what is missing or different..."
              className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        <MilestoneToggleButton
          milestoneId="detective"
          checked={milestones.detective}
          onToggle={onToggleMilestone}
        />

        <div className="pt-4 border-t border-slate-200 space-y-3">
          <h2 className="text-sm font-semibold text-slate-900">
            Choose your next move
          </h2>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onNavigate('predict')}
              className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors whitespace-nowrap"
            >
              I have an idea
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('hint-one')}
              className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] text-sm font-medium text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap"
            >
              <Lightbulb className="w-4 h-4 text-amber-600" aria-hidden="true" />
              Show me a clue
            </button>
            <button
              type="button"
              onClick={() => onNavigate('help')}
              className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap"
            >
              <HelpCircle className="w-4 h-4" aria-hidden="true" />
              I want human help
            </button>
          </div>
        </div>
      </article>
    );
  }

  if (stage === 'predict') {
    return (
      <article className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
        <header className="space-y-1 pb-4 border-b border-slate-200">
          <p className="text-xs font-medium text-slate-500">
            Stage 2 of 5 · Loop Condition
          </p>
          <h1 className="text-2xl font-bold text-slate-900">
            Make a Prediction
          </h1>
        </header>

        <div className="space-y-3 text-sm sm:text-base text-slate-700 leading-relaxed">
          <p>Look closely at the highlighted line in the workbench:</p>
          <pre className="bg-slate-900 text-blue-200 font-mono text-sm px-4 py-3 rounded-lg overflow-x-auto">
            while (number &lt; 3)
          </pre>
          <p>
            The loop continues only while its condition is true. Make a guess
            before changing the program—you do not have to be certain. A useful
            prediction is something you can test.
          </p>
        </div>

        <div>
          <label
            htmlFor="prediction-text"
            className="block text-sm font-medium text-slate-800 mb-1.5"
          >
            I think the program stops before printing 3 because:
          </label>
          <textarea
            id="prediction-text"
            rows={3}
            value={notes.predictionText}
            onChange={(e) => onUpdateNotes({ predictionText: e.target.value })}
            placeholder="Write your prediction here..."
            className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <MilestoneToggleButton
          milestoneId="predictor"
          checked={milestones.predictor}
          onToggle={onToggleMilestone}
        />

        <div className="pt-4 border-t border-slate-200 space-y-3">
          <h2 className="text-sm font-semibold text-slate-900">
            Choose your path
          </h2>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onNavigate('experiment')}
              className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors whitespace-nowrap"
            >
              Test my idea
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('hint-one')}
              className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] text-sm font-medium text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap"
            >
              <Lightbulb className="w-4 h-4 text-amber-600" aria-hidden="true" />
              Give me a small clue
            </button>
            <button
              type="button"
              onClick={() => onNavigate('hint-two')}
              className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] text-sm font-medium text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap"
            >
              <Lightbulb className="w-4 h-4 text-amber-600" aria-hidden="true" />
              Give me a more specific clue
            </button>
            <button
              type="button"
              onClick={() => onNavigate('help')}
              className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap"
            >
              <HelpCircle className="w-4 h-4" aria-hidden="true" />
              Ask a person
            </button>
          </div>
        </div>
      </article>
    );
  }

  if (stage === 'hint-one') {
    const updateRow = (
      idx: number,
      field: 'conditionTrue' | 'printsValue',
      val: string,
    ) => {
      const nextRows = notes.clueOneRows.map((r, i) =>
        i === idx ? { ...r, [field]: val } : r,
      );
      onUpdateNotes({ clueOneRows: nextRows });
    };

    return (
      <article className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
        <header className="space-y-1 pb-4 border-b border-slate-200">
          <p className="text-xs font-medium text-slate-500">
            Clue 1 · Trace Table
          </p>
          <h1 className="text-2xl font-bold text-slate-900">
            Follow the Number
          </h1>
        </header>

        <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
          Try tracing the value of <code className="font-mono">number</code>{' '}
          each time the program checks the{' '}
          <code className="font-mono">while (number &lt; 3)</code> condition.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-700">
                <th className="py-2.5 pr-4 font-semibold">
                  Value of <code className="font-mono">number</code>
                </th>
                <th className="py-2.5 px-4 font-semibold">
                  Is <code className="font-mono">number &lt; 3</code> true?
                </th>
                <th className="py-2.5 pl-4 font-semibold">
                  Does the loop print it?
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {notes.clueOneRows.map((row, idx) => {
                const feedback = evaluateClueOneRow(row);
                return (
                  <tr key={row.value} className="align-middle">
                    <td className="py-3 pr-4 font-mono font-semibold text-slate-900 tabular-nums">
                      {row.value}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        aria-label={`Is number less than 3 true when number is ${row.value}`}
                        value={row.conditionTrue}
                        onChange={(e) =>
                          updateRow(idx, 'conditionTrue', e.target.value)
                        }
                        className="px-3 py-2 min-h-[40px] text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        <option value="">Choose...</option>
                        <option value="true">true</option>
                        <option value="false">false</option>
                      </select>
                      {clueChecked && row.conditionTrue && (
                        <span
                          className={`ml-2 text-xs font-medium ${
                            feedback.isConditionCorrect
                              ? 'text-emerald-700'
                              : 'text-amber-700'
                          }`}
                        >
                          {feedback.isConditionCorrect
                            ? 'Matches'
                            : `Check: ${row.value} < 3 is ${feedback.expectedConditionTrue}`}
                        </span>
                      )}
                    </td>
                    <td className="py-3 pl-4">
                      <select
                        aria-label={`Does the loop print ${row.value}`}
                        value={row.printsValue}
                        onChange={(e) =>
                          updateRow(idx, 'printsValue', e.target.value)
                        }
                        className="px-3 py-2 min-h-[40px] text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        <option value="">Choose...</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                      {clueChecked && row.printsValue && (
                        <span
                          className={`ml-2 text-xs font-medium ${
                            feedback.isPrintsCorrect
                              ? 'text-emerald-700'
                              : 'text-amber-700'
                          }`}
                        >
                          {feedback.isPrintsCorrect
                            ? 'Matches'
                            : `Check: ${feedback.expectedPrintsValue}`}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setClueChecked(true)}
            className="px-4 py-2 min-h-[40px] text-sm font-medium text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
          >
            Check my trace table
          </button>
        </div>

        <div>
          <label
            htmlFor="clue-one-reflection"
            className="block text-sm font-medium text-slate-800 mb-1.5"
          >
            Think about it: What happens when the value reaches 3?
          </label>
          <textarea
            id="clue-one-reflection"
            rows={2}
            value={notes.clueOneReflection}
            onChange={(e) =>
              onUpdateNotes({ clueOneReflection: e.target.value })
            }
            placeholder="Write what you notice when number becomes 3..."
            className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="pt-4 border-t border-slate-200 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onNavigate('predict')}
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] text-sm font-medium text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Return to my prediction
          </button>
          <button
            type="button"
            onClick={() => onNavigate('hint-two')}
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] text-sm font-medium text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap"
          >
            <Lightbulb className="w-4 h-4 text-amber-600" aria-hidden="true" />
            I need another clue
          </button>
          <button
            type="button"
            onClick={() => onNavigate('experiment')}
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors whitespace-nowrap"
          >
            Test a change
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </article>
    );
  }

  if (stage === 'hint-two') {
    return (
      <article className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
        <header className="space-y-1 pb-4 border-b border-slate-200">
          <p className="text-xs font-medium text-slate-500">
            Clue 2 · Boundary Comparison
          </p>
          <h1 className="text-2xl font-bold text-slate-900">
            Look at the Boundary
          </h1>
        </header>

        <div className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="font-mono text-base font-semibold text-slate-900">
                &lt;
              </div>
              <p className="mt-1 text-sm text-slate-700">
                Means <strong>less than</strong>. It does not include the number
                on its right.
              </p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="font-mono text-base font-semibold text-slate-900">
                &lt;=
              </div>
              <p className="mt-1 text-sm text-slate-700">
                Means <strong>less than or equal to</strong>. It includes the
                number on its right.
              </p>
            </div>
          </div>

          <p>
            <strong>Think about it:</strong> Which condition would still be true
            when <code className="font-mono">number</code> is 3?
          </p>
          <p className="text-sm text-slate-600">
            This clue does not mean you have to accept it immediately. Test the
            idea and decide whether the result makes sense.
          </p>
        </div>

        <div>
          <label
            htmlFor="clue-two-choice"
            className="block text-sm font-medium text-slate-800 mb-1.5"
          >
            Condition I want to test:
          </label>
          <input
            id="clue-two-choice"
            type="text"
            value={notes.clueTwoChoice}
            onChange={(e) => onUpdateNotes({ clueTwoChoice: e.target.value })}
            placeholder="For example: number <= 3"
            className="w-full px-3.5 py-2.5 min-h-[42px] text-sm font-mono text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="pt-4 border-t border-slate-200 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onNavigate('experiment')}
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors whitespace-nowrap"
          >
            Test a change
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onNavigate('help')}
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap"
          >
            <HelpCircle className="w-4 h-4" aria-hidden="true" />
            Ask a person
          </button>
        </div>
      </article>
    );
  }

  if (stage === 'experiment') {
    const useLatestOutput = () => {
      if (!lastRunResult) return;
      const text = lastRunResult.errorMessage
        ? lastRunResult.errorMessage
        : lastRunResult.outputLines.join(', ');
      onUpdateNotes({ expActualOutput: text });
    };

    return (
      <article className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
        <header className="space-y-1 pb-4 border-b border-slate-200">
          <p className="text-xs font-medium text-slate-500">
            Stage 3 of 5 · Experiment Log
          </p>
          <h1 className="text-2xl font-bold text-slate-900">
            Run an Experiment
          </h1>
        </header>

        <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
          Choose <strong>one change</strong> to test in{' '}
          <code className="font-mono">MissingNumber.java</code> on the right.
          Then click <strong>Run Java Program</strong> and record what you
          observe.
        </p>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="exp-prediction"
              className="block text-sm font-medium text-slate-800 mb-1.5"
            >
              My prediction (If I change ______, I expect ______):
            </label>
            <input
              id="exp-prediction"
              type="text"
              value={notes.expPrediction}
              onChange={(e) => onUpdateNotes({ expPrediction: e.target.value })}
              placeholder="If I change < to <=, I expect 1, 2, 3..."
              className="w-full px-3.5 py-2.5 min-h-[42px] text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label
              htmlFor="exp-change"
              className="block text-sm font-medium text-slate-800 mb-1.5"
            >
              The one change I made:
            </label>
            <input
              id="exp-change"
              type="text"
              value={notes.expChange}
              onChange={(e) => onUpdateNotes({ expChange: e.target.value })}
              placeholder="For example: changed while (number < 3) to while (number <= 3)"
              className="w-full px-3.5 py-2.5 min-h-[42px] text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <label
                htmlFor="exp-output"
                className="block text-sm font-medium text-slate-800"
              >
                Actual output:
              </label>
              {lastRunResult && (
                <button
                  type="button"
                  onClick={useLatestOutput}
                  className="text-xs font-medium text-blue-700 hover:underline"
                >
                  Copy from workbench run
                </button>
              )}
            </div>
            <input
              id="exp-output"
              type="text"
              value={notes.expActualOutput}
              onChange={(e) =>
                onUpdateNotes({ expActualOutput: e.target.value })
              }
              placeholder="What did the program print?"
              className="w-full px-3.5 py-2.5 min-h-[42px] text-sm font-mono text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <span className="block text-sm font-medium text-slate-800 mb-1.5">
              Did the result match my prediction?
            </span>
            <div className="flex items-center gap-2" role="group" aria-label="Did the result match my prediction">
              {(['Yes', 'No', 'Partly'] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={notes.expMatched === option}
                  onClick={() => onUpdateNotes({ expMatched: option })}
                  className={`px-4 py-2 min-h-[40px] text-sm font-medium rounded-lg border transition-colors ${
                    notes.expMatched === option
                      ? 'bg-blue-700 border-blue-700 text-white'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="exp-takeaway"
              className="block text-sm font-medium text-slate-800 mb-1.5"
            >
              What I think this tells me:
            </label>
            <textarea
              id="exp-takeaway"
              rows={2}
              value={notes.expTakeaway}
              onChange={(e) => onUpdateNotes({ expTakeaway: e.target.value })}
              placeholder="Even if your first idea did not work, what did you learn?"
              className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        <MilestoneToggleButton
          milestoneId="experimenter"
          checked={milestones.experimenter}
          onToggle={onToggleMilestone}
        />

        <div className="pt-4 border-t border-slate-200 space-y-3">
          <h2 className="text-sm font-semibold text-slate-900">
            Choose your path
          </h2>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onNavigate('explain')}
              className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors text-left sm:whitespace-nowrap"
            >
              The output is what I expected; explain the result
              <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('hint-one')}
              className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] text-sm font-medium text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap"
            >
              It did not work; revisit the clue
            </button>
            <button
              type="button"
              onClick={() => onNavigate('help')}
              className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap"
            >
              <HelpCircle className="w-4 h-4" aria-hidden="true" />
              I am stuck; ask for help
            </button>
          </div>
        </div>
      </article>
    );
  }

  if (stage === 'help') {
    const peerPrompt =
      'I expected the program to print 1, 2, and 3. It printed something different. Can we trace the loop condition together?';
    const teacherPrompt =
      'Here is what I expected, what happened, and one thing I tried. What should I look at next?';
    const aiPrompt =
      'I am learning Java. Please help me debug by asking one question at a time. Do not provide a complete corrected program. Help me understand the loop condition.';

    return (
      <article className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
        <header className="space-y-1 pb-4 border-b border-slate-200">
          <p className="text-xs font-medium text-slate-500">
            Support Options · No penalty for asking
          </p>
          <h1 className="text-2xl font-bold text-slate-900">
            Help Is Part of Debugging
          </h1>
          <p className="text-sm text-slate-600">
            Choose the support that is useful right now. You do not need to earn
            permission to ask.
          </p>
        </header>

        <div className="space-y-5">
          {/* Peer */}
          <section className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base font-semibold text-slate-900">
                Ask a peer
              </h2>
              <button
                type="button"
                onClick={() => copyText('peer', peerPrompt)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100"
              >
                {copiedPrompt === 'peer' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy prompt
                  </>
                )}
              </button>
            </div>
            <p className="text-sm text-slate-700">
              Show your code or explain the problem. Ask your peer to help you
              think through the next step rather than typing the answer for you:
            </p>
            <blockquote className="text-sm text-slate-900 bg-white border border-slate-200 rounded-lg p-3 italic">
              &ldquo;{peerPrompt}&rdquo;
            </blockquote>
          </section>

          {/* Teacher */}
          <section className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base font-semibold text-slate-900">
                Ask your teacher
              </h2>
              <button
                type="button"
                onClick={() => copyText('teacher', teacherPrompt)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100"
              >
                {copiedPrompt === 'teacher' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy prompt
                  </>
                )}
              </button>
            </div>
            <p className="text-sm text-slate-700">
              In class, raise your hand or use your usual class channel. Your
              teacher may not be available immediately—you can continue with a
              written clue while you wait.
            </p>
            <blockquote className="text-sm text-slate-900 bg-white border border-slate-200 rounded-lg p-3 italic">
              &ldquo;{teacherPrompt}&rdquo;
            </blockquote>
          </section>

          {/* Approved AI */}
          <section className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base font-semibold text-slate-900">
                Use an approved AI tool, if available
              </h2>
              <button
                type="button"
                onClick={() => copyText('ai', aiPrompt)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100"
              >
                {copiedPrompt === 'ai' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy prompt
                  </>
                )}
              </button>
            </div>
            <p className="text-sm text-slate-700">
              If your school permits it, you could ask:
            </p>
            <blockquote className="text-sm text-slate-900 bg-white border border-slate-200 rounded-lg p-3 italic">
              &ldquo;{aiPrompt}&rdquo;
            </blockquote>
            <p className="text-xs text-slate-600">
              Check its response. AI can give an incorrect hint or reveal a
              solution despite the request. Do not enter personal information,
              and follow school rules about what code may be shared.
            </p>
          </section>
        </div>

        <div className="space-y-3 pt-2">
          <span className="block text-sm font-medium text-slate-800">
            Which support did you choose, and why?
          </span>
          <div className="flex flex-wrap gap-2">
            {(
              [
                { id: 'peer', label: 'Asked a peer' },
                { id: 'teacher', label: 'Asked my teacher' },
                { id: 'ai', label: 'Used approved AI tool' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                aria-pressed={notes.helpSupportChosen === opt.id}
                onClick={() => onUpdateNotes({ helpSupportChosen: opt.id })}
                className={`px-3.5 py-2 min-h-[40px] text-sm font-medium rounded-lg border transition-colors ${
                  notes.helpSupportChosen === opt.id
                    ? 'bg-blue-700 border-blue-700 text-white'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <textarea
            aria-label="Explain why you chose that support"
            rows={2}
            value={notes.helpWhy}
            onChange={(e) => onUpdateNotes({ helpWhy: e.target.value })}
            placeholder="Optional note on why you chose that support..."
            className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="pt-4 border-t border-slate-200 flex flex-wrap gap-3">
          {previousStage !== 'help' && (
            <button
              type="button"
              onClick={() => onNavigate(previousStage)}
              className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors whitespace-nowrap"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Return where I left off
            </button>
          )}
          <button
            type="button"
            onClick={() => onNavigate('predict')}
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] text-sm font-medium text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap"
          >
            Return to prediction
          </button>
          <button
            type="button"
            onClick={() => onNavigate('experiment')}
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] text-sm font-medium text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap"
          >
            Return to experiment
          </button>
          <button
            type="button"
            onClick={() => onNavigate('hint-one')}
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] text-sm font-medium text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap"
          >
            Use a written clue
          </button>
        </div>
      </article>
    );
  }

  if (stage === 'explain') {
    return (
      <article className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
        <header className="space-y-1 pb-4 border-b border-slate-200">
          <p className="text-xs font-medium text-slate-500">
            Stage 4 of 5 · Reasoning
          </p>
          <h1 className="text-2xl font-bold text-slate-900">
            Explain Your Discovery
          </h1>
          <p className="text-sm text-slate-600">
            Working output is a good start. Now make the reasoning visible.
          </p>
        </header>

        <div className="space-y-2">
          <span className="block text-sm font-medium text-slate-800">
            Choose one way to explain your fix:
          </span>
          <div className="inline-flex flex-wrap gap-1 p-1 bg-slate-100 rounded-lg">
            {(
              [
                { id: 'write', label: 'Write 2–3 sentences' },
                { id: 'aloud', label: 'Explain aloud to a peer/teacher' },
                { id: 'trace', label: 'Trace each step' },
              ] as const
            ).map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => onUpdateNotes({ explainMode: mode.id })}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  notes.explainMode === mode.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {notes.explainMode === 'aloud' && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 space-y-1">
            <p className="font-medium text-slate-900">
              Aloud explanation guide:
            </p>
            <p>
              Talk through the three questions below with a peer, teacher, or
              out loud to yourself. You can jot quick keywords below to remember
              your points.
            </p>
          </div>
        )}

        {notes.explainMode === 'trace' && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 space-y-1">
            <p className="font-medium text-slate-900">
              Step-trace explanation guide:
            </p>
            <p>
              Use the <strong>Step Through</strong> button in the workbench to
              watch <code className="font-mono">number</code> and the condition
              at each check, then summarize why it stops.
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label
              htmlFor="explain-why-stops"
              className="block text-sm font-medium text-slate-800 mb-1.5"
            >
              1. Why did the original program stop before printing 3?
            </label>
            <textarea
              id="explain-why-stops"
              rows={2}
              value={notes.explainWhyOriginalStops}
              onChange={(e) =>
                onUpdateNotes({ explainWhyOriginalStops: e.target.value })
              }
              placeholder="Describe what happened when number reached 3..."
              className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label
              htmlFor="explain-what-changed"
              className="block text-sm font-medium text-slate-800 mb-1.5"
            >
              2. What did your change do?
            </label>
            <textarea
              id="explain-what-changed"
              rows={2}
              value={notes.explainWhatChangeDid}
              onChange={(e) =>
                onUpdateNotes({ explainWhatChangeDid: e.target.value })
              }
              placeholder="Explain how your updated condition behaved..."
              className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label
              htmlFor="explain-one-four"
              className="block text-sm font-medium text-slate-800 mb-1.5"
            >
              3. What would happen if the goal changed to printing 1 through 4?
              Explain what you would check or change.
            </label>
            <textarea
              id="explain-one-four"
              rows={2}
              value={notes.explainOneThroughFour}
              onChange={(e) =>
                onUpdateNotes({ explainOneThroughFour: e.target.value })
              }
              placeholder="How would the loop condition need to change for 1 through 4?"
              className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Optional discussion starter */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
          <p className="text-xs font-semibold text-slate-700">
            Optional discussion starter
          </p>
          <div className="text-sm text-slate-800 leading-loose flex flex-wrap items-center gap-1.5">
            <span>When</span>
            <code className="font-mono text-slate-900">number</code>
            <span>reached 3, the original condition was</span>
            <input
              type="text"
              aria-label="Original condition result"
              value={notes.explainStarterConditionWas}
              onChange={(e) =>
                onUpdateNotes({ explainStarterConditionWas: e.target.value })
              }
              placeholder="false / ..."
              className="px-2 py-1 text-sm bg-white border border-slate-300 rounded w-28"
            />
            <span>. My change made the condition</span>
            <input
              type="text"
              aria-label="New condition result"
              value={notes.explainStarterMadeCondition}
              onChange={(e) =>
                onUpdateNotes({ explainStarterMadeCondition: e.target.value })
              }
              placeholder="true / ..."
              className="px-2 py-1 text-sm bg-white border border-slate-300 rounded w-28"
            />
            <span>, so the program</span>
            <input
              type="text"
              aria-label="What the program did"
              value={notes.explainStarterSoProgram}
              onChange={(e) =>
                onUpdateNotes({ explainStarterSoProgram: e.target.value })
              }
              placeholder="printed 3 before stopping"
              className="px-2 py-1 text-sm bg-white border border-slate-300 rounded w-48"
            />
            <span>.</span>
          </div>
        </div>

        <MilestoneToggleButton
          milestoneId="explainer"
          checked={milestones.explainer}
          onToggle={onToggleMilestone}
        />

        <p className="text-xs text-slate-600">
          Do not check the example explanation until you have made your own
          attempt.
        </p>

        <div className="pt-4 border-t border-slate-200 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onNavigate('explanation-check')}
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors whitespace-nowrap"
          >
            Reveal an example explanation
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onNavigate('help')}
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap"
          >
            <HelpCircle className="w-4 h-4" aria-hidden="true" />
            Discuss it with someone
          </button>
        </div>
      </article>
    );
  }

  if (stage === 'explanation-check') {
    const hasLearnerAttempt =
      notes.explainWhyOriginalStops.trim().length > 0 ||
      notes.explainWhatChangeDid.trim().length > 0 ||
      notes.explainOneThroughFour.trim().length > 0;

    return (
      <article className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
        <header className="space-y-1 pb-4 border-b border-slate-200">
          <p className="text-xs font-medium text-slate-500">
            Stage 4 Check · Compare Reasoning
          </p>
          <h1 className="text-2xl font-bold text-slate-900">
            Example Explanation
          </h1>
        </header>

        <div className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
          <p>One possible fix is to change the condition to:</p>
          <pre className="bg-slate-900 text-emerald-300 font-mono text-sm px-4 py-3 rounded-lg overflow-x-auto">
            while (number &lt;= 3)
          </pre>
          <p>
            In the original program, <code className="font-mono">number &lt; 3</code>{' '}
            becomes false when <code className="font-mono">number</code> reaches 3.
            The loop therefore stops before printing that value.
          </p>
          <p>
            With <code className="font-mono">number &lt;= 3</code>, the condition
            remains true when <code className="font-mono">number</code> is 3. The
            program prints 3, increases <code className="font-mono">number</code> to
            4, and then stops because <code className="font-mono">4 &lt;= 3</code>{' '}
            is false.
          </p>
          <p>
            If the goal changes to <strong>1 through 4</strong>, one approach
            is to change the boundary to{' '}
            <code className="font-mono">number &lt;= 4</code>. The condition
            should still allow 4 and then stop after the value increases to 5.
          </p>
        </div>

        {hasLearnerAttempt && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
            <h2 className="text-xs font-semibold text-slate-700">
              Your written explanation for comparison
            </h2>
            {notes.explainWhyOriginalStops && (
              <p className="text-sm text-slate-800">
                <strong>Why it stopped:</strong> {notes.explainWhyOriginalStops}
              </p>
            )}
            {notes.explainWhatChangeDid && (
              <p className="text-sm text-slate-800">
                <strong>What your change did:</strong>{' '}
                {notes.explainWhatChangeDid}
              </p>
            )}
            {notes.explainOneThroughFour && (
              <p className="text-sm text-slate-800">
                <strong>1 through 4:</strong> {notes.explainOneThroughFour}
              </p>
            )}
          </div>
        )}

        <p className="text-sm text-slate-700 font-medium">
          Compare your explanation: Did you describe both the condition and what
          happens when the value reaches the boundary? If not, revise your
          explanation.
        </p>

        <div className="pt-4 border-t border-slate-200 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onNavigate('transfer')}
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors whitespace-nowrap"
          >
            Try the independent challenge
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onNavigate('explain')}
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] text-sm font-medium text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Revise my explanation
          </button>
        </div>
      </article>
    );
  }

  if (stage === 'transfer') {
    return (
      <article className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
        <header className="space-y-1 pb-4 border-b border-slate-200">
          <p className="text-xs font-medium text-slate-500">
            Stage 5 of 5 · CountdownCheck.java
          </p>
          <h1 className="text-2xl font-bold text-slate-900">
            Independent Challenge
          </h1>
          <p className="text-sm text-slate-600">
            A new program should print <strong>0, 1, 2, and 3</strong>, each on
            its own line. Try this challenge without hints or AI first—it is a
            low-stakes opportunity to see what you can do independently, not a
            judgment about you.
          </p>
        </header>

        <ol className="list-decimal pl-5 space-y-1 text-sm text-slate-700">
          <li>Predict the program&apos;s actual output before running it.</li>
          <li>Explain why the final expected number is missing.</li>
          <li>Propose one change.</li>
          <li>Run the program in the workbench and check your prediction.</li>
        </ol>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="transfer-predicted"
              className="block text-sm font-medium text-slate-800 mb-1.5"
            >
              Predicted output (before running):
            </label>
            <input
              id="transfer-predicted"
              type="text"
              value={notes.transferPredictedOutput}
              onChange={(e) =>
                onUpdateNotes({ transferPredictedOutput: e.target.value })
              }
              placeholder="What do you predict the original program prints?"
              className="w-full px-3.5 py-2.5 min-h-[42px] text-sm font-mono text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label
              htmlFor="transfer-why"
              className="block text-sm font-medium text-slate-800 mb-1.5"
            >
              Why the program stops:
            </label>
            <textarea
              id="transfer-why"
              rows={2}
              value={notes.transferWhyStops}
              onChange={(e) =>
                onUpdateNotes({ transferWhyStops: e.target.value })
              }
              placeholder="Explain why 3 is missing..."
              className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label
              htmlFor="transfer-change"
              className="block text-sm font-medium text-slate-800 mb-1.5"
            >
              My proposed change:
            </label>
            <input
              id="transfer-change"
              type="text"
              value={notes.transferProposedChange}
              onChange={(e) =>
                onUpdateNotes({ transferProposedChange: e.target.value })
              }
              placeholder="Write the change you want to test in CountdownCheck.java..."
              className="w-full px-3.5 py-2.5 min-h-[42px] text-sm font-mono text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label
              htmlFor="transfer-actual"
              className="block text-sm font-medium text-slate-800 mb-1.5"
            >
              What happened when I ran it:
            </label>
            <textarea
              id="transfer-actual"
              rows={2}
              value={notes.transferActualResult}
              onChange={(e) =>
                onUpdateNotes({ transferActualResult: e.target.value })
              }
              placeholder="Did your test confirm your prediction?"
              className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        <MilestoneToggleButton
          milestoneId="explorer"
          checked={milestones.explorer}
          onToggle={onToggleMilestone}
        />

        <div className="pt-4 border-t border-slate-200 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onNavigate('transfer-check')}
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors whitespace-nowrap"
          >
            Check my reasoning
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onNavigate('help')}
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap"
          >
            <HelpCircle className="w-4 h-4" aria-hidden="true" />
            I need support
          </button>
        </div>
      </article>
    );
  }

  if (stage === 'transfer-check') {
    return (
      <article className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
        <header className="space-y-1 pb-4 border-b border-slate-200">
          <p className="text-xs font-medium text-slate-500">
            Stage 5 Check · CountdownCheck.java
          </p>
          <h1 className="text-2xl font-bold text-slate-900">
            Independent Challenge Check
          </h1>
        </header>

        <div className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <p className="text-xs font-semibold text-slate-600 mb-1">
              Original output
            </p>
            <pre className="font-mono text-sm text-slate-900">0{'\n'}1{'\n'}2</pre>
          </div>

          <p>
            When <code className="font-mono">value</code> becomes 3, the
            condition <code className="font-mono">value &lt; 3</code> is false,
            so 3 is not printed.
          </p>
          <p>One possible change is:</p>
          <pre className="bg-slate-900 text-emerald-300 font-mono text-sm px-4 py-3 rounded-lg overflow-x-auto">
            while (value &lt;= 3)
          </pre>
          <p>
            This includes 3. After printing it, the program increases{' '}
            <code className="font-mono">value</code> to 4; the condition is
            then false, so the loop stops.
          </p>
        </div>

        <section className="pt-4 border-t border-slate-200 space-y-2">
          <h2 className="text-base font-semibold text-slate-900">Reflect</h2>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-700">
            <li>Did your prediction match what you observed?</li>
            <li>
              Can you explain <em>why</em> the condition changes the output?
            </li>
            <li>
              If not, which part would you like to discuss with a peer or
              teacher?
            </li>
          </ul>
        </section>

        <div className="pt-4 border-t border-slate-200 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onNavigate('finish')}
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors whitespace-nowrap"
          >
            Finish the mission
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onNavigate('hint-one')}
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] text-sm font-medium text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Revisit the first clue
          </button>
        </div>
      </article>
    );
  }

  // stage === 'finish'
  return (
    <article className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
      <header className="space-y-1 pb-4 border-b border-slate-200">
        <p className="text-xs font-medium text-slate-500">
          Mission Summary
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Mission Complete
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          You have reached the end of the prototype. You may leave a milestone
          unmarked or return to it later—asking for help is part of the
          process, not a missing achievement.
        </p>
      </header>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="finish-helpful"
            className="block text-sm font-medium text-slate-800 mb-1.5"
          >
            Which milestone helped you most?
          </label>
          <input
            id="finish-helpful"
            type="text"
            value={notes.finishHelpfulMilestone}
            onChange={(e) =>
              onUpdateNotes({ finishHelpfulMilestone: e.target.value })
            }
            placeholder="Detective, Predictor, Experimenter, Explainer, or Explorer..."
            className="w-full px-3.5 py-2.5 min-h-[42px] text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <label
            htmlFor="finish-confusing"
            className="block text-sm font-medium text-slate-800 mb-1.5"
          >
            Which step felt unnecessary, confusing, or difficult?
          </label>
          <textarea
            id="finish-confusing"
            rows={2}
            value={notes.finishConfusingStep}
            onChange={(e) =>
              onUpdateNotes({ finishConfusingStep: e.target.value })
            }
            placeholder="Share honest feedback about what felt unclear..."
            className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <label
            htmlFor="finish-change"
            className="block text-sm font-medium text-slate-800 mb-1.5"
          >
            One thing you would change about this experience:
          </label>
          <textarea
            id="finish-change"
            rows={2}
            value={notes.finishOneChange}
            onChange={(e) => onUpdateNotes({ finishOneChange: e.target.value })}
            placeholder="What would make this mission clearer or more helpful?"
            className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700">
        <strong>Next conversation:</strong> Share one part of your reasoning
        with a peer or teacher when they are available.
      </div>

      <div className="pt-4 border-t border-slate-200 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onOpenExport}
          className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors whitespace-nowrap"
        >
          Review &amp; Export Notes
        </button>
        <button
          type="button"
          onClick={onRestartMission}
          className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] text-sm font-medium text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          Restart the mission
        </button>
      </div>
    </article>
  );
};
