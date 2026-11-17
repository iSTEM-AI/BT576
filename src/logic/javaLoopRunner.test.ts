import test from 'node:test';
import assert from 'node:assert/strict';
import {
  COUNTDOWN_CHECK_CODE,
  MISSING_NUMBER_CODE,
  runJavaWhileProgram,
} from './javaLoopRunner';

test('original MissingNumber prints 1 and 2 and stops when number reaches 3', () => {
  const result = runJavaWhileProgram(MISSING_NUMBER_CODE, ['1', '2', '3']);
  assert.equal(result.ok, true);
  assert.deepEqual(result.outputLines, ['1', '2']);
  assert.equal(result.matchesExpected, false);
  assert.equal(result.steps.length, 3);
  assert.equal(result.steps[2].valueAtCheck, 3);
  assert.equal(result.steps[2].conditionPassed, false);
});

test('fixed MissingNumber with <= 3 prints 1, 2, 3 and matches expected', () => {
  const fixed = MISSING_NUMBER_CODE.replace('number < 3', 'number <= 3');
  const result = runJavaWhileProgram(fixed, ['1', '2', '3']);
  assert.equal(result.ok, true);
  assert.deepEqual(result.outputLines, ['1', '2', '3']);
  assert.equal(result.matchesExpected, true);
  assert.equal(result.steps.length, 4);
  assert.equal(result.steps[3].valueAtCheck, 4);
  assert.equal(result.steps[3].conditionPassed, false);
});

test('swapping number++ before println prints 2 and 3', () => {
  const swapped = `public class MissingNumber {
    public static void main(String[] args) {
        int number = 1;
        while (number < 3) {
            number++;
            System.out.println(number);
        }
    }
}`;
  const result = runJavaWhileProgram(swapped, ['1', '2', '3']);
  assert.equal(result.ok, true);
  assert.deepEqual(result.outputLines, ['2', '3']);
  assert.equal(result.matchesExpected, false);
});

test('infinite loop like number-- triggers safety stop with clear message', () => {
  const infinite = MISSING_NUMBER_CODE.replace('number++', 'number--');
  const result = runJavaWhileProgram(infinite, ['1', '2', '3']);
  assert.equal(result.ok, false);
  assert.equal(result.infiniteLoopDetected, true);
  assert.ok(result.errorMessage && result.errorMessage.includes('Stopped after'));
});

test('CountdownCheck original prints 0, 1, 2 and fixed <= 3 prints 0, 1, 2, 3', () => {
  const orig = runJavaWhileProgram(COUNTDOWN_CHECK_CODE, ['0', '1', '2', '3']);
  assert.equal(orig.ok, true);
  assert.deepEqual(orig.outputLines, ['0', '1', '2']);
  assert.equal(orig.matchesExpected, false);

  const fixed = COUNTDOWN_CHECK_CODE.replace('value < 3', 'value <= 3');
  const res = runJavaWhileProgram(fixed, ['0', '1', '2', '3']);
  assert.equal(res.ok, true);
  assert.deepEqual(res.outputLines, ['0', '1', '2', '3']);
  assert.equal(res.matchesExpected, true);
});
