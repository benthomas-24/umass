import {
  factorial,
  composeFunctions,
  cyclic,
  rateLimiter,
  byParity,
  vendingMachine,
  wageChange,
  sineSeries,
} from "./closures";
import type { GenericFunction } from "../include/types.js";
const intFuncs: ((x: number) => number)[] = [
  (x: number) => (x += 1),
  (x: number) => (x += 8),
  (x: number) => (x -= 2),
  (x: number) => (x *= 2),
];

describe("factorial", () => {
  it("General Test Case", () => {
    expect(factorial(3)).toEqual(6);
  });
  it("0", () => {
    expect(factorial(0)).toEqual(1);
  });
  it("Negative number", () => {
    expect(() => factorial(-2)).toThrow();
  });
});
describe("composeFunctions", () => {
  it("Test with functions on ints", () => {
    const newFunc = composeFunctions(intFuncs);
    expect(newFunc(4)).toEqual([4, 5, 13, 11, 22]);
  });
  it("Empty arr", () => {
    const newFunc = composeFunctions([]);
    expect(newFunc(4)).toEqual([4]);
  });
});

describe("cyclic", () => {
  it("General Test Case", () => {
    const intArray: number[] = [1, 2, 3, 4, 5, 6];
    const func = cyclic(intArray);
    for (let i = 0; i < 50; i++) {
      const curr = func();
      expect(curr).toEqual(intArray[i % 6]);
    }
  });
  it("empty array", () => {
    const emptyArray: never[] = [];
    expect(() => cyclic(emptyArray)).toThrow();
  });
});

describe("rateLimiter", () => {
  const addNumToString: (x: number, y: number) => string = (x: number, y: number) => (x + y).toString();
  it("General Test Case", () => {
    const func = rateLimiter(addNumToString, 3);
    expect(func(2, 3)).toEqual("5");
    expect(func(6, 2)).toEqual("8");
    expect(func(6, 13)).toEqual("19");
    expect(func(7, 6)).not.toBeDefined();
  });
  it("Negative limit", () => {
    expect(() => rateLimiter(addNumToString, -2)).toThrow();
  });
  it("limit is 0", () => {
    const func = rateLimiter(addNumToString, 0);
    expect(func(2, 3)).not.toBeDefined();
  });
});

describe("byParity", () => {
  const evenFunc = (x: number) => x ** 2;
  const oddFunc = (x: number) => x ** (1 / 2);
  const func = byParity(evenFunc, oddFunc);
  it("General Test Case", () => {
    expect(func(2)).toEqual(4);
    expect(func(9)).toEqual(3);
  });

  it("Negative Number", () => {
    expect(func(-2)).toEqual(4);
  });
});

describe("vendingMachine", () => {
  const doritos = vendingMachine(1.5, 3);
  it("General Test Case", () => {
    expect(doritos(3)).toEqual(1.5);
    expect(doritos(1.5)).toEqual(0);
    expect(doritos(5)).toEqual(3.5);
    expect(doritos(19)).not.toBeDefined();
  });
  it("negative price", () => {
    expect(() => vendingMachine(-2, 5)).toThrow();
  });
  it("negative stock", () => {
    expect(() => vendingMachine(5, -2)).toThrow();
  });
  it("failed purchase", () => {
    expect(doritos(1)).not.toBeDefined();
  });
});

describe("wageChange", () => {
  const calcNewBasic = (_yr: number, prevWage: number) => prevWage + 1500;
  const calcNewAdv = (yr: number, prevWage: number) => {
    if (yr < 2022) {
      return prevWage + 10000;
    }
    return prevWage + prevWage * 0.6;
  };
  const invalidCalc = (_yr: number, _prevWage: number) => -1900;
  const wcFuncBasic = wageChange(calcNewBasic);
  const wcFuncAdv = wageChange(calcNewAdv);
  const wcInvalid = wageChange(invalidCalc);
  it("General Test Case", () => {
    expect(wcFuncBasic(100000, 2020, 2023)).toEqual(104500);
  });
  it("out of range start year", () => {
    expect(wcFuncBasic(100000, 1919, 2019)).toEqual(NaN);
  });
  it("out of range end year", () => {
    expect(wcFuncBasic(100000, 2019, 2119)).toEqual(NaN);
  });
  it("startYr > endYr", () => {
    expect(wcFuncBasic(100000, 1954, 1919)).toEqual(NaN);
  });
  it("invalid wage", () => {
    expect(wcFuncBasic(-100000, 2020, 2023)).toEqual(NaN);
  });
  it("wage is 0", () => {
    expect(wcFuncBasic(0, 2020, 2023)).toEqual(NaN);
  });
  it("change in year", () => {
    expect(wcFuncAdv(100000, 2020, 2024)).toEqual(450560);
  });
  it("invalidly computed wage", () => {
    expect(wcInvalid(100000, 2020, 2023)).toEqual(NaN);
  });
});

describe("sineSeries", () => {
  it("General test case", () => {
    const sinOfOne = sineSeries(1);
    expect(sinOfOne()).toEqual(1);
    expect(sinOfOne()).toEqual(5 / 6);
    expect(sinOfOne()).toEqual(101 / 120);
    expect(sinOfOne()).toEqual(4241 / 5040);
  });
  it("negative test case", () => {
    const sinOfNegativeOne = sineSeries(-1);
    expect(sinOfNegativeOne()).toEqual(-1);
    expect(sinOfNegativeOne()).toEqual(-5 / 6);
    expect(sinOfNegativeOne()).toEqual(-101 / 120);
    expect(sinOfNegativeOne()).toEqual(-4241 / 5040);
  });
  it("moreTerms > 1", () => {
    const a = sineSeries(1);
    const b = sineSeries(1);
    a();
    a();
    const using_a = a();
    const using_b = b(3);
    expect(using_a).toEqual(using_b);
  });
  it("maintains state after moreTerms > 1", () => {
    const a = sineSeries(1);
    const b = sineSeries(1);
    a();
    a();
    a();
    b(3);
    expect(a()).toEqual(b());
  });
});
