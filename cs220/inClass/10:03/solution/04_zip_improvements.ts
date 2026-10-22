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

// BEGIN SOLUTION
function zip1<T, U>(array1: T[], array2: U[]) {
  return new ZipIterator1(array1, array2);
}

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
}

console.log(zip1([1, 2, 3], [4, 5, 6]));
console.log(zip1([1, 2, 3], [4, 5]));
// END SOLUTION

// 2. Update the zip function/zip iterator so that it works with a range-based for-loop

// BEGIN SOLUTION
function zip2<T, U>(array1: T[], array2: U[]) {
  return new ZipIterator2(array1, array2);
}

class ZipIterator2<T, U> {
  index = 0;
  constructor(private array1: T[], private array2: U[]) {
  }

  next(): IteratorResult<Pair<T, U>> {
    if (this.index === this.array1.length || this.index === this.array2.length) {
      return {
        done: true,
        value: undefined,
      };
    }

    const value: Pair<T, U> = [this.array1[this.index], this.array2[this.index]];
    this.index += 1;
    return {
      done: false,
      value: value,
    };
  }

  [Symbol.iterator]() {
    return this;
  }
}

for (const pair of zip2([1, 2, 3], [4, 5, 6])) {
  console.log(pair);
}
// END SOLUTION

// 3. What if we want to update the zip function so that it works on other containers besides just arrays?
// With our current tools, what would we need to add to make this possible?

// BEGIN SOLUTION
function zip3<T, U>(iterable1: Iterable<T>, iterable2: Iterable<U>) {
  return new ZipIterator3(iterable1, iterable2);
}

class ZipIterator3<T, U> {
  iter1: Iterator<T>;
  iter2: Iterator<U>;

  constructor(iterable1: Iterable<T>, iterable2: Iterable<U>) {
    this.iter1 = iterable1[Symbol.iterator]();
    this.iter2 = iterable2[Symbol.iterator]();
  }

  next(): IteratorResult<Pair<T, U>> {
    const iter1_result = this.iter1.next();
    const iter2_result = this.iter2.next();

    if (iter1_result.done || iter2_result.done) {
      return {
        done: true,
        value: undefined,
      };
    }

    const value: Pair<T, U> = [iter1_result.value, iter2_result.value];
    return {
      done: false,
      value: value,
    };
  }

  [Symbol.iterator]() {
    return this;
  }
}

for (const pair of zip3([1, 2, 3], [4, 5, 6])) {
  console.log(pair);
}
// END SOLUTION

