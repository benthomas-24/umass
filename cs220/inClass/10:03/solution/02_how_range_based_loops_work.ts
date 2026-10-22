function main() {
  const items = ["spam", "egg", "sausage", "spam"];

  for (const item of items) {
    console.log(item);
  }
}

// How do range-based for loops actually work?
// What makes it so that an object can be traversed this way?

// BEGIN SOLUTION
// A range-based for-loop is translated to something like the
// following pseudocode:
//
// give me an iterator
// give me the next element
// while the iterator is not done
//   advance the iterator
//   give me the next element
// END SOLUTION

main();
