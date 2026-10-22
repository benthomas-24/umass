// Array method signatures
//
// Array<T>.filter(f: (e: T) => boolean): T[]
// Array<T>.map<R>(f: (e: T) => R): R[]
// Array<T>.reduce<R>(f: (acc: R, e: T) => R, init: R): R
// Array<T>.forEach(f: (e: T) => any): void
// Array<T>.every(f: (e: T) => boolean): boolean
// Array<T>.some(f: (e: T) => boolean): boolean

class Flower {
  constructor(public readonly color: string, public readonly height: number) {}
}

// Returns an array indicating, for each flower in "queryFlowers", how many
// flowers in "allFlowers" are the same color as and taller than that flower.
function countSameColorTallerThan(queryFlowers: Flower[], allFlowers: Flower[]) {
  // BEGIN SOLUTION
  return queryFlowers.map((q) => {
    return allFlowers.filter((f) => f.color === q.color && f.height > q.height).length;
  });
  // END SOLUTION
}

const garden = [
  new Flower("blue", 3),
  new Flower("red", 2),
  new Flower("red", 4),
];
console.log(countSameColorTallerThan([new Flower("blue", 3), new Flower("red", 1)], garden));
console.log(countSameColorTallerThan([new Flower("blue", 2), new Flower("red", 3)], garden));

// ------------------------------------------------------------------------------------------------

// For each line below, indicate the types deduced for the generic type parameters
// of each HOF call. Also state the overall type of each the expression. If there is an error, say "error".
// Uncomment the individual lines and mouseover the various parts to reveal the deduced types.

// let a = [1, 2, 3].every((x) => x < 42);

// let b = [1, 2, 3].filter((x) => x < 42);

// let c = ["spam", "egg"].map((x) => x.length).filter((x2) => x2.length === 3);

// let d = [[1, 2], [3]].filter((x) => x.length === 2).map((x) => x[0] + x[1]);

// let e = [[1, 2], [3]].filter(
//   (x) => {
//     return x.some((x2) => x2.length < 2)
//   }
// );
