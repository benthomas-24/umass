/**
 * The internal immutable list interface, with higher-order functions.
 */
interface _List<T> {
  head: () => T;
  tail: () => List<T>;
  isEmpty: () => boolean;
  toString: () => string;
  map: <U>(f: (elem: T) => U) => List<U>;
  reduce: <U>(f: (acc: U, elem: T) => U, init: U) => U;
}

/**
 * The exposed (exported) list interface.
 */
export type List<T> = Readonly<_List<T>>;
// Readonly<T> will compose a type that has all fields of T, but is readonly.
// Attempting to write (do an assignment) to any field will produce a compile-time error.

/**
 * The list node constructor
 * @param data The data of the list node
 * @param next The proceeding node in the list
 * @returns A new list node
 */
export function node<T>(data: T, next: List<T>): List<T> {
  return {
    head: () => data,
    tail: () => next,
    isEmpty: () => false,
    toString: () => `node(${data}, ${next.toString()})`,
    map: f => node(f(data), next.map(f)),
    reduce: (f, init) => next.reduce(f, f(init, data)),
  };
}

/**
 * The empty list node constructor
 * @returns An empty list node
 */
export function empty<T>(): List<T> {
  return {
    head: () => {
      throw new Error();
    },
    tail: () => {
      throw new Error();
    },
    isEmpty: () => true,
    toString: () => "empty",
    map: () => empty(),
    reduce: (_, init) => init,
  };
}

/**
 * Returns a new list in reverse order
 * @param lst A list
 * @returns A new list that is the reversal of `lst`
 */
export function reverseList<T>(lst: List<T>): List<T> {
  return lst.reduce((acc, e) => node(e, acc), empty());
}
