import { node, empty, type List } from "./lists.js";

function list_to_string(list: List<number>): string {
  throw new Error('Not implemented yet');
}

// We use this line and allowUnreachableCode in tsconfig
// so that we can go through this one example at a time.
process.exit(0);  // Move this line down as you go through each example

console.log(list_to_string(node(42, node(43, empty()))));

// Returns the sum of all elements in list
function list_sum(list: List<number>): number {
  throw new Error('Not implemented yet');
}

console.log(list_sum(node(42, node(43, empty()))));

function list_filter(
  list: List<number>,
  pred: (num: number) => boolean,
): List<number> {
  throw new Error('Not implemented yet');
}

console.log(
  list_to_string(
    list_filter(node(1, node(2, node(3, empty()))), (num) => num % 2 === 0),
  ),
);

console.log(
  list_to_string(
    list_filter(node(1, node(2, node(3, empty()))), (num) => num % 2 !== 0),
  ),
);

console.log(
  list_to_string(
    list_filter(node(1, node(2, node(3, empty()))), (num) => true),
  ),
);

console.log(
  list_to_string(
    list_filter(node(1, node(2, node(3, empty()))), (num) => false),
  ),
);

function reverseWithLoop(list: List<number>): List<number> {
  throw new Error('Not implemented yet');
}

console.log(
  list_to_string(reverseWithLoop(node(1, node(2, node(3, empty()))))),
);

function reverse(list: List<number>): List<number> {
  throw new Error('Not implemented yet');
}

// "Tail recursion" is provably equivalent to a loop.
// Instead of declaring our "result" as a local variable,
// we write a helper function with an extra parameter to
// store the result in.
function reverseTailRecursive(
  list: List<number>,
  result: List<number>,
): List<number> {
  throw new Error('Not implemented yet');
}

console.log(list_to_string(reverse(node(1, node(2, node(3, empty()))))));

function reverseWithReduce(list: List<number>): List<number> {
  throw new Error('Not implemented yet');
}

console.log(
  list_to_string(reverseWithReduce(node(1, node(2, node(3, empty()))))),
);

function append(first: List<number>, second: List<number>): List<number> {
  throw new Error('Not implemented yet');
}

console.log(
  list_to_string(
    append(
      node(1, node(2, node(3, empty()))),
      node(4, node(5, node(6, empty()))),
    ),
  ),
);

// Exercise: Write pseudocode for timesPreviousLoop below.

// Returns a new List where each element of the new list is equal
// to that element of the original list times the element before it.
// The first element is not multiplied by anything.
// If the input list is empty, returns an empty list.
// For example, passing in (2 (3 (4))) returns (2 (6 (12 ())))
function timesPreviousLoop(list: List<number>): List<number> {
  throw new Error('Not implemented yet');
}

console.log(
  list_to_string(timesPreviousLoop(node(2, node(3, node(4, empty()))))),
);

function timesPreviousReduce(list: List<number>): List<number> {
  throw new Error('Not implemented yet');
}

console.log(
  list_to_string(timesPreviousReduce(node(2, node(3, node(4, empty()))))),
);
