import { nonNegatives2D, longWords2D } from "./lab.js";

describe("nonNegatives2D", () => {
  it("Filters a 2D array correctly", () => {
    const input = [[0], [1, -2, 3, 4], [-1, -4, -7], [1, 2, 3, 4]];
    const expected_output = [[0], [1, 3, 4], [], [1, 2, 3, 4]];
    const output = nonNegatives2D(input);
    expect(output).toStrictEqual(expected_output);
  });
});

describe("longWords2D", () => {
  it("Filters a 2D array of strings correctly", () => {
    const input = [
      ["Hello,", "world", "!"],
      ["foo", "bar", "baz"],
    ];
    const expected_output = [["Hello,", "world"]];
    const output = longWords2D(input);
    expect(output).toStrictEqual(expected_output);
  });
});
