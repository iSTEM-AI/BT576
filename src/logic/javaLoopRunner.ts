export interface TraceStep {
  checkNumber: number;
  variableName: string;
  valueAtCheck: number;
  conditionText: string;
  conditionPassed: boolean;
  printedLines: string[];
  valueAfterBody: number;
  note: string;
}

export interface JavaRunResult {
  ok: boolean;
  variableName: string;
  initialValue: number;
  conditionText: string;
  outputLines: string[];
  steps: TraceStep[];
  infiniteLoopDetected: boolean;
  errorMessage: string | null;
  matchesExpected: boolean;
}

export const MISSING_NUMBER_CODE = `public class MissingNumber {
    public static void main(String[] args) {
        int number = 1;

        while (number < 3) {
            System.out.println(number);
            number++;
        }
    }
}`;

export const COUNTDOWN_CHECK_CODE = `public class CountdownCheck {
    public static void main(String[] args) {
        int value = 0;

        while (value < 3) {
            System.out.println(value);
            value++;
        }
    }
}`;

const MAX_ITERATIONS = 50;

function stripComments(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '');
}

function evaluateSimpleExpr(
  expr: string,
  env: Record<string, number>,
): number | string | null {
  const trimmed = expr.trim();
  if (!trimmed) {
    return null;
  }

  // String literal "..."
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  // Integer literal
  if (/^-?\d+$/.test(trimmed)) {
    return Number.parseInt(trimmed, 10);
  }

  // Variable name
  if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(trimmed)) {
    if (trimmed in env) {
      return env[trimmed];
    }
    return null;
  }

  // Binary + or - (e.g., number + 1 or 1 + number)
  const addMatch = trimmed.match(/^([a-zA-Z_][a-zA-Z0-9_]*|-?\d+)\s*([+-])\s*([a-zA-Z_][a-zA-Z0-9_]*|-?\d+)$/);
  if (addMatch) {
    const leftVal = evaluateSimpleExpr(addMatch[1], env);
    const rightVal = evaluateSimpleExpr(addMatch[3], env);
    if (typeof leftVal === 'number' && typeof rightVal === 'number') {
      return addMatch[2] === '+' ? leftVal + rightVal : leftVal - rightVal;
    }
  }

  return null;
}

function evaluateComparison(
  clause: string,
  env: Record<string, number>,
): { valid: boolean; result: boolean } {
  const match = clause
    .trim()
    .match(/^(.+?)\s*(<=|>=|==|!=|<|>)\s*(.+)$/);
  if (!match) {
    return { valid: false, result: false };
  }

  const left = evaluateSimpleExpr(match[1], env);
  const op = match[2];
  const right = evaluateSimpleExpr(match[3], env);

  if (typeof left !== 'number' || typeof right !== 'number') {
    return { valid: false, result: false };
  }

  switch (op) {
    case '<':
      return { valid: true, result: left < right };
    case '<=':
      return { valid: true, result: left <= right };
    case '>':
      return { valid: true, result: left > right };
    case '>=':
      return { valid: true, result: left >= right };
    case '==':
      return { valid: true, result: left === right };
    case '!=':
      return { valid: true, result: left !== right };
    default:
      return { valid: false, result: false };
  }
}

function evaluateCondition(
  conditionText: string,
  env: Record<string, number>,
): { valid: boolean; result: boolean } {
  const clean = conditionText.trim();
  if (!clean) {
    return { valid: false, result: false };
  }

  if (clean.includes('||')) {
    const parts = clean.split('||');
    let anyTrue = false;
    for (const part of parts) {
      const evaluated = evaluateCondition(part, env);
      if (!evaluated.valid) return { valid: false, result: false };
      if (evaluated.result) anyTrue = true;
    }
    return { valid: true, result: anyTrue };
  }

  if (clean.includes('&&')) {
    const parts = clean.split('&&');
    let allTrue = true;
    for (const part of parts) {
      const evaluated = evaluateComparison(part, env);
      if (!evaluated.valid) return { valid: false, result: false };
      if (!evaluated.result) allTrue = false;
    }
    return { valid: true, result: allTrue };
  }

  return evaluateComparison(clean, env);
}

