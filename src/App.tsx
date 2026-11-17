/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { ExportNotesModal } from './components/ExportNotesModal';
import { FacilitatorView } from './components/FacilitatorView';
import { JavaWorkbench } from './components/JavaWorkbench';
import { ProgressCardPanel } from './components/ProgressCardPanel';
import { StageContent } from './components/StageContent';
import { TopNav, TopView } from './components/TopNav';
import {
  COUNTDOWN_CHECK_CODE,
  JavaRunResult,
  MISSING_NUMBER_CODE,
  runJavaWhileProgram,
} from './logic/javaLoopRunner';
import {
  LearnerNotes,
  MilestoneId,
  StageId,
  createInitialNotes,
  getStageMetadata,
} from './logic/missionState';

const STORAGE_KEY = 'debug-quest-state-v1';

interface PersistedState {
  stage: StageId;
  milestones: Record<MilestoneId, boolean>;
  notes: LearnerNotes;
  missingCode: string;
  countdownCode: string;
}

const DEFAULT_MILESTONES: Record<MilestoneId, boolean> = {
  detective: false,
  predictor: false,
  experimenter: false,
  explainer: false,
  explorer: false,
};

function getInitialState(): PersistedState {
  const params = new URLSearchParams(window.location.search);
  const autostart = params.get('autostart') === '1';

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PersistedState>;
      return {
        stage: autostart ? 'case' : parsed.stage || 'mission',
        milestones: { ...DEFAULT_MILESTONES, ...(parsed.milestones || {}) },
        notes: { ...createInitialNotes(), ...(parsed.notes || {}) },
        missingCode: parsed.missingCode || MISSING_NUMBER_CODE,
        countdownCode: parsed.countdownCode || COUNTDOWN_CHECK_CODE,
      };
    }
  } catch {
    // Ignore storage read errors
  }

  return {
    stage: autostart ? 'case' : 'mission',
    milestones: { ...DEFAULT_MILESTONES },
    notes: createInitialNotes(),
    missingCode: MISSING_NUMBER_CODE,
    countdownCode: COUNTDOWN_CHECK_CODE,
  };
}

const TRAIL_STEPS: { id: StageId; label: string }[] = [
  { id: 'mission', label: 'Mission' },
  { id: 'case', label: '1. Case' },
  { id: 'predict', label: '2. Predict' },
  { id: 'hint-one', label: 'Clue 1' },
  { id: 'hint-two', label: 'Clue 2' },
  { id: 'experiment', label: '3. Experiment' },
  { id: 'explain', label: '4. Explain' },
  { id: 'transfer', label: '5. Explorer' },
  { id: 'finish', label: 'Complete' },
];

