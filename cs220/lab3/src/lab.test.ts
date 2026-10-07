import { factorialSum } from "./lab.js";

describe("factorialSum", () => {
  it("should return correct results", () => {
    const f = factorialSum();
    let factorial = 1;
    let approx = 0;
    for (let i = 1; i < 20; i++) {
      factorial *= i;
      approx += factorial;
      expect(f()).toBe(approx);
    }
  });

  it("should be able to create multiple distinct closures", () => {
    const a1 = factorialSum();
    const a2 = factorialSum();
    a2();
    expect(a1()).toBe(1);
    expect(a2()).toBe(3);
  });
});
