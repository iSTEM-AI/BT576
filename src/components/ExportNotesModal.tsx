import React, { useState } from 'react';
import { Check, Copy, Download, RotateCcw, X } from 'lucide-react';
import {
  LearnerNotes,
  MilestoneId,
  formatNotesSummary,
} from '../logic/missionState';

interface ExportNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestones: Record<MilestoneId, boolean>;
  notes: LearnerNotes;
  onResetAll: () => void;
}

export const ExportNotesModal: React.FC<ExportNotesModalProps> = ({
  isOpen,
  onClose,
  milestones,
  notes,
  onResetAll,
}) => {
  const [copied, setCopied] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  if (!isOpen) return null;

  const summary = formatNotesSummary(milestones, notes);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard fallback ignored if blocked
    }
  };

  const handleDownload = () => {
    const blob = new Blob([summary], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'debug-quest-notes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    onResetAll();
    setConfirmReset(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
    >
      <div className="bg-white border border-slate-200 rounded-xl max-w-2xl w-full max-h-[88vh] flex flex-col shadow-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2
              id="export-modal-title"
              className="text-lg font-semibold text-slate-900"
            >
              Export Your Debugging Notes
            </h2>
            <p className="text-sm text-slate-600">
              Copy or download your reasoning log to share with a peer or teacher.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close export modal"
            className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-blue-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <pre className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs sm:text-sm text-slate-800 whitespace-pre-wrap break-words overflow-x-auto font-mono leading-relaxed">
            {summary}
          </pre>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            className={`inline-flex items-center gap-2 px-4 py-2 min-h-[40px] text-sm font-medium rounded-lg border transition-colors whitespace-nowrap ${
              confirmReset
                ? 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100'
                : 'border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            {confirmReset ? 'Click again to clear all notes' : 'Reset all notes'}
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-4 py-2 min-h-[40px] text-sm font-medium text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 whitespace-nowrap"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              Download .txt
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-4 py-2 min-h-[40px] text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 whitespace-nowrap"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" aria-hidden="true" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" aria-hidden="true" />
                  Copy Notes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
