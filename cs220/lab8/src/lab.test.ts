import { mergedGenerator } from "./lab.js";
import assert from "assert";

// Limit collection so a generator that never terminates fails the test.
function arrayFromIterator<T>(it: Iterator<T> | Generator<T>, expected_length: number): T[] {
  const values = [];
  let result = it.next();
  let i = 0;
  while (!result.done && i++ < expected_length) {
    values.push(result.value);
    result = it.next();
  }
  assert(result.done, "Iterator or Generator did not terminate after yielding the expected number of items.");
  return values;
}

function compareArrays(arr1: number[], arr2: number[]) {
  assert(arr1.length === arr2.length);
  for (let i = 0; i < arr1.length; i++) {
    assert(arr1[i] === arr2[i]);
  }
}

function mergedGeneratorHelper(
  arr1: number[],
  arr2: number[],
  getOutput: (iter1: Iterator<number>, iter2: Iterator<number>, expected_length: number) => number[],
  expected: number[]
) {
  const iterator1 = arr1[Symbol.iterator]();
  const iterator2 = arr2[Symbol.iterator]();
  const output = getOutput(iterator1, iterator2, arr1.length + arr2.length);
  compareArrays(output, expected);
}

function mergeIteratorsIntoGenerator(
  iterator1: Iterator<number>,
  iterator2: Iterator<number>,
  expected_length: number
) {
  const merged_generator = mergedGenerator(iterator1, iterator2);
  return arrayFromIterator(merged_generator, expected_length);
}

describe("mergedGenerator", () => {
  it("correctly merges two iterators", () => {
    mergedGeneratorHelper([1, 3, 5], [2, 4, 6], mergeIteratorsIntoGenerator, [1, 2, 3, 4, 5, 6]);
  });

  it("correctly merges two iterators where one iterator is always less than the other", () => {
    mergedGeneratorHelper([1, 2, 3], [5, 7, 8], mergeIteratorsIntoGenerator, [1, 2, 3, 5, 7, 8]);
  });

  it("correctly merges two iterators where there are ties", () => {
    mergedGeneratorHelper([1, 2, 2], [0, 2, 8], mergeIteratorsIntoGenerator, [0, 1, 2, 2, 2, 8]);
  });

  it("correctly merges two empty iterators", () => {
    mergedGeneratorHelper([] as number[], [] as number[], mergeIteratorsIntoGenerator, [] as number[]);
  });

  it("correctly merges an empty and nonempty iterator", () => {
    mergedGeneratorHelper([] as number[], [1, 4, 5], mergeIteratorsIntoGenerator, [1, 4, 5]);
  });

  it("correctly merges two non-empty iterators with a different number of items", () => {
    mergedGeneratorHelper([2], [1, 4, 5], mergeIteratorsIntoGenerator, [1, 2, 4, 5]);
  });

  it("correctly terminates after both iterators have been exhausted", () => {
    const iterator1 = [2, 6][Symbol.iterator]();
    const iterator2 = [1, 4, 5][Symbol.iterator]();
    const merged_generator = mergedGenerator(iterator1, iterator2);
    const output = arrayFromIterator(merged_generator, 5);
    const expected = [1, 2, 4, 5, 6];
    expect(output).toEqual(expected);
    for (let i = 0; i < 6; i++) {
      expect(merged_generator.next()).toEqual({ done: true, value: undefined });
    }
  });
});
