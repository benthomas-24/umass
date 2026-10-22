import assert from "assert";

/**
 *  Exercise 1: Property Based Testing
 *
 * Implement oracle(genArray: (num: number) => number[][]).
 * Take a function that generates a 2D array of numbers.
 * Use assertions to test that the generated array satisfies the properties
 * described below.
 *
 * An n×n array of numbers such that each row and column is a permutation of
 * the numbers from 0 to n-1 (assume n is non-negative).
 *
 * The function randomPositiveInteger() is provided for your convenience.
 * Use higher-order functions when appropriate.
 * Try to write your solution in O(n^2).
 */

function randomPositiveInteger() {
  return Math.floor(Math.random() * 1000 + 1);
}

export function oracle(genArray: (num: number) => number[][]) {
  let n = Math.floor(Math.random() * 1000);
  let a = genArray(n);
  const valid = (x: number) => x % 1 === 0 && 0 <= x && x < n;
  function isPerm(p: number[]) {
    assert(p.length === n, "length is n");
    assert(p.every(valid), "valid numbers");
    const f = Array(n).fill(1);
    assert(
      p.every(e => --f[e] === 0),
      "no duplicates"
    );
  }
  assert(a.length === n, "array has n rows");
  a.forEach(isPerm);
  for (let k = 0; k < n; ++k) {
    isPerm(a.map(r => r[k]));
  }
}

/**
 * Exercise 2: Iterators
 *
 * Implement AlternatingIterator<T>.
 * Take two iterables and yield their elements alternately, starting with the first.
 * When one iterator is exhausted, continue yielding elements from the other.
 * Finish when both iterators are exhausted.
 * The result should be an iterable iterator, usable with next() and for...of.
 *
 * Example: [1, 2, 3] and [10, 20, 30, 40] yield 1, 10, 2, 20, 3, 30, 40.
 */

export class AlternatingIterator<T> implements IterableIterator<T> {
  private first: Iterator<T>;
  private second: Iterator<T>;
  private useFirst: boolean;

  constructor(a: Iterable<T>, b: Iterable<T>) {
    this.first = a[Symbol.iterator]();
    this.second = b[Symbol.iterator]();
    this.useFirst = true;
  }
  [Symbol.iterator](): IterableIterator<T> {
    return this;
  }

  next(): IteratorResult<T> {
    const curr = this.useFirst ? this.first : this.second;
    const other = this.useFirst ? this.second : this.first;
    const result = curr.next();
    if (!result.done) {
      this.useFirst = !this.useFirst;
      return result;
    }
    return other.next();
  }
}

// TODO: Finish implementing the IterableIterator interface.

// After implementing the class, uncomment either example and run npm run start.
// Using next() to inspect individual results:
// const it = new AlternatingIterator([1, 2, 3], [10, 20, 30, 40]);
// console.log(it.next()); // { done: false, value: 1 }
// console.log(it.next()); // { done: false, value: 10 }
// Keep calling next() to get 2, 20, 3, 30, 40, then { done: true, value: undefined }.

// Using for...of to visit every value:
// for (const value of new AlternatingIterator([1, 2, 3], [10, 20, 30, 40])) {
//   console.log(value);
// }
// Expected output: 1, 10, 2, 20, 3, 30, 40.


class rangeIterator implements Iterator<number>{
  
}