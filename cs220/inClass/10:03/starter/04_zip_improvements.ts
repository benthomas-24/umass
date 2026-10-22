type Pair<T, U> = readonly [T, U];

// 1. Update the zip function so that it returns an iterator (you'll need to
// define a custom iterator class and use it in the implementation)
export function zip<T, U>(array1: T[], array2: U[]): Pair<T, U>[] {
  const result: Pair<T, U>[] = [];
  for (let i = 0; i < array1.length && i < array2.length; i += 1) {
    result.push([array1[i], array2[i]]);
  }
  return result;
}

console.log(zip([1, 2, 3], [4, 5, 6]));
console.log(zip([1, 2, 3], [4, 5]));

class ZipIterator1<T, U> implements Iterator<Pair<T, U>>{
  // Store iterators from each array passed to the constructor
  private iterator1: Iterator<T>;
  private iterator2: Iterator<T>;


  constructor(iterable1: Iterable<T>, iterable2: Iterable<U>){
    this.iterator1 = iterable1[Symbol.iterator]();
    this.iterator2 = iterable2[Symbol.iterator]();
  }
  
  next(): IteratorResult<Pair<T, U>> {
    //Implement the next method using the iterators from the arrays
    // iterator.next() returns an iterator result with {done: boolean, value: <value>}

    // get result objects from both iterators
    const result1 = this.iterator1.next();
    const result2 = this.iterator2.next();
    // if either is done, we're done
    if(result1.done || result2.done){
      return{
        done: true,
        value: undefined
      }
    }
    const value: Pair<T, U> = [result1.value, result2.value];

    return {
      done: false,
      value: value
    }
    // otherwise, produce a pair with those two values
    // & advance the iterators

  }
  [Symbol.iterator]() {
    return this;
  }
}
const a1 = ["Hello", "world", "this"];
const a2 = ["Is", "A", "Test"];

const iter = new ZipIterator1(a1,a2);
console.log(iter.next())
const iter2 = iter[Symbol.iterator]();
console.log(iter2.next());
console.log(iter.next());
for(const item of iter){ // loop expects an iterator
  console.log(item);
}

// 2. Update the zip function/zip iterator so that it works with a range-based for-loop


// 3. What if we want to update the zip function so that it works on other containers besides just arrays?
// With our current tools, what would we need to add to make this possible?


