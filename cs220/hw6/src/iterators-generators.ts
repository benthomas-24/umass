import type { Business } from "../include/data";

export function* pairwise<T>(iterable: Iterable<T>): Generator<[T, T]> {
  const iter = iterable[Symbol.iterator]();
  let curr = iter.next(); //The first call to iter.next() returns the first value of the iterable, not the *actual* next value.
  if (curr.done) return [];
  let next = iter.next();
  if (next.done) return [];
  while (!next.done) {
    const res: [T, T] = [curr.value, next.value];
    curr = next;
    next = iter.next();
    yield res;
  }
}

export function* cycle<T>(iterables: Iterable<T>[]): Generator<T> {
  const iterators = iterables.map(x => x[Symbol.iterator]());
  let active = iterators.length;
  while (active !== 0) {
    for (let i = 0; i < iterators.length; i++) {
      const curr = iterators[i].next();
      if (curr.done) {
        iterators.splice(i, 1);
        active--;
        i--;
      } else {
        yield curr.value;
      }
    }
  }
}

type FilterFunc = (business: Business) => boolean;

// Declare the BusinessQuery class here.
// Start the declaration with "export class" so that
// it can be imported from other modules.

export class BusinessQuery implements Iterable<Business> {
  constructor(private readonly businesses: Iterable<Business>) {
    this.businesses = businesses;
  }

  *[Symbol.iterator](): Generator<Business> {
    for (const business of this.businesses) {
      yield business;
    }
  }

  filter(func: FilterFunc): BusinessQuery {
    const businesses = this.businesses;
    return new BusinessQuery({
      *[Symbol.iterator]() {
        for (const business of businesses) {
          if (func(business)) {
            yield business;
          }
        }
      },
    });
  }

  exclude(func: FilterFunc): BusinessQuery {
    return this.filter(business => !func(business));
  }

  slice(start: number, end?: number): BusinessQuery {
    if (!Number.isInteger(start) || (end !== undefined && !Number.isInteger(end))) {
      throw new SliceError("slice: start and end must be integers");
    }
    if (start < 0 || (end !== undefined && end < 0)) {
      throw new SliceError("slice: start and end must be non-negative");
    }
    if (end !== undefined && start > end) {
      throw new SliceError("slice: start must not be greater than end");
    }
    const businesses = this.businesses;
    function* sliced(): Generator<Business> {
      let index = 0;
      for (const business of source) {
        if (end !== undefined && index >= end) {
          break;
        }
        if (index >= start) {
          yield business;
        }
        index++;
      }
    }

    return new BusinessQuery(sliced());
  }
}

export class SliceError extends Error {}
