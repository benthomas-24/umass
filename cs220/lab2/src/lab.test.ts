import { rotateRight } from "./lab.js";
describe("", () => {
  it("Must not change original array", () => {
    const og: number[] = [1, 2, 3, 4];
    expect(rotateRight(og, 2)).not.toEqual(og);
  });

  it("Throw an error given a negative input", () => {
    const og: number[] = [1, 2, 3, 4];
    expect(() => rotateRight(og, -2)).toThrowError();
  });
});
