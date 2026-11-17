import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { MILESTONES, MilestoneId, StageId } from '../logic/missionState';

interface ProgressCardPanelProps {
  milestones: Record<MilestoneId, boolean>;
  onToggleMilestone: (id: MilestoneId) => void;
  onJumpToStage?: (stage: StageId) => void;
  compact?: boolean;
}

export const ProgressCardPanel: React.FC<ProgressCardPanelProps> = ({
  milestones,
  onToggleMilestone,
  onJumpToStage,
  compact = false,
}) => {
  const completedCount = MILESTONES.filter((m) => milestones[m.id]).length;

  return (
    <section
      aria-labelledby="progress-card-heading"
      className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2 pb-4 border-b border-slate-200">
        <div>
          <h2
            id="progress-card-heading"
            className="text-base sm:text-lg font-semibold text-slate-900"
          >
            Your Progress Card
          </h2>
          <p className="text-sm text-slate-600 mt-0.5">
            Self-marked milestones. Progress is about reasoning, not speed.
          </p>
        </div>
        <span className="text-xs font-medium text-slate-600 tabular-nums whitespace-nowrap">
          {completedCount} of {MILESTONES.length} marked
        </span>
      </div>

      <ul className={compact ? 'mt-3 space-y-2' : 'mt-4 space-y-3'}>
        {MILESTONES.map((m) => {
          const checked = milestones[m.id];
          return (
            <li
              key={m.id}
              className="flex items-start justify-between gap-3 py-1.5"
            >
              <button
                type="button"
                role="checkbox"
                aria-checked={checked}
                onClick={() => onToggleMilestone(m.id)}
                className="flex items-start gap-3 text-left group min-h-[40px] py-1 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                <span className="mt-0.5 shrink-0 text-slate-500 group-hover:text-blue-700 transition-colors">
                  {checked ? (
                    <CheckCircle2
                      className="w-5 h-5 text-emerald-600"
                      aria-hidden="true"
                    />
                  ) : (
                    <Circle
                      className="w-5 h-5 text-slate-400"
                      aria-hidden="true"
                    />
                  )}
                </span>
                <span>
                  <span
                    className={`block text-sm font-semibold ${
                      checked ? 'text-slate-900' : 'text-slate-800'
                    }`}
                  >
                    {m.title}
                  </span>
                  <span className="block text-sm text-slate-600">
                    {m.description}
                  </span>
                </span>
              </button>

              {onJumpToStage && (
                <button
                  type="button"
                  onClick={() => onJumpToStage(m.stageHint)}
                  className="text-xs font-medium text-blue-700 hover:text-blue-800 hover:underline py-2 px-2 shrink-0 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 rounded"
                >
                  Open stage
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
};
