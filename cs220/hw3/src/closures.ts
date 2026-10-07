import { GenericFunction } from "../include/types.js";

export function composeFunctions<T>(funs: GenericFunction<T>[]): (x: T) => T[] {
  return (v: T) => {
    let curr: T = v;
    const sol: T[] = [v];
    for (let i = 0; i < funs.length; i++) {
      curr = funs[i](curr);
      sol.push(curr);
    }
    return sol;
  };
}

export function cyclic<T>(values: T[]): () => T {
  if (values.length === 0) throw new Error("Please pass an array with values");
  let count = 0;
  return () => {
    if (count === values.length) {
      count = 0;
    }
    const sol = values[count];
    count = count + 1;
    return sol;
  };
}

export function rateLimiter<T, R>(func: (x: T, y: T) => R, limit: number): (x: T, y: T) => R | undefined {
  if (limit < 0) {
    throw new Error("Please make `limit` a non-negative integer");
  }
  let lim = limit;
  return (x, y) => {
    lim--;
    if (lim >= 0) {
      return func(x, y);
    }
    return undefined;
  };
}

export function byParity(evenFunc: (n: number) => number, oddFunc: (n: number) => number): (n: number) => number {
  return (n: number) => {
    if (n % 2 === 0) {
      return evenFunc(n);
    }
    return oddFunc(n);
  };
}

export function vendingMachine(price: number, stock: number): (amount: number) => number | undefined {
  if (price < 0) {
    throw new Error("Please enter a positive value for `price`");
  }
  if (stock < 0) {
    throw new Error("Please enter a positive value for `stock`");
  }
  return (amount: number) => {
    if (amount < price || stock < 1) {
      return undefined;
    }
    stock -= 1;
    return amount - price;
  };
}

export function wageChange(
  calcNew: (yr: number, prevWage: number) => number
): (startWage: number, startYr: number, endYr: number) => number {
  return (startWage: number, startYr: number, endYr: number) => {
    if (startYr < 1970 || endYr > 2026 || startYr > endYr || startWage <= 0) {
      return NaN;
    }
    let prev: number = startWage;
    for (let i = startYr + 1; i <= endYr; i++) {
      prev = calcNew(i, prev);
    }
    if (prev <= 0) return NaN;
    return prev;
  };
}

export function factorial(x: number): number {
  if (x === 0 || x === 1) return 1;
  if (x < 0) throw new Error("Please pass a number >= 0");
  let prod = 1;
  for (let i = x; i > 0; i--) {
    prod *= i;
  }
  return prod;
}
export function sineSeries(x: number): (moreTerms?: number) => number {
  const term = (k: number) => {
    return ((-1) ** k * x ** (2 * k + 1)) / factorial(2 * k + 1);
  };
  let lastTerm = 0;
  let total = 0;
  return (moreTerms = 1) => {
    let curr = 0;
    for (let k = lastTerm; k < lastTerm + moreTerms; k++) {
      curr += term(k);
    }
    total += curr;
    lastTerm = lastTerm + moreTerms;
    return total;
  };
}
