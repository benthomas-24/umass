import type { Business } from "../include/data";

export function* pairwise<T>(iterable: Iterable<T>): Generator<[T, T]> {
  const iter = iterable[Symbol.iterator]();
  let curr = iter.next(); //The first call to iter.next() returns the first value of the iterable, not the *actual* next value.  
  if(curr.done) return [];
  let next = iter.next(); 
  if(next.done) return [];
  while(!next.done){
    const res:[T,T] = [curr.value, next.value];
    curr = next;
    next = iter.next();
    yield res;
  }
}

export function* cycle<T>(iterables: Iterable<T>[]): Generator<T> {
  throw new Error('Not implemented');
}

type FilterFunc = (business: Business) => boolean;

// Declare the BusinessQuery class here.
// Start the declaration with "export class" so that
// it can be imported from other modules.
export class BusinessQuery {}

export class SliceError extends Error {}
