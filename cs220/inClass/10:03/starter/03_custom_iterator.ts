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
    throw new Error("Not implemented yet");
  }
}

const items = ["spam", "egg", "sausage", "spam"];

const iterator = new DemoArrayIterator(items);
let current_result = iterator.next();
while (!current_result.done) {
  console.log(current_result.value);
  current_result = iterator.next();
}

// 2. Update the DemoArray class below so that we can
// request an iterator from it. It should work with a range-based
// for loop after adding that.

// class DemoArray<ItemType> implements Iterable<ItemType> {
//   private _data: ItemType[];

//   constructor(data: ItemType[]) {
//     this._data = data;
//   }
// }

// for (const item of new DemoArray(["waa", "luigi", "time"])) {
//   console.log(item);
// }