export default function App() {
  const initial = getInitialState();

  const [topView, setTopView] = useState<TopView>('quest');
  const [stage, setStage] = useState<StageId>(initial.stage);
  const [previousStage, setPreviousStage] = useState<StageId>('case');
  const [milestones, setMilestones] = useState<Record<MilestoneId, boolean>>(
    initial.milestones,
  );
  const [notes, setNotes] = useState<LearnerNotes>(initial.notes);
  const [missingCode, setMissingCode] = useState<string>(initial.missingCode);
  const [countdownCode, setCountdownCode] = useState<string>(
    initial.countdownCode,
  );
  const [missingResult, setMissingResult] = useState<JavaRunResult | null>(
    null,
  );
  const [countdownResult, setCountdownResult] = useState<JavaRunResult | null>(
    null,
  );
  const [exportOpen, setExportOpen] = useState(false);

  useEffect(() => {
    try {
      const payload: PersistedState = {
        stage,
        milestones,
        notes,
        missingCode,
        countdownCode,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore storage write errors
    }
  }, [stage, milestones, notes, missingCode, countdownCode]);

  const navigateToStage = (nextStage: StageId) => {
    if (stage !== 'help' && nextStage === 'help') {
      setPreviousStage(stage);
    }
    setStage(nextStage);
    if (nextStage === 'help') {
      setTopView('help');
    } else {
      setTopView('quest');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTopView = (view: TopView) => {
    setTopView(view);
    if (view === 'help') {
      if (stage !== 'help') {
        setPreviousStage(stage);
      }
      setStage('help');
    } else if (view === 'quest' && stage === 'help') {
      setStage(previousStage);
    }
  };

  const handleToggleMilestone = (id: MilestoneId) => {
    setMilestones((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleUpdateNotes = (patch: Partial<LearnerNotes>) => {
    setNotes((prev) => ({ ...prev, ...patch }));
  };

  const handleRestartMission = () => {
    setStage('mission');
    setPreviousStage('case');
    setTopView('quest');
    setMissingCode(MISSING_NUMBER_CODE);
    setCountdownCode(COUNTDOWN_CHECK_CODE);
    setMissingResult(null);
    setCountdownResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetAll = () => {
    setMilestones({ ...DEFAULT_MILESTONES });
    setNotes(createInitialNotes());
    handleRestartMission();
  };

  const stageMeta = getStageMetadata(stage);
  const isCountdown = stageMeta.usesCountdownCode;

  const currentCode = isCountdown ? countdownCode : missingCode;
  const currentExpected = isCountdown ? ['0', '1', '2', '3'] : ['1', '2', '3'];
  const currentResult = isCountdown ? countdownResult : missingResult;

  const handleChangeCode = (nextCode: string) => {
    if (isCountdown) {
      setCountdownCode(nextCode);
    } else {
      setMissingCode(nextCode);
    }
  };

  const handleResetCode = () => {
    if (isCountdown) {
      setCountdownCode(COUNTDOWN_CHECK_CODE);
      setCountdownResult(null);
    } else {
      setMissingCode(MISSING_NUMBER_CODE);
      setMissingResult(null);
    }
  };

  const handleRunProgram = () => {
    const result = runJavaWhileProgram(currentCode, currentExpected);
    if (isCountdown) {
      setCountdownResult(result);
    } else {
      setMissingResult(result);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <TopNav
        activeView={topView}
        onSelectView={handleSelectTopView}
        onOpenExport={() => setExportOpen(true)}
        onGoHome={() => navigateToStage('mission')}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {topView === 'facilitator' ? (
          <FacilitatorView
            onReturnToMission={() => {
              setTopView('quest');
              if (stage === 'help') setStage(previousStage);
            }}
          />
        ) : topView === 'progress' ? (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Progress &amp; Stage Map
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                  You can revisit any milestone or jump to any stage at any
                  time.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setTopView('quest')}
                className="px-4 py-2 min-h-[40px] text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors whitespace-nowrap"
              >
                Back to current stage
              </button>
            </div>

            <ProgressCardPanel
              milestones={milestones}
              onToggleMilestone={handleToggleMilestone}
              onJumpToStage={(target) => navigateToStage(target)}
            />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Compact Stage Trail */}
            <nav
              aria-label="Mission stages"
              className="flex items-center gap-1.5 overflow-x-auto pb-1"
            >
              {TRAIL_STEPS.map((step) => {
                const active =
                  stage === step.id ||
                  (step.id === 'explain' && stage === 'explanation-check') ||
                  (step.id === 'transfer' && stage === 'transfer-check');
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => navigateToStage(step.id)}
                    aria-current={active ? 'step' : undefined}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      active
                        ? 'bg-slate-900 text-white'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {step.label}
                  </button>
                );
              })}
            </nav>

            {/* Two-Zone Educational Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7">
                <StageContent
                  stage={stage}
                  previousStage={previousStage}
                  milestones={milestones}
                  notes={notes}
                  lastRunResult={currentResult}
                  onNavigate={navigateToStage}
                  onToggleMilestone={handleToggleMilestone}
                  onUpdateNotes={handleUpdateNotes}
                  onOpenExport={() => setExportOpen(true)}
                  onRestartMission={handleRestartMission}
                />
              </div>

              <div className="lg:col-span-5 space-y-6">
                <JavaWorkbench
                  programName={
                    isCountdown ? 'CountdownCheck.java' : 'MissingNumber.java'
                  }
                  code={currentCode}
                  onChangeCode={handleChangeCode}
                  onResetCode={handleResetCode}
                  expectedOutput={currentExpected}
                  highlightCondition={stageMeta.highlightConditionLine}
                  defaultEditable={
                    stage === 'experiment' || stage === 'transfer'
                  }
                  runResult={currentResult}
                  onRunProgram={handleRunProgram}
                  showPredictTip={
                    stage === 'transfer' &&
                    notes.transferPredictedOutput.trim().length === 0
                  }
                />

                <ProgressCardPanel
                  milestones={milestones}
                  onToggleMilestone={handleToggleMilestone}
                  onJumpToStage={(target) => navigateToStage(target)}
                  compact
                />
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <span>
            Debug Quest: The Missing Number · Beginning Java Debugging Prototype
          </span>
          <span>A bug is not a failure. It is a clue.</span>
        </div>
      </footer>

      <ExportNotesModal
        isOpen={exportOpen}
        onClose={() => setExportOpen(false)}
        milestones={milestones}
        notes={notes}
        onResetAll={handleResetAll}
      />
    </div>
  );
}