function splitStatements(block: string): string[] {
  return block
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function executeStatement(
  stmt: string,
  env: Record<string, number>,
): { printed?: string; error?: string } {
  const clean = stmt.trim();
  if (!clean) return {};

  // System.out.println(...)
  const printlnMatch = clean.match(/^System\.out\.println\s*\((.*)\)$/);
  if (printlnMatch) {
    const arg = printlnMatch[1].trim();
    if (arg === '') {
      return { printed: '' };
    }
    const value = evaluateSimpleExpr(arg, env);
    if (value === null) {
      return {
        error: `Could not understand "${arg}" inside System.out.println(...).`,
      };
    }
    return { printed: String(value) };
  }

  // Increment / decrement: number++, ++number, number--, --number
  const incDecMatch = clean.match(
    /^(?:([a-zA-Z_][a-zA-Z0-9_]*)\s*(\+\+|--)|(\+\+|--)\s*([a-zA-Z_][a-zA-Z0-9_]*))$/,
  );
  if (incDecMatch) {
    const varName = incDecMatch[1] || incDecMatch[4];
    const op = incDecMatch[2] || incDecMatch[3];
    if (!(varName in env)) {
      return { error: `Variable "${varName}" has not been declared with int yet.` };
    }
    env[varName] = op === '++' ? env[varName] + 1 : env[varName] - 1;
    return {};
  }

  // Compound assignment: number += 1 or number -= 1
  const compoundMatch = clean.match(
    /^([a-zA-Z_][a-zA-Z0-9_]*)\s*(\+=|-=)\s*(.+)$/,
  );
  if (compoundMatch) {
    const varName = compoundMatch[1];
    const op = compoundMatch[2];
    const delta = evaluateSimpleExpr(compoundMatch[3], env);
    if (!(varName in env)) {
      return { error: `Variable "${varName}" has not been declared with int yet.` };
    }
    if (typeof delta !== 'number') {
      return { error: `Expected a whole number in "${clean}".` };
    }
    env[varName] = op === '+=' ? env[varName] + delta : env[varName] - delta;
    return {};
  }

  // Declaration or assignment: int number = 1; or number = number + 1;
  const assignMatch = clean.match(
    /^(?:int\s+)?([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)$/,
  );
  if (assignMatch) {
    const isDecl = clean.startsWith('int ');
    const varName = assignMatch[1];
    if (!isDecl && !(varName in env)) {
      return { error: `Variable "${varName}" has not been declared with int yet.` };
    }
    const val = evaluateSimpleExpr(assignMatch[2], env);
    if (typeof val !== 'number') {
      return { error: `Expected a whole number expression in "${clean}".` };
    }
    env[varName] = val;
    return {};
  }

  return {
    error: `This prototype simulator supports int variables, while (...) loops, increments, and System.out.println(...). Check syntax near: "${clean}".`,
  };
}

function checkBalancedBraces(source: string): boolean {
  let depth = 0;
  for (const ch of source) {
    if (ch === '{') depth++;
    if (ch === '}') depth--;
    if (depth < 0) return false;
  }
  return depth === 0;
}

export function runJavaWhileProgram(
  source: string,
  expectedOutput: string[],
): JavaRunResult {
  const cleaned = stripComments(source);

  if (!checkBalancedBraces(cleaned)) {
    return {
      ok: false,
      variableName: 'number',
      initialValue: 0,
      conditionText: '',
      outputLines: [],
      steps: [],
      infiniteLoopDetected: false,
      errorMessage:
        'Check your curly braces { } — one appears to be missing or unmatched.',
      matchesExpected: false,
    };
  }

  // Extract main body if present, otherwise evaluate directly
  let targetBody = cleaned;
  const mainIndex = cleaned.search(/public\s+static\s+void\s+main\s*\([^)]*\)\s*\{/);
  if (mainIndex !== -1) {
    const openBraceIdx = cleaned.indexOf('{', mainIndex);
    let depth = 0;
    let closeBraceIdx = -1;
    for (let i = openBraceIdx; i < cleaned.length; i++) {
      if (cleaned[i] === '{') depth++;
      if (cleaned[i] === '}') {
        depth--;
        if (depth === 0) {
          closeBraceIdx = i;
          break;
        }
      }
    }
    if (closeBraceIdx !== -1) {
      targetBody = cleaned.slice(openBraceIdx + 1, closeBraceIdx);
    }
  }

  const whileMatch = targetBody.match(/while\s*\(([^)]*)\)\s*\{([\s\S]*?)\}/);
  if (!whileMatch || whileMatch.index === undefined) {
    return {
      ok: false,
      variableName: 'number',
      initialValue: 0,
      conditionText: '',
      outputLines: [],
      steps: [],
      infiniteLoopDetected: false,
      errorMessage:
        'Could not find a valid while (...) { ... } loop inside main.',
      matchesExpected: false,
    };
  }

  const beforeWhile = targetBody.slice(0, whileMatch.index);
  const conditionText = whileMatch[1].trim();
  const whileBody = whileMatch[2];
  const afterWhile = targetBody.slice(whileMatch.index + whileMatch[0].length);

  // Verify semicolons on statements before/inside/after loop
  const env: Record<string, number> = {};
  const outputLines: string[] = [];

  for (const stmt of splitStatements(beforeWhile)) {
    const res = executeStatement(stmt, env);
    if (res.error) {
      return {
        ok: false,
        variableName: Object.keys(env)[0] || 'number',
        initialValue: 0,
        conditionText,
        outputLines,
        steps: [],
        infiniteLoopDetected: false,
        errorMessage: res.error,
        matchesExpected: false,
      };
    }
    if (res.printed !== undefined) {
      outputLines.push(res.printed);
    }
  }

  const variableName = Object.keys(env)[0] || 'number';
  const initialValue = env[variableName] ?? 0;

  if (!(variableName in env)) {
    return {
      ok: false,
      variableName,
      initialValue: 0,
      conditionText,
      outputLines: [],
      steps: [],
      infiniteLoopDetected: false,
      errorMessage:
        'Declare a starting integer before the while loop (for example: int number = 1;).',
      matchesExpected: false,
    };
  }

  const bodyStatements = splitStatements(whileBody);
  const steps: TraceStep[] = [];
  let infiniteLoopDetected = false;

  for (let checkNum = 1; checkNum <= MAX_ITERATIONS; checkNum++) {
    const valueAtCheck = env[variableName];
    const cond = evaluateCondition(conditionText, env);

    if (!cond.valid) {
      return {
        ok: false,
        variableName,
        initialValue,
        conditionText,
        outputLines,
        steps,
        infiniteLoopDetected: false,
        errorMessage: `Could not evaluate loop condition "(${conditionText})". Try a comparison like ${variableName} <= 3.`,
        matchesExpected: false,
      };
    }

    if (!cond.result) {
      steps.push({
        checkNumber: checkNum,
        variableName,
        valueAtCheck,
        conditionText,
        conditionPassed: false,
        printedLines: [],
        valueAfterBody: valueAtCheck,
        note: `Condition "${conditionText}" is false when ${variableName} is ${valueAtCheck}. The loop stops.`,
      });
      break;
    }

    const stepPrinted: string[] = [];
    for (const stmt of bodyStatements) {
      const res = executeStatement(stmt, env);
      if (res.error) {
        return {
          ok: false,
          variableName,
          initialValue,
          conditionText,
          outputLines,
          steps,
          infiniteLoopDetected: false,
          errorMessage: res.error,
          matchesExpected: false,
        };
      }
      if (res.printed !== undefined) {
        stepPrinted.push(res.printed);
        outputLines.push(res.printed);
      }
    }

    const valueAfterBody = env[variableName];
    steps.push({
      checkNumber: checkNum,
      variableName,
      valueAtCheck,
      conditionText,
      conditionPassed: true,
      printedLines: stepPrinted,
      valueAfterBody,
      note:
        stepPrinted.length > 0
          ? `Condition is true: printed ${stepPrinted.join(', ')}, then ${variableName} became ${valueAfterBody}.`
          : `Condition is true: ${variableName} became ${valueAfterBody}.`,
    });

    if (checkNum === MAX_ITERATIONS) {
      infiniteLoopDetected = true;
    }
  }

  if (!infiniteLoopDetected) {
    for (const stmt of splitStatements(afterWhile)) {
      const res = executeStatement(stmt, env);
      if (res.error) {
        return {
          ok: false,
          variableName,
          initialValue,
          conditionText,
          outputLines,
          steps,
          infiniteLoopDetected: false,
          errorMessage: res.error,
          matchesExpected: false,
        };
      }
      if (res.printed !== undefined) {
        outputLines.push(res.printed);
      }
    }
  }

  const matchesExpected =
    !infiniteLoopDetected &&
    outputLines.length === expectedOutput.length &&
    outputLines.every((line, idx) => line === expectedOutput[idx]);

  return {
    ok: !infiniteLoopDetected,
    variableName,
    initialValue,
    conditionText,
    outputLines,
    steps,
    infiniteLoopDetected,
    errorMessage: infiniteLoopDetected
      ? `Stopped after ${MAX_ITERATIONS} loop checks because "${conditionText}" stayed true. Check whether ${variableName} moves toward the stopping boundary.`
      : null,
    matchesExpected,
  };
}
