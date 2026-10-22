// Examine the class below, then write a "countdown" function
// that returns a generator that does the same thing.
class CountdownIterator implements IterableIterator<number> {
  private _count: number;

  constructor(count: number) {
    this._count = count;
  }

  next(): IteratorResult<number> {
    if (this._count < 0) {
      return {
        done: true,
        value: undefined,
      };
    }

    let to_yield = this._count;
    this._count -= 1;
    return {
      done: false,
      value: to_yield,
    };
  }

  [Symbol.iterator]() {
    return this;
  }
}

for (const num of new CountdownIterator(10)) {
  console.log(num);
}

// BEGIN SOLUTION
function* countdown(count: number) {
  while (count >= 0) {
    yield count;
    count -=1;
  }
}

for (const num of countdown(10)) {
  console.log(num);
}
// END SOLUTION

// Finally, go back to 04 and update "zip" to return a generator instead.
