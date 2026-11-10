/**
 * Iterators/Generators
 *
 * Implement a function sliceUntil that takes:
 * - An iterable.
 * - A start index.
 * - A unary predicate (a function that takes one argument and returns a boolean).
 *
 * sliceUntil should return an iterable iterator that produces values from the
 * given iterable starting at the given index. Stop as soon as the predicate
 * returns false for an element; do not include that element in the output.
 *
 * Implement this twice:
 * 1. Using a custom iterator class.
 * 2. Using generators.
 */

class MyIterator<T> implements IterableIterator<T> {
  private iterator: Iterator<T>;
  private index = 0;
  private finished = false;

  constructor(
    iterable: Iterable<T>,
    private startIndex: number,
    private condition: (arg: T) => boolean,
  ) {
    this.iterator = iterable[Symbol.iterator]();
  }

  next(): IteratorResult<T> {
    if (this.finished) {
      return { value: undefined, done: true };
    }

    // Skip elements before the starting index.
    while (this.index < this.startIndex) {
      const skipped = this.iterator.next();

      if (skipped.done) {
        this.finished = true;
        return { value: undefined, done: true };
      }

      this.index++;
    }

    // Retrieve the next element.
    const curr = this.iterator.next();

    if (curr.done || !this.condition(curr.value)) {
      this.finished = true;
      return { value: undefined, done: true };
    }

    return { value: curr.value, done: false };
  }

  [Symbol.iterator](): IterableIterator<T> {
    return this;
  }
}

function sliceUntil<T>(
  iterable: Iterable<T>,
  i: number,
  unaryPred: (arg: T) => boolean,
): IterableIterator<T> {
  return new MyIterator(iterable, i, unaryPred);
}
