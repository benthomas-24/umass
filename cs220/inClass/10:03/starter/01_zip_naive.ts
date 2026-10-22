// 1. zip_naive, implemented below, takes in 2 arrays and returns an array of pairs
// of elements from each array.

type Pair<T, U> = readonly [T, U];

export function zip_naive<T, U>(array1: T[], array2: U[]): Pair<T, U>[] {
  const result: Pair<T, U>[] = [];
  for (let i = 0; i < array1.length && i < array2.length; i += 1) {
    result.push([array1[i], array2[i]]);
  }
  return result;
}

console.log(zip_naive([1, 2, 3], [4, 5, 6]));
console.log(zip_naive([1, 2, 3], [4, 5]));

// 2. Uncomment the code below and rerun in a memory-limited container (bash 01_zip_naive_demo.sh > output.txt)
// Requires Docker: https://docs.docker.com/engine/install/

// const spams = Array(5 * Math.pow(10, 6)).fill("spam");
// console.log(spams.length);
// const eggs = Array(5 * Math.pow(10, 6)).fill("egg");
// console.log(eggs.length);
// for (const pair of zip_naive(spams, eggs)) {
//     console.log(pair[0], pair[1]);
// }

// console.log("Finished successfully");
