import { List, node, empty, reverseList } from "../include/lists.js";

export function insertOrdered(lst: List<number>, el: number): List<number> {
  if (lst.isEmpty()) {
    return node(el, empty());
  }
  if (!lst.tail().isEmpty() && lst.head() > lst.tail().head()) {
    throw new Error("List is supposed to be increasingly ordered. Please try again with an increasingly ordered list");
  }
  if (el <= lst.head()) {
    return node(el, lst);
  }
  return node(lst.head(), insertOrdered(lst.tail(), el));
}

export function everyNRev<T>(lst: List<T>, n: number): List<T> {
  if (n < 0) throw new Error("Please pass a number >= 0 for `n`");
  let cursor = 1;
  return lst.reduce((acc, el) => {
    if (cursor === n) {
      cursor = 1;
      return node(el, acc);
    } else {
      cursor++;
      return acc;
    }
  }, empty());
}

export function everyNCond<T>(lst: List<T>, n: number, cond: (e: T) => boolean): List<T> {
  if (n <= 0) throw new Error("Please pass a positive integer for `n`");
  let cursor = 1;
  const sol = lst.filter(cond).reduce((acc, el) => {
    if (cursor === n) {
      cursor = 1;
      return node(el, acc);
    }
    cursor++;
    return acc;
  }, empty<T>());
  return reverseList(sol);
}

export function atLeastThree<T>(lst: List<T>): boolean {
  try {
    lst.tail().tail().head();
  } catch (err) {
    return false;
  }
  return true;
}
export function traverseLst<T>(lst: List<T>, cond: (prev: T, curr: T, next: T) => boolean): List<T> {
  if (!atLeastThree(lst)) {
    return empty<T>();
  }
  let curr = lst.tail();
  let prev: List<T> = lst;
  let next: List<T> = curr.tail();
  let sol = empty<T>();
  while (!curr.tail().isEmpty()) {
    if (cond(prev.head(), curr.head(), next.head())) sol = node(curr.head(), sol);
    prev = curr;
    curr = next;
    next = curr.tail();
  }
  return reverseList(sol);
}

export function keepTrendMiddles(
  lst: List<number>,
  allSatisfy: (prev: number, curr: number, next: number) => boolean
): List<number> {
  return traverseLst(lst, allSatisfy);
}

export function keepLocalMaxima(lst: List<number>): List<number> {
  return traverseLst(lst, (prev: number, curr: number, next: number) => {
    if (prev < curr && curr > next) {
      return true;
    } else {
      return false;
    }
  });
}

export function keepLocalMinima(lst: List<number>): List<number> {
  return traverseLst(lst, (prev: number, curr: number, next: number) => {
    if (prev > curr && curr < next) {
      return true;
    } else {
      return false;
    }
  });
}

export function keepLocalMinimaAndMaxima(lst: List<number>): List<number> {
  return traverseLst(lst, (prev: number, curr: number, next: number) => {
    if (prev < curr && curr > next) {
      return true;
    }
    if (prev > curr && curr < next) {
      return true;
    } else {
      return false;
    }
  });
}

export const isPositive = (x: number): boolean => Math.abs(x) === x;
export const isNegative = (x: number): boolean => Math.abs(x) !== x;
export const products = (lst: List<number>, cond: (x: number) => boolean) => {
  if (lst.isEmpty()) return empty<number>();

  let sol: List<number> = empty<number>();
  let prod = 1;

  let curr = lst;

  while (!curr.isEmpty()) {
    if (cond(curr.head())) {
      const newProd = curr.head() * prod;
      sol = node(newProd, sol);
      prod = newProd;
    } else prod = 1;
    curr = curr.tail();
  }
  return reverseList(sol);
};
export function nonNegativeProducts(lst: List<number>): List<number> {
  return products(lst, isPositive);
}

export function negativeProducts(lst: List<number>): List<number> {
  return products(lst, isNegative);
}

export function deleteFirst<T>(lst: List<T>, el: T): List<T> {
  if (lst.isEmpty()) return empty<T>();
  if (lst.head() === el) return lst.tail();
  else return node(lst.head(), deleteFirst(lst.tail(), el));
}

export function deleteLast<T>(lst: List<T>, el: T): List<T> {
  if (lst.isEmpty()) return lst;
  const oldTail = lst.tail();
  const newTail = deleteLast(oldTail, el);
  if (newTail !== oldTail) return node(lst.head(), newTail);
  if (lst.head() === el) return oldTail;
  return lst;
}

export function squashList(lst: List<number | List<number>>): List<number> {
  if (lst.isEmpty()) return empty<number>();
  const head = lst.head();
  const tail = squashList(lst.tail());
  if (typeof head === "number") return node(head, tail);
  return node(
    head.reduce((acc, el) => acc + el, 0),
    tail
  );
}
