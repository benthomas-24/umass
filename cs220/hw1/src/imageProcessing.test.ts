import assert from "assert";
import { COLORS, Image, Color } from "../include/image.js";
import { saturateGreen, flipColors, mapLine, imageMap, mapToGreen, mapFlipColors } from "./imageProcessing.js";

function createWhiteImage(): Image {
  return Image.create(10, 10, COLORS.WHITE);
}

function createRainbowImage(): Image {
  const img = createWhiteImage();
  const rainbow: Color[] = [
    COLORS.RED,
    COLORS.ORANGE,
    COLORS.YELLOW,
    COLORS.GREEN,
    COLORS.BLUE,
    COLORS.MAGENTA,
    COLORS.PINK,
  ];
  for (let x = 0; x < img.width; x++) {
    const color = rainbow[x % rainbow.length];
    for (let y = 0; y < img.height; y++) {
      img.setPixel(x, y, color);
    }
  }
  return img;
}

describe("saturateGreen", () => {
  it("should maximize green in the upper left corner", () => {
    const blackImage = Image.create(10, 15, COLORS.BLACK);
    const gbImage = saturateGreen(blackImage);
    const p = gbImage.getPixel(0, 0);

    expect(p).toEqual([0, 255, 0]);
  });

  it("should maximize green in the center", () => {
    const blackImage = Image.create(10, 15, COLORS.BLACK);
    const gbImage = saturateGreen(blackImage);
    const p = gbImage.getPixel(5, 7);

    assert(p[0] === 0, "The red channel should be 0.");
    assert(p[1] === 255, "The green channel should be 255.");
    assert(p[2] === 0, "The blue channel should be 0.");
  });
});

describe("flipColors", () => {
  it("should correctly flip top left corner", () => {
    const whiteImage = createWhiteImage();
    whiteImage.setPixel(0, 0, [100, 0, 150]);
    const flippedWhiteImage = flipColors(whiteImage);
    const p1 = flippedWhiteImage.getPixel(0, 0);
    expect(p1).toEqual([75, 125, 50]);

    const rainbowImage = createRainbowImage();
    const flippedRainbowImage = flipColors(rainbowImage);
    const p2 = flippedRainbowImage.getPixel(0, 0);
    expect(p2).toEqual([0, 127, 127]);
  });

  it("should correctly flip bottom right corner", () => {
    const rainbowImage = createRainbowImage();
    const flippedRainbowImage = flipColors(rainbowImage);
    const p2 = flippedRainbowImage.getPixel(9, 9);
    expect(p2).toEqual([127, 127, 255]);
  });
});

describe("mapLine", () => {
  it("changes pixels on row 5 to green and leaves all other rows unchanged.", () => {
    const whiteImage = createWhiteImage();
    mapLine(whiteImage, 5, () => COLORS.GREEN);
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        const actual = whiteImage.getPixel(x, y);
        const expected = y === 5 ? COLORS.GREEN : COLORS.WHITE;
        expect(actual).toEqual(expected);
      }
    }
  });

  it("changes pixels on row 2 to pink and leaves all other rows unchanged.", () => {
    const whiteImage = createWhiteImage();
    mapLine(whiteImage, 2, () => COLORS.PINK);
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        const actual = whiteImage.getPixel(x, y);
        const expected = y === 2 ? COLORS.PINK : COLORS.WHITE;
        expect(actual).toEqual(expected);
      }
    }
  });

  it("rejects a negative number", () => {
    const whiteImage = createWhiteImage();
    let wasCalled: boolean = false;
    const testFn = (): Color => {
      wasCalled = true;
      return COLORS.BLUE;
    };
    mapLine(whiteImage, -1, testFn);
    expect(wasCalled).toBe(false);
  });

  it("rejects a number in the upper bound limit", () => {
    const whiteImage = createWhiteImage();
    let wasCalled: boolean = false;
    const testFn = (): Color => {
      wasCalled = true;
      return COLORS.BLUE;
    };
    mapLine(whiteImage, whiteImage.height, testFn);
    expect(wasCalled).toBe(false);
  });
});

describe("imageMap", () => {
  it("applies the provided function to every pixel", () => {
    const og = Image.create(2, 2, COLORS.BLACK);
    og.setPixel(0, 0, [10, 20, 30]);
    og.setPixel(1, 0, [40, 50, 60]);
    og.setPixel(0, 1, [70, 80, 90]);
    og.setPixel(1, 1, [100, 110, 120]);
    const rotateChannels = (c: Color): Color => [c[1], c[2], c[0]];
    const mapped = imageMap(og, rotateChannels);

    expect(mapped.getPixel(0, 0)).toEqual([20, 30, 10]);
    expect(mapped.getPixel(1, 0)).toEqual([50, 60, 40]);
    expect(mapped.getPixel(0, 1)).toEqual([80, 90, 70]);
    expect(mapped.getPixel(1, 1)).toEqual([110, 120, 100]);
  });

  it("does not modify the og image", () => {
    const og = createWhiteImage();
    imageMap(og, () => COLORS.GREEN);
    for (let x = 0; x < og.width; x++) {
      for (let y = 0; y < og.height; y++) {
        expect(og.getPixel(x, y)).toEqual(COLORS.WHITE);
      }
    }
  });
});

describe("mapToGreen", () => {
  it("set every pixel has the green color channel set to is maximum value.", () => {
    const whiteImage = createWhiteImage();
    const greenImage1 = saturateGreen(whiteImage); //returns a copy of white image so the og image stays the same
    const greenImage2 = mapToGreen(whiteImage); // also will return a copy of white image so the og image stays the same

    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        const actual = greenImage1.getPixel(x, y);
        const expected = greenImage2.getPixel(x, y);

        expect(actual).toEqual(expected);
      }
    }
  });
});

describe("mapFlipColors", () => {
  it("takes an image as an argument and returns a new image, where each pixel has each Color channel set to the average of the other two channels in the og pixel.", () => {
    const rainbowImage = createRainbowImage();
    const flipImage1 = flipColors(rainbowImage);
    const flipImage2 = mapFlipColors(rainbowImage);
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        const actual = flipImage1.getPixel(x, y);
        const expected = flipImage2.getPixel(x, y);

        expect(actual).toEqual(expected);
      }
    }
  });
});
