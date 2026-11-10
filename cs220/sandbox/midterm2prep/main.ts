import assert from "node:assert/strict";

export function mystery(nums: number[]): number[] {
  const result: number[] = [];

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] % 2 === 0) {
      result.push(nums[i] * 2);
    }
  }
  assert(result.length === nums.filter((e: number) => e % 2 === 0).length); // result can't be longer than the original
  assert(
    nums
      .filter((e: number) => e % 2 === 0)
      .every((num: number, index: number) => result[index] === num * 2),
  ); // check if order is preserved and that each number that should be in the result is in the result

  return result;
}

const items = ["spam", "egg", "sausage", "spam"];
// Note use of "in" instead of "of"
for (const item in items) {
  console.log(item);
}
for (const item of items) {
  console.log(item);
}
