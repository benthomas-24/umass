// Implement the function make_color_schedule below.
// It returns a closure that, each time called,
// returns the next color in the sequence specified by
// the colors and num_days_per_color arrays.
//
// For example:
//
// const s = make_color_schedule(["red", "blue", "green"], [1, 3, 2]);
// for (let i = 0; i < 10; ++i) {
//   console.log(s());
// }
//
// Prints: red blue blue blue green green red blue blue blue
//
// Assume that the length of colors and num_days_per_color are the same
// and that neither are empty.
// Assume that the values in num_days_per_color are > 0.
// (For a more challenging variation, try removing the first assumption).
function make_color_schedule(colors: string[], num_days_per_color: number[]) {
  if(colors.length != num_days_per_color.length) {throw new Error("Please ensure colors[] and num_days_per_color[] are of same length")}
  let i = 0;
  let j = 0
  let count = 1;
  return () =>{
    if(i === colors.length) i = 0;
    if (count === num_days_per_color[j]) j++;
    i++;
    return colors[i-1]
  }
}

const s = make_color_schedule(["red", "blue", "green"], [1, 3, 2]);
for (let i = 0; i < 10; ++i) {
  console.log(s());
}

// ----------------------------------------------------------------------------

// Implement a function replaceNull that takes in a function "func" and wraps it.
// When the wrapped function is called, the value the original function
// would return is returned unless that value is null, in which case
// a fallback value is returned.

// SKELETON: Add types to the function signature below.
function replaceNull<T, U>(func, fallback) {
