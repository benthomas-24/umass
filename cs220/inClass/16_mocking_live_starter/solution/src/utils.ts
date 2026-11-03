export function* zip<T, U>(a: Iterable<T>, b: Iterable<U>): Generator<[T, U]> {
  let iter1 = a[Symbol.iterator]();
  let iter2 = b[Symbol.iterator]();

  let res1 = iter1.next();
  let res2 = iter2.next();

  while (!res1.done && !res2.done) {
    yield [res1.value, res2.value];
    res1 = iter1.next();
    res2 = iter2.next();
  }
}

export function* repeat<T>(value: T, n: number) {
  while (n > 0) {
    yield value;
    n--;
  }
}

export function findIf<T>(iterable: Iterable<T>, pred: (val: T) => boolean): T | undefined {
  for (const item of iterable) {
    if (pred(item)) {
      return item;
    }
  }
  return undefined;
}
