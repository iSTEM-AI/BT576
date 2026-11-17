export type StageId =
  | 'mission'
  | 'case'
  | 'predict'
  | 'hint-one'
  | 'hint-two'
  | 'experiment'
  | 'help'
  | 'explain'
  | 'explanation-check'
  | 'transfer'
  | 'transfer-check'
  | 'finish';

export type MilestoneId =
  | 'detective'
  | 'predictor'
  | 'experimenter'
  | 'explainer'
  | 'explorer';

export interface MilestoneDefinition {
  id: MilestoneId;
  title: string;
  description: string;
  stageHint: StageId;
}

export const MILESTONES: MilestoneDefinition[] = [
  {
    id: 'detective',
    title: 'Detective',
    description: 'I described what I noticed.',
    stageHint: 'case',
  },
  {
    id: 'predictor',
    title: 'Predictor',
    description: 'I made a reasonable guess.',
    stageHint: 'predict',
  },
  {
    id: 'experimenter',
    title: 'Experimenter',
    description: 'I tested a change and observed the result.',
    stageHint: 'experiment',
  },
  {
    id: 'explainer',
    title: 'Explainer',
    description: 'I explained what happened.',
    stageHint: 'explain',
  },
  {
    id: 'explorer',
    title: 'Explorer',
    description: 'I tried a new problem without hints.',
    stageHint: 'transfer',
  },
];

export interface ClueOneRowAnswer {
  value: number;
  conditionTrue: 'true' | 'false' | '';
  printsValue: 'Yes' | 'No' | '';
}

export interface LearnerNotes {
  // Stage 1: Open the Case
  caseExpected: string;
  caseObserved: string;
  caseDifference: string;
  // Stage 2: Make a Prediction
  predictionText: string;
  // Clue 1 trace table
  clueOneRows: ClueOneRowAnswer[];
  clueOneReflection: string;
  // Clue 2 boundary thought
  clueTwoChoice: string;
  // Stage 3: Experiment log
  expPrediction: string;
  expChange: string;
  expActualOutput: string;
  expMatched: 'Yes' | 'No' | 'Partly' | '';
  expTakeaway: string;
  // Help reflection
  helpSupportChosen: 'peer' | 'teacher' | 'ai' | '';
  helpWhy: string;
  // Stage 4: Explain
  explainMode: 'write' | 'aloud' | 'trace';
  explainWhyOriginalStops: string;
  explainWhatChangeDid: string;
  explainOneThroughFour: string;
  explainStarterConditionWas: string;
  explainStarterMadeCondition: string;
  explainStarterSoProgram: string;
  // Stage 5: Independent challenge
  transferPredictedOutput: string;
  transferWhyStops: string;
  transferProposedChange: string;
  transferActualResult: string;
  // Mission Complete reflections
  finishHelpfulMilestone: string;
  finishConfusingStep: string;
  finishOneChange: string;
}

export function createInitialNotes(): LearnerNotes {
  return {
    caseExpected: '',
    caseObserved: '',
    caseDifference: '',
    predictionText: '',
    clueOneRows: [
      { value: 1, conditionTrue: '', printsValue: '' },
      { value: 2, conditionTrue: '', printsValue: '' },
      { value: 3, conditionTrue: '', printsValue: '' },
    ],
    clueOneReflection: '',
    clueTwoChoice: '',
    expPrediction: '',
    expChange: '',
    expActualOutput: '',
    expMatched: '',
    expTakeaway: '',
    helpSupportChosen: '',
    helpWhy: '',
    explainMode: 'write',
    explainWhyOriginalStops: '',
    explainWhatChangeDid: '',
    explainOneThroughFour: '',
    explainStarterConditionWas: '',
    explainStarterMadeCondition: '',
    explainStarterSoProgram: '',
    transferPredictedOutput: '',
    transferWhyStops: '',
    transferProposedChange: '',
    transferActualResult: '',
    finishHelpfulMilestone: '',
    finishConfusingStep: '',
    finishOneChange: '',
  };
}

export interface ClueRowFeedback {
  value: number;
  expectedConditionTrue: 'true' | 'false';
  expectedPrintsValue: 'Yes' | 'No';
  isConditionCorrect: boolean;
  isPrintsCorrect: boolean;
  isComplete: boolean;
}

export function evaluateClueOneRow(row: ClueOneRowAnswer): ClueRowFeedback {
  const expectedConditionTrue = row.value < 3 ? 'true' : 'false';
  const expectedPrintsValue = row.value < 3 ? 'Yes' : 'No';
  return {
    value: row.value,
    expectedConditionTrue,
    expectedPrintsValue,
    isConditionCorrect: row.conditionTrue === expectedConditionTrue,
    isPrintsCorrect: row.printsValue === expectedPrintsValue,
    isComplete: row.conditionTrue !== '' && row.printsValue !== '',
  };
}

