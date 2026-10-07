import assert from "assert";
import { Color, COLORS, Image } from "../include/image.js";
import {
  imageMapCoord,
  imageMapIf,
  mapWindow,
  isGrayish,
  makeGrayish,
  pixelBlur,
  imageBlur,
  within,
  mean,
} from "./imageProcessingHOF.js";
import { createRainbowImage, createWhiteImage, createBlackImage } from "./helpers.js";

// Helper function to check if a color is equal to another one with an error of 1 (default)
function expectColorToBeCloseTo(actual: Color, expected: Color, error = 1) {
  [0, 1, 2].forEach(i => expect(Math.abs(actual[i] - expected[i])).toBeLessThanOrEqual(error));
}

describe("imageMapCoord", () => {
  function identity(img: Image, x: number, y: number) {
    return img.getPixel(x, y);
  }

  it("should return a different image", () => {
    const input = Image.create(10, 10, COLORS.WHITE);
    const output = imageMapCoord(input, identity);
    assert(input !== output);
  });

  it("ensuring that the original image is the same", () => {
    const og: Image = createRainbowImage();
    const newImg: Image = imageMapCoord(og, (img, x: number, y: number) => {
      identity(img, x, y);
      return COLORS.GREEN;
    });
    expect(og.pixels()).not.toEqual(newImg.pixels());
  });
});

describe("imageMapIf", () => {
  it("cond is always true", () => {
    const og: Image = createBlackImage();
    const newImg: Image = imageMapIf(
      og,
      () => true,
      () => COLORS.PINK
    );
    for (let x = 0; x < newImg.width; x++) {
      for (let y = 0; y < newImg.height; y++) {
        expect(newImg.getPixel(x, y)).toEqual(COLORS.PINK);
      }
    }
  });

  it("cond is always false", () => {
    const og: Image = createBlackImage();
    const newImg: Image = imageMapIf(
      og,
      () => false,
      () => COLORS.PINK
    );
    for (let x = 0; x < newImg.width; x++) {
      for (let y = 0; y < newImg.height; y++) {
        expect(newImg.getPixel(x, y)).toEqual(COLORS.BLACK);
      }
    }
  });

  it("cond is true for some pixels and false for others", () => {
    const og: Image = createBlackImage();
    const newImg: Image = imageMapIf(
      og,
      (_img: Image, x: number) => x < 5,
      () => COLORS.PINK
    );
    for (let x = 0; x < newImg.width; x++) {
      for (let y = 0; y < newImg.height; y++) {
        expect(newImg.getPixel(x, y)).toEqual(x < 5 ? COLORS.PINK : COLORS.BLACK);
      }
    }
  });
});

describe("mapWindow", () => {
  function maxGreen(c: Color) {
    return [c[0], 255, c[2]];
  }

  it("Test if xInterval.length != 2", () => {
    const og: Image = createRainbowImage();
    expect(() => mapWindow(og, [2], [24, 36], maxGreen)).toThrow();
  });
  it("Test if yInterval.length != 2", () => {
    const og: Image = createRainbowImage();
    expect(() => mapWindow(og, [0, 9], [0, 9, 10], maxGreen)).toThrow();
  });
  it("Test if x_min > x_max", () => {
    const og: Image = createRainbowImage();
    expect(() => mapWindow(og, [2, 1], [24, 36], maxGreen)).toThrow();
  });
  it("Test if y_min > y_max", () => {
    const og: Image = createRainbowImage();
    expect(() => mapWindow(og, [0, 9], [24, 12], maxGreen)).toThrow();
  });
  it("Testing making a rainbow image have a black center", () => {
    const og: Image = createRainbowImage(100, 100, undefined);
    const newImg: Image = mapWindow(og, [30, 70], [30, 70], () => COLORS.BLACK);
    expect(newImg.getPixel(0, 0)).toEqual(og.getPixel(0, 0));
    expect(newImg.getPixel(50, 50)).not.toEqual(og.getPixel(50, 50));
  });
});

