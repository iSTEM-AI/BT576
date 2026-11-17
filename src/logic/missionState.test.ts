import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createInitialNotes,
  evaluateClueOneRow,
  formatNotesSummary,
  getStageMetadata,
} from './missionState';

test('evaluateClueOneRow checks boundary logic for 1, 2, and 3', () => {
  const row1 = evaluateClueOneRow({ value: 1, conditionTrue: 'true', printsValue: 'Yes' });
  assert.equal(row1.isConditionCorrect, true);
  assert.equal(row1.isPrintsCorrect, true);

  const row3Wrong = evaluateClueOneRow({ value: 3, conditionTrue: 'true', printsValue: 'Yes' });
  assert.equal(row3Wrong.isConditionCorrect, false);
  assert.equal(row3Wrong.isPrintsCorrect, false);

  const row3Right = evaluateClueOneRow({ value: 3, conditionTrue: 'false', printsValue: 'No' });
  assert.equal(row3Right.isConditionCorrect, true);
  assert.equal(row3Right.isPrintsCorrect, true);
});

test('getStageMetadata highlights condition on prediction, clues, experiment, and transfer', () => {
  assert.equal(getStageMetadata('predict').highlightConditionLine, true);
  assert.equal(getStageMetadata('transfer').usesCountdownCode, true);
  assert.equal(getStageMetadata('case').usesCountdownCode, false);
});

test('formatNotesSummary outputs clean readable summary including marked milestones', () => {
  const notes = createInitialNotes();
  notes.caseExpected = '1, 2, 3';
  notes.caseObserved = '1, 2';
  const summary = formatNotesSummary(
    {
      detective: true,
      predictor: false,
      experimenter: true,
      explainer: false,
      explorer: false,
    },
    notes,
  );
  assert.ok(summary.includes('[x] Detective'));
  assert.ok(summary.includes('[ ] Predictor'));
  assert.ok(summary.includes('I expected: 1, 2, 3'));
});
