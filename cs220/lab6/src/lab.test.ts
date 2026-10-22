import { AssertionError } from "assert";
import { FLAWED_GEN_ARRAY_SOLUTIONS, GEN_ARRAY_SOLUTIONS } from "../include/genArray.js";
import { AlternatingIterator, oracle } from "./lab.js";

jest.mock("open", () => ({ open: (s: string) => Promise.resolve(), default: (s: string) => Promise.resolve() }));

describe("stableMatchingOracle", () => {
  for (let i = 0; i < GEN_ARRAY_SOLUTIONS.length; i++) {
    const f = GEN_ARRAY_SOLUTIONS[i];

    it(`accepts STABLE_MATCHING_SOLUTION_${i + 1}`, () => {
      expect(() => oracle(f)).not.toThrow();
    });
  }

  for (let i = 0; i < FLAWED_GEN_ARRAY_SOLUTIONS.length; i++) {
    const f = FLAWED_GEN_ARRAY_SOLUTIONS[i];

    it(`rejects FLAWED_STABLE_MATCHING_SOLUTION_${i + 1}`, () => {
      expect(() => oracle(f)).toThrow(AssertionError);
    });
  }
});

function expectSequence<T>(iterator: Iterator<T>, expected: T[]) {
  // Use a bounded number of next() calls so a nonterminating iterator fails a test.
  for (const value of expected) {
    const result = iterator.next();
    expect(result.done).not.toBe(true);
    expect(result.value).toEqual(value);
  }

  // An exhausted iterator should stay exhausted on subsequent calls.
  for (let i = 0; i < 3; i++) {
    expect(iterator.next().done).toBe(true);
  }
}

function makeIterable<T>(values: T[]): Iterable<T> {
  return {
    [Symbol.iterator]() {
      let index = 0;
      return {
        next(): IteratorResult<T> {
          if (index < values.length) {
            return { done: false, value: values[index++] };
          }
          return { done: true, value: undefined };
        },
      };
    },
  };
}

describe("AlternatingIterator", () => {
  it.each([
    { name: "equal lengths", first: [1, 2, 3], second: [10, 20, 30], expected: [1, 10, 2, 20, 3, 30] },
    { name: "a shorter first input", first: [1], second: [10, 20, 30], expected: [1, 10, 20, 30] },
    { name: "a shorter second input", first: [1, 2, 3], second: [10], expected: [1, 10, 2, 3] },
    { name: "an empty first input", first: [], second: [10, 20], expected: [10, 20] },
    { name: "an empty second input", first: [1, 2], second: [], expected: [1, 2] },
    { name: "two empty inputs", first: [], second: [], expected: [] },
    { name: "one element in each input", first: [1], second: [10], expected: [1, 10] },
  ])("returns the correct sequence for $name", ({ first, second, expected }) => {
    expectSequence(new AlternatingIterator(first, second), expected);
  });

  it("matches the example from the slides", () => {
    expectSequence(new AlternatingIterator([1, 2, 3], [10, 20, 30, 40]), [1, 10, 2, 20, 3, 30, 40]);
  });

  it("preserves input order and repeated values without sorting", () => {
    expectSequence(new AlternatingIterator([3, 1, 3], [2, 2]), [3, 2, 1, 2, 3]);
  });

  it("works with strings", () => {
    expectSequence(new AlternatingIterator("abc", "XY"), ["a", "X", "b", "Y", "c"]);
  });

  it("works with sets", () => {
    expectSequence(new AlternatingIterator(new Set([1, 2]), new Set([10, 20, 30])), [1, 10, 2, 20, 30]);
  });

  it("works with custom iterables whose iterators are not themselves iterable", () => {
    expectSequence(new AlternatingIterator(makeIterable([1, 2, 3]), makeIterable([10])), [1, 10, 2, 3]);
  });

  it("uses done to detect exhaustion, preserving falsy and undefined values", () => {
    type Value = number | string | boolean | null | undefined;
    expectSequence(new AlternatingIterator<Value>([0, "", undefined], [false, "b", null]), [
      0,
      false,
      "",
      "b",
      undefined,
      null,
    ]);
  });

  it("returns the original objects", () => {
    const first = { name: "first" };
    const second = { name: "second" };
    const iterator = new AlternatingIterator([first], [second]);
    expect(iterator.next().value).toBe(first);
    expect(iterator.next().value).toBe(second);
    expect(iterator.next().done).toBe(true);
  });

  it("supports for...of", () => {
    const values: number[] = [];
    for (const value of new AlternatingIterator([1, 2], [10, 20, 30])) {
      values.push(value);
      // Bound the loop so an iterator that keeps yielding fails instead of hanging.
      if (values.length > 5) break;
    }
    expect(values).toEqual([1, 10, 2, 20, 30]);
  });

  it("returns itself from Symbol.iterator and continues from its current position", () => {
    const iterator = new AlternatingIterator([1, 2], [10, 20]);
    expect(iterator[Symbol.iterator]()).toBe(iterator);
    expect(iterator.next()).toEqual({ done: false, value: 1 });
    expectSequence(iterator[Symbol.iterator](), [10, 2, 20]);
  });

  it("keeps separate instances independent", () => {
    const firstInput = [1, 2];
    const secondInput = [10, 20];
    const first = new AlternatingIterator(firstInput, secondInput);
    const second = new AlternatingIterator(firstInput, secondInput);
    expect(first.next()).toEqual({ done: false, value: 1 });
    expectSequence(second, [1, 10, 2, 20]);
    expectSequence(first, [10, 2, 20]);
  });
});