describe("isGrayish", () => {
  it("fully black color", () => {
    const blackImg: Image = createBlackImage();
    expect(isGrayish(blackImg.getPixel(0, 0))).toEqual(true);
  });

  it("fully white image", () => {
    const whiteImg: Image = createWhiteImage();
    expect(isGrayish(whiteImg.getPixel(0, 0))).toEqual(true);
  });

  it("rainbow image", () => {
    const rainbowImg = createRainbowImage();
    for (let x = 0; x < rainbowImg.width; x++) {
      for (let y = 0; y < rainbowImg.height; y++) {
        expect(isGrayish(rainbowImg.getPixel(x, y))).toEqual(false);
      }
    }
  });

  it("rainbow pixel image", () => {
    const rainbowPixelImg = createRainbowImage(undefined, undefined, true);
    for (let x = 0; x < rainbowPixelImg.width; x++) {
      for (let y = 0; y < rainbowPixelImg.height; y++) {
        expect(isGrayish(rainbowPixelImg.getPixel(x, y))).toEqual(false);
      }
    }
  });
});

describe("mean", () => {
  it("mean of 5 integers", () => {
    expect(mean([1, 2, 3, 4, 5])).toEqual(3);
  });

  it("mean with an expected decimal", () => {
    expect(mean([0.24, 0.75, 0.32, 0.91, 0.12])).toBeCloseTo(0);
  });

  it("mean with negative numbers", () => {
    expect(mean([-1, -2, -3, -4, -5])).toEqual(-3);
  });
});

describe("within", () => {
  it("General test case", () => {
    expect(within(1, 10, 5, true, true)).toEqual(true);
  });
  it("General test case (non-inclusive)", () => {
    expect(within(1, 10, 5, false, false)).toEqual(true);
  });
  it("When min > max", () => {
    expect(() => within(5, 1, 3, undefined, undefined)).toThrow();
  });

  it("Non-inclusive min", () => {
    expect(within(1, 10, 1, false, true)).toEqual(false);
  });

  it("Non-inclusive max", () => {
    expect(within(1, 10, 10, true, false)).toEqual(false);
  });

  it("Both non-inclusive", () => {
    expect(within(1, 10, 1, false, false)).toEqual(false);
  });

  it("Inclusive min only", () => {
    expect(within(1, 10, 5, true, false)).toEqual(true);
  });

  it("Inclusive max only", () => {
    expect(within(1, 10, 5, false, true)).toEqual(true);
  });
});

describe("makeGrayish", () => {
  it("General Test Case", () => {
    const redImg = Image.create(10, 10, COLORS.RED);
    const greyishImg = makeGrayish(redImg);
    for (let x = 0; x < greyishImg.width; x++) {
      for (let y = 0; y < greyishImg.height; y++) {
        expect(greyishImg.getPixel(x, y)).toEqual([85, 85, 85]);
      }
    }
  });
  it("Testing with different color pixels", () => {
    const rainbowPixelImg = createRainbowImage(undefined, undefined, true);
    const greyishImg = makeGrayish(rainbowPixelImg);
    expect(greyishImg.getPixel(5, 5)).toEqual([85, 85, 85]);
    expect(greyishImg.getPixel(4, 4)).toEqual([140, 140, 140]);
  });
});

describe("pixelBlur", () => {
  it("General Test Case", () => {
    const rainbowPixelImg = createRainbowImage(undefined, undefined, true);
    const blurredColor = pixelBlur(rainbowPixelImg, 5, 5);
    expectColorToBeCloseTo(blurredColor, [113, 154, 90], undefined);
  });

  it("Given a corner", () => {
    const rainbowPixelImg = createRainbowImage(undefined, undefined, true);
    const blurredColor = pixelBlur(rainbowPixelImg, 9, 9);
    expectColorToBeCloseTo(blurredColor, [63, 191, 63], undefined);
  });
});

describe("imageBlur", () => {
  it("General Test Case", () => {
    const rainbowPixelImg = createRainbowImage(undefined, undefined, true);
    const blurredImg = imageBlur(rainbowPixelImg);
    expectColorToBeCloseTo(blurredImg.getPixel(5, 5), [113, 154, 90]);
  });
});