export function getStageMetadata(stage: StageId): {
  title: string;
  shortLabel: string;
  usesCountdownCode: boolean;
  highlightConditionLine: boolean;
} {
  switch (stage) {
    case 'mission':
      return {
        title: 'Your Mission Map',
        shortLabel: 'Mission Map',
        usesCountdownCode: false,
        highlightConditionLine: false,
      };
    case 'case':
      return {
        title: 'Stage 1: Open the Case',
        shortLabel: '1. Open Case',
        usesCountdownCode: false,
        highlightConditionLine: false,
      };
    case 'predict':
      return {
        title: 'Stage 2: Make a Prediction',
        shortLabel: '2. Predict',
        usesCountdownCode: false,
        highlightConditionLine: true,
      };
    case 'hint-one':
      return {
        title: 'Clue 1: Follow the Number',
        shortLabel: 'Clue 1',
        usesCountdownCode: false,
        highlightConditionLine: true,
      };
    case 'hint-two':
      return {
        title: 'Clue 2: Look at the Boundary',
        shortLabel: 'Clue 2',
        usesCountdownCode: false,
        highlightConditionLine: true,
      };
    case 'experiment':
      return {
        title: 'Stage 3: Run an Experiment',
        shortLabel: '3. Experiment',
        usesCountdownCode: false,
        highlightConditionLine: true,
      };
    case 'help':
      return {
        title: 'Help Is Part of Debugging',
        shortLabel: 'Get Help',
        usesCountdownCode: false,
        highlightConditionLine: false,
      };
    case 'explain':
      return {
        title: 'Stage 4: Explain Your Discovery',
        shortLabel: '4. Explain',
        usesCountdownCode: false,
        highlightConditionLine: true,
      };
    case 'explanation-check':
      return {
        title: 'Example Explanation',
        shortLabel: 'Compare',
        usesCountdownCode: false,
        highlightConditionLine: true,
      };
    case 'transfer':
      return {
        title: 'Stage 5: Independent Challenge',
        shortLabel: '5. Explorer',
        usesCountdownCode: true,
        highlightConditionLine: true,
      };
    case 'transfer-check':
      return {
        title: 'Independent Challenge Check',
        shortLabel: 'Check',
        usesCountdownCode: true,
        highlightConditionLine: true,
      };
    case 'finish':
      return {
        title: 'Mission Complete',
        shortLabel: 'Complete',
        usesCountdownCode: false,
        highlightConditionLine: false,
      };
  }
}

export function formatNotesSummary(
  milestones: Record<MilestoneId, boolean>,
  notes: LearnerNotes,
): string {
  const lines: string[] = [
    'Debug Quest: The Missing Number — Learner Notes',
    '------------------------------------------------',
    '',
    'Progress Card:',
    ...MILESTONES.map(
      (m) => `- [${milestones[m.id] ? 'x' : ' '}] ${m.title}: ${m.description}`,
    ),
    '',
    'Stage 1: Open the Case',
    `  I expected: ${notes.caseExpected || '(blank)'}`,
    `  I observed: ${notes.caseObserved || '(blank)'}`,
    `  One difference I notice: ${notes.caseDifference || '(blank)'}`,
    '',
    'Stage 2: Prediction',
    `  I think the program stops before printing 3 because: ${notes.predictionText || '(blank)'}`,
    '',
    'Stage 3: Experiment Log',
    `  My prediction: ${notes.expPrediction || '(blank)'}`,
    `  The one change I made: ${notes.expChange || '(blank)'}`,
    `  Actual output: ${notes.expActualOutput || '(blank)'}`,
    `  Matched prediction: ${notes.expMatched || '(blank)'}`,
    `  What this tells me: ${notes.expTakeaway || '(blank)'}`,
    '',
    'Stage 4: Explanation',
    `  Why original stops before 3: ${notes.explainWhyOriginalStops || '(blank)'}`,
    `  What my change did: ${notes.explainWhatChangeDid || '(blank)'}`,
    `  If goal changed to 1 through 4: ${notes.explainOneThroughFour || '(blank)'}`,
    '',
    'Stage 5: Independent Challenge (CountdownCheck)',
    `  Predicted output: ${notes.transferPredictedOutput || '(blank)'}`,
    `  Why the program stops: ${notes.transferWhyStops || '(blank)'}`,
    `  Proposed change: ${notes.transferProposedChange || '(blank)'}`,
    `  What happened when I ran it: ${notes.transferActualResult || '(blank)'}`,
  ];

  if (
    notes.finishHelpfulMilestone ||
    notes.finishConfusingStep ||
    notes.finishOneChange
  ) {
    lines.push(
      '',
      'Final Reflection:',
      `  Most helpful milestone: ${notes.finishHelpfulMilestone || '(blank)'}`,
      `  Confusing or unnecessary step: ${notes.finishConfusingStep || '(blank)'}`,
      `  One thing to change: ${notes.finishOneChange || '(blank)'}`,
    );
  }

  return lines.join('\n');
}
