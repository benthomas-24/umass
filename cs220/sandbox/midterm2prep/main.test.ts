import { mystery } from "./main.js";

describe("mystery property tests", () => {
  it("satisfies its contract for 100 random arrays", () => {
    for (let i = 0; i < 100; i++) {
      const nums = Array.from({ length: 10 }, () =>
        Math.floor(Math.random() * 100),
      ); // 1. Generate a random array of integers.

      const res = mystery(nums); // 2. Call mystery() with that array.
      const evenNums = nums.filter((e: number) => e % 2 === 0);
      expect(res.length).toEqual(evenNums.length); // 3. Assert the length property.

      for(let i = 0; i < evenNums.length; i++){
        expect(res[i]).toEqual(evenNums[i] * 2);
      } // 4. Assert the value and ordering property.
    }
  });
});
