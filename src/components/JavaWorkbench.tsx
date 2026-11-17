import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Copy,
  Play,
  RotateCcw,
  StepForward,
} from 'lucide-react';
import { JavaRunResult } from '../logic/javaLoopRunner';

interface JavaWorkbenchProps {
  programName: 'MissingNumber.java' | 'CountdownCheck.java';
  code: string;
  onChangeCode: (nextCode: string) => void;
  onResetCode: () => void;
  expectedOutput: string[];
  highlightCondition: boolean;
  defaultEditable: boolean;
  runResult: JavaRunResult | null;
  onRunProgram: () => void;
  showPredictTip?: boolean;
}

export const JavaWorkbench: React.FC<JavaWorkbenchProps> = ({
  programName,
  code,
  onChangeCode,
  onResetCode,
  expectedOutput,
  highlightCondition,
  defaultEditable,
  runResult,
  onRunProgram,
  showPredictTip = false,
}) => {
  const [mode, setMode] = useState<'inspect' | 'edit'>(
    defaultEditable ? 'edit' : 'inspect',
  );
  const [copied, setCopied] = useState(false);
  const [revealedSteps, setRevealedSteps] = useState<number>(0);

  useEffect(() => {
    setMode(defaultEditable ? 'edit' : 'inspect');
  }, [defaultEditable, programName]);

  useEffect(() => {
    if (runResult) {
      setRevealedSteps(runResult.steps.length);
    } else {
      setRevealedSteps(0);
    }
  }, [runResult]);

  const lines = code.split('\n');
  const whileLine = lines.find((line) => /\bwhile\s*\(/.test(line))?.trim();

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard failure
    }
  };

  const handleStepModeStart = () => {
    if (!runResult) {
      onRunProgram();
      setRevealedSteps(1);
    } else {
      setRevealedSteps((prev) =>
        prev >= runResult.steps.length ? 1 : prev + 1,
      );
    }
  };

  const visibleSteps = runResult ? runResult.steps.slice(0, revealedSteps) : [];

  return (
    <aside
      aria-label="Java Workbench"
      className="bg-white border border-slate-200 rounded-xl overflow-hidden"
    >
      {/* Workbench Header */}
      <div className="px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70">
        <div>
          <h2 className="text-sm font-semibold font-mono text-slate-900">
            {programName}
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Goal output: <span className="font-mono">{expectedOutput.join(', ')}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1 p-0.5 bg-slate-200/70 rounded-lg"
            role="group"
            aria-label="Code view mode"
          >
            <button
              type="button"
              onClick={() => setMode('inspect')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                mode === 'inspect'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Inspect
            </button>
            <button
              type="button"
              onClick={() => setMode('edit')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                mode === 'edit'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Edit Code
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopyCode}
            aria-label={`Copy ${programName} code`}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 min-h-[34px] text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 whitespace-nowrap"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                Copy
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onResetCode}
            aria-label={`Reset ${programName} to original`}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 min-h-[34px] text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            Reset
          </button>
        </div>
      </div>

      {/* Condition Signaling Banner */}
      {highlightCondition && whileLine && (
        <div className="px-5 py-2.5 bg-blue-50/70 border-b border-blue-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-medium text-blue-900">
            Focus line (loop condition):
          </span>
          <code className="font-mono font-semibold text-blue-800 bg-white px-2 py-0.5 rounded border border-blue-200">
            {whileLine}
          </code>
        </div>
      )}

      {/* Code Display or Editor */}
      <div className="p-4 bg-slate-900 text-slate-100">
        {mode === 'inspect' ? (
          <pre
            aria-label={`${programName} source code`}
            className="text-xs sm:text-sm font-mono leading-relaxed overflow-x-auto"
          >
            {lines.map((line, index) => {
              const isCondition =
                highlightCondition && /\bwhile\s*\(/.test(line);
              return (
                <div
                  key={index}
                  className={`flex gap-3 px-2 py-0.5 rounded ${
                    isCondition
                      ? 'bg-blue-500/25 ring-1 ring-blue-400/50 text-white'
                      : ''
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="select-none text-slate-500 w-5 text-right tabular-nums shrink-0"
                  >
                    {index + 1}
                  </span>
                  <code className="whitespace-pre">{line || ' '}</code>
                </div>
              );
            })}
          </pre>
        ) : (
          <div>
            <label htmlFor="java-code-editor" className="sr-only">
              Edit {programName} Java source code
            </label>
            <textarea
              id="java-code-editor"
              value={code}
              onChange={(e) => onChangeCode(e.target.value)}
              spellCheck={false}
              rows={11}
              className="w-full bg-slate-950/60 text-slate-100 font-mono text-xs sm:text-sm leading-relaxed p-3 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
          </div>
        )}

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-400">
            Test in-browser here or copy into your own Java IDE.
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleStepModeStart}
              className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[38px] text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap"
            >
              <StepForward className="w-3.5 h-3.5" aria-hidden="true" />
              {runResult && revealedSteps < runResult.steps.length
                ? `Next Step (${revealedSteps}/${runResult.steps.length})`
                : 'Step Through'}
            </button>
            <button
              type="button"
              onClick={onRunProgram}
              className="inline-flex items-center gap-1.5 px-4 py-2 min-h-[38px] text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors whitespace-nowrap"
            >
              <Play className="w-3.5 h-3.5" aria-hidden="true" />
              Run Java Program
            </button>
          </div>
        </div>
      </div>

      {showPredictTip && !runResult && (
        <div className="px-5 py-2.5 bg-amber-50 border-t border-amber-200 text-xs text-amber-900">
          Suggestion: Write your predicted output on the left before running the program.
        </div>
      )}

      {/* Output & Trace Results */}
      <div className="p-5 border-t border-slate-200 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="text-xs font-medium text-slate-600">
              Expected Output
            </div>
            <pre className="mt-1.5 font-mono text-sm text-slate-900 leading-snug tabular-nums">
              {expectedOutput.join('\n')}
            </pre>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="text-xs font-medium text-slate-600">
              Actual Output
            </div>
            {runResult ? (
              runResult.errorMessage ? (
                <p className="mt-1.5 text-xs text-amber-800 leading-snug">
                  {runResult.errorMessage}
                </p>
              ) : runResult.outputLines.length > 0 ? (
                <pre className="mt-1.5 font-mono text-sm text-slate-900 leading-snug tabular-nums">
                  {runResult.outputLines.join('\n')}
                </pre>
              ) : (
                <p className="mt-1.5 text-xs text-slate-500 italic">
                  (No output printed)
                </p>
              )
            ) : (
              <p className="mt-1.5 text-xs text-slate-500">
                Click &ldquo;Run Java Program&rdquo; to observe output.
              </p>
            )}
          </div>
        </div>

        {runResult && (
          <div
            className={`flex items-start gap-2.5 px-3.5 py-2.5 rounded-lg border text-xs font-medium ${
              runResult.errorMessage
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : runResult.matchesExpected
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-slate-100 border-slate-200 text-slate-800'
            }`}
          >
            {runResult.errorMessage ? (
              <AlertTriangle
                className="w-4 h-4 text-amber-600 shrink-0 mt-0.5"
                aria-hidden="true"
              />
            ) : runResult.matchesExpected ? (
              <CheckCircle2
                className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"
                aria-hidden="true"
              />
            ) : (
              <AlertTriangle
                className="w-4 h-4 text-amber-600 shrink-0 mt-0.5"
                aria-hidden="true"
              />
            )}
            <span>
              {runResult.errorMessage
                ? 'Execution stopped early — review the message above.'
                : runResult.matchesExpected
                  ? 'Matches expected output! Now check why the loop stopped when it did.'
                  : 'Differs from expected output — compare the lines and trace the condition.'}
            </span>
          </div>
        )}

        {/* Step-by-Step Execution Trace */}
        {runResult && visibleSteps.length > 0 && (
          <div className="pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-slate-700">
                Loop Execution Trace
              </h3>
              <span className="text-xs text-slate-500 tabular-nums">
                Showing {visibleSteps.length} of {runResult.steps.length} checks
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600">
                    <th className="py-1.5 pr-2 font-medium">Check</th>
                    <th className="py-1.5 px-2 font-medium font-mono">
                      {runResult.variableName}
                    </th>
                    <th className="py-1.5 px-2 font-medium">Condition</th>
                    <th className="py-1.5 pl-2 font-medium">Printed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 tabular-nums">
                  {visibleSteps.map((step) => (
                    <tr key={step.checkNumber}>
                      <td className="py-1.5 pr-2 text-slate-600">
                        #{step.checkNumber}
                      </td>
                      <td className="py-1.5 px-2 font-mono font-medium text-slate-900">
                        {step.valueAtCheck}
                      </td>
                      <td className="py-1.5 px-2">
                        <span
                          className={`font-medium ${
                            step.conditionPassed
                              ? 'text-emerald-700'
                              : 'text-amber-700'
                          }`}
                        >
                          {step.conditionPassed ? 'true (runs)' : 'false (stops)'}
                        </span>
                      </td>
                      <td className="py-1.5 pl-2 font-mono text-slate-800">
                        {step.printedLines.length > 0
                          ? step.printedLines.join(', ')
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
