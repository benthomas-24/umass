// Simplified versions of TypeScript's Iterator and IteratorResult
// types, for reference.
// interface Iterator<ValueType> {
//   next(): IteratorResult<ValueType>;
// }

// interface IteratorResult<ValueType> {
//   done: boolean;
//   value?: ValueType | undefined;
// }

class DemoArrayIterator<ValueType> implements Iterator<ValueType> {
  private index = 0;

  constructor(private array: ValueType[]) {}

  // 1. Implement the next() method to return the current element
  // and advance the iterator
  next(): IteratorResult<ValueType> {
    // SKELETON throw new Error("Not implemented yet");
    // BEGIN SOLUTION
    if (this.index === this.array.length) {
      return {
        done: true,
        value: undefined,
      };
    }

    const value = this.array[this.index];
    this.index += 1;
    return {
      done: false,
      value: value,
    }
    // END SOLUTION
  }
}

const items = ["spam", "egg", "sausage", "spam"];

const iterator = new DemoArrayIterator(items);
let current_result = iterator.next();
while (!current_result.done) {
  console.log(current_result.value);
  current_result = iterator.next();
}

// SKELETON // 2. Update the DemoArray class below so that we can
// SKELETON // request an iterator from it. It should work with a range-based
// SKELETON // for loop after adding that.

// SKELETON // class DemoArray<ItemType> implements Iterable<ItemType> {
// SKELETON //   private _data: ItemType[];

// SKELETON //   constructor(data: ItemType[]) {
// SKELETON //     this._data = data;
// SKELETON //   }
// SKELETON // }

// SKELETON // for (const item of new DemoArray(["waa", "luigi", "time"])) {
// SKELETON //   console.log(item);
// SKELETON // }
// BEGIN SOLUTION
class DemoArray<ItemType> implements Iterable<ItemType> {
  private _data: ItemType[];

  constructor(data: ItemType[]) {
    this._data = data;
  }

  [Symbol.iterator]() {
    return new DemoArrayIterator(this._data);
  }
}

for (const item of new DemoArray(["waa", "luigi", "time"])) {
  console.log(item);
}
// END SOLUTION
