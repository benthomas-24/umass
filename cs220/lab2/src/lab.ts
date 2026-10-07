// Exercise 1: Type Signatures

/*
Part (a): Fill in the type signatures for f and g.
  
const a = [1,2,3,4];
const b = a.filter(f);
const c = b.map(g);

f(x: number): boolean
g<T>(x: number): T
*/

/*
Part (b): Initialize a, f, and g such that h runs without errors.
The input and output types of f should be different from each other.
You may uncomment the code to test your implementation.
*/

// const a = ["Aaron", "Billy", "Christopher"]];
// const f = (s: string): number => s.length;
// const g = (n: number): boolean => n > 5;

// const h = (a, f, g) => a.map(f).filter(g);
// h(a, f, g) == [11];

// Exercise 2: Testing with Jest

// Write comprehensive tests for rotateRight using Jest (in lab.test.ts).

export function rotateRight<T>(arr: T[], k: number): T[] {
  if (!Number.isInteger(k) || k < 0) {
    throw new Error("k must be a non-negative integer");
  }

  const n = arr.length;
  if (n === 0) return [];

  k = k % n;

  if (k === 0) return arr.slice();

  return arr.slice(-k).concat(arr.slice(0, n - k));
}
