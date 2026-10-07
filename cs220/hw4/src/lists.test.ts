import assert from "assert";
import { List, node, empty, listToArray, arrayToList } from "../include/lists.js";
// listToArray and arrayToList are provided for your testing convenience only.
import {
  insertOrdered,
  everyNRev,
  everyNCond,
  keepTrendMiddles,
  keepLocalMaxima,
  keepLocalMinima,
  keepLocalMinimaAndMaxima,
  nonNegativeProducts,
  negativeProducts,
  deleteFirst,
  deleteLast,
  squashList,
} from "./lists.js";

describe("insertOrdered", () => {
  function insertOrderedTest(myList: List<number>, el: number, expected: number[]): void {
    const testInsert = insertOrdered(myList, el);
    const res = listToArray(testInsert);
    expect(res).toEqual(expected);
  }

  const myList = arrayToList([1, 2, 4, 5, 6]);
  const myReverseList = arrayToList([6, 5, 4, 2, 1]);

  it("General Test Case", () => {
    insertOrderedTest(myList, 3, [1, 2, 3, 4, 5, 6]);
  });

  it("Non-increasingly ordered list", () => {
    expect(() => insertOrdered(myReverseList, 3)).toThrow();
  });

  it("Insert at end", () => {
    insertOrderedTest(myList, 7, [1, 2, 4, 5, 6, 7]);
  });

  it("Insert at beginning", () => {
    insertOrderedTest(myList, 0, [0, 1, 2, 4, 5, 6]);
  });

  it("Insert existing number", () => {
    insertOrderedTest(myList, 2, [1, 2, 2, 4, 5, 6]);
  });

  it("Inserting a negative", () => {
    insertOrderedTest(myList, -1, [-1, 1, 2, 4, 5, 6]);
  });

  it("Empty List", () => {
    insertOrderedTest(empty<number>(), 3, [3]);
  });
});

describe("everyNRev", () => {
  const myList = arrayToList([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  it("General Test Case", () => {
    const testList = everyNRev(myList, 2);
    const res = listToArray(testList);
    expect(res).toEqual([8, 6, 4, 2]);
  });
  it("Negative value for `n`", () => {
    expect(() => everyNRev(myList, -2)).toThrow();
  });
  it("Empty List", () => {
    const sol = listToArray(everyNRev(empty<number>(), 2));
    expect(sol).toEqual([]);
  });
});

describe("everyNCond", () => {
  const myList = arrayToList([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const cond = (el: number) => (el % 4 === 0 ? true : false);
  it("General Test Case", () => {
    const testList = everyNCond(myList, 2, cond);
    const res = listToArray(testList);
    expect(res).toEqual([8]);
  });
  it("Negative value for `n`", () => {
    expect(() => everyNCond(myList, -2, cond)).toThrow();
  });
  it("Empty List", () => {
    const sol = listToArray(everyNCond(empty<number>(), 2, x => x > 0));
    expect(sol).toEqual([]);
  });
});

describe("keepTrendMiddles", () => {
  const myList = arrayToList([1, 2, 3, 4, 5, 6, 7]);
  const myCond = (prev: number, curr: number, next: number) => {
    if (prev && curr && next) return true;
    return false;
  };
  it("General Test Case", () => {
    const ktm = keepTrendMiddles(myList, myCond);
    const sol = listToArray(ktm);
    expect(sol).toEqual([2, 3, 4, 5, 6]);
  });

  it("Less than three elements", () => {
    const myList = arrayToList([1, 2]);
    const sol = listToArray(keepTrendMiddles(myList, () => true));
    expect(sol).toEqual([]);
  });

  it("Condition never satisfied", () => {
    const myList = arrayToList([1, 2, 3, 4, 5]);
    const sol = listToArray(keepTrendMiddles(myList, () => false));
    expect(sol).toEqual([]);
  });
});

describe("keepLocalMaxima", () => {
  it("General Test Case", () => {
    const myList = arrayToList([1, 2, 1]);
    const sol = listToArray(keepLocalMaxima(myList));
    expect(sol).toEqual([2]);
  });

  it("No local maxima", () => {
    const myList = arrayToList([1, 2, 3]);
    const sol = listToArray(keepLocalMaxima(myList));
    expect(sol).toEqual([]);
  });
});

describe("keepLocalMinima", () => {
  it("General Test Case", () => {
    const myList = arrayToList([3, 2, 3]);
    const sol = listToArray(keepLocalMinima(myList));
    expect(sol).toEqual([2]);
  });

  it("No local minima", () => {
    const myList = arrayToList([1, 2, 3]);
    const sol = listToArray(keepLocalMinima(myList));
    expect(sol).toEqual([]);
  });
});

describe("keepLocalMinimaAndMaxima", () => {
  it("General Test Case", () => {
    const myList = arrayToList([3, 2, 3, 2]);
    const sol = listToArray(keepLocalMinimaAndMaxima(myList));
    expect(sol).toEqual([2, 3]);
  });

  it("Neither local minimum nor maximum", () => {
    const myList = arrayToList([1, 2, 3]);
    const sol = listToArray(keepLocalMinimaAndMaxima(myList));
    expect(sol).toEqual([]);
  });
});

describe("nonNegativeProducts", () => {
  it("General Test Case", () => {
    const myList = arrayToList([2, 2, -3, 4, 2]);
    const sol = listToArray(nonNegativeProducts(myList));
    expect(sol).toEqual([2, 4, 4, 8]);
  });

  it("Empty List", () => {
    const sol = listToArray(nonNegativeProducts(empty<number>()));
    expect(sol).toEqual([]);
  });
});

describe("negativeProducts", () => {
  it("General Test Case", () => {
    const myList = arrayToList([-2, -2, 3, -4, -2]);
    const sol = listToArray(negativeProducts(myList));
    expect(sol).toEqual([-2, 4, -4, 8]);
  });

  it("Empty List", () => {
    const sol = listToArray(negativeProducts(empty<number>()));
    expect(sol).toEqual([]);
  });
});

describe("deleteFirst", () => {
  it("General Test Case", () => {
    const myList = arrayToList([1, 2, 4, 2, 2]);
    const sol = listToArray(deleteFirst(myList, 2));
    expect(sol).toEqual([1, 4, 2, 2]);
  });

  it("Element not found", () => {
    const myList = arrayToList([1, 2, 3]);
    const sol = listToArray(deleteFirst(myList, 99));
    expect(sol).toEqual([1, 2, 3]);
  });

  it("Empty List", () => {
    const sol = listToArray(deleteFirst(empty<number>(), 2));
    expect(sol).toEqual([]);
  });
});

describe("deleteLast", () => {
  it("General Test Case", () => {
    const myList = arrayToList([1, 2, 2, 4, 2]);
    const sol = listToArray(deleteLast(myList, 2));
    expect(sol).toEqual([1, 2, 2, 4]);
  });

  it("Element not found", () => {
    const myList = arrayToList([1, 2, 3]);
    const sol = listToArray(deleteLast(myList, 99));
    expect(sol).toEqual([1, 2, 3]);
  });

  it("Empty List", () => {
    const sol = listToArray(deleteLast(empty<number>(), 2));
    expect(sol).toEqual([]);
  });
});

describe("squashList", () => {
  it("General Test Case", () => {
    const myList: List<number | List<number>> = arrayToList([1, arrayToList([2, 3, 4]), 5, arrayToList([6, 7]), 8]);

    const sol = listToArray(squashList(myList));
    expect(sol).toEqual([1, 9, 5, 13, 8]);
  });
});
