import type { Image, Color } from "../include/image.js";

export function imageMapCoord(img: Image, func: (img: Image, x: number, y: number) => Color): Image {
  const newImg = img.copy();
  for (let x = 0; x < img.width; x++) {
    for (let y = 0; y < img.height; y++) {
      newImg.setPixel(x, y, func(img, x, y));
    }
  }
  return newImg;
}

export function imageMapIf(
  img: Image,
  cond: (img: Image, x: number, y: number) => boolean,
  func: (p: Color) => Color
): Image {
  return imageMapCoord(img, (img: Image, x: number, y: number) => {
    const curr: Color = img.getPixel(x, y);
    if (cond(img, x, y)) {
      return func(curr);
    }
    return curr;
  });
}

export function mapWindow(
  img: Image,
  xInterval: number[], // Assumed to be a two element array containing [x_min, x_max]
  yInterval: number[], // Assumed to be a two element array containing [y_min, y_max]
  func: (p: Color) => Color
): Image {
  if (xInterval.length != 2 || xInterval[0] > xInterval[1]) {
    throw console.error("Please pass a proper interval of the form [x_min, x_max]");
  }
  if (yInterval.length != 2 || yInterval[0] > yInterval[1]) {
    throw console.error("Please pass a proper interval of the form [y_min, y_max]");
  }
  return imageMapIf(
    img,
    (img: Image, x: number, y: number) => {
      const x1 = within(xInterval[0], xInterval[1], x);
      const y1 = within(yInterval[0], yInterval[1], y);
      if (x1 && y1) {
        return true;
      }
      return false;
    },
    func
  );
}

export function isGrayish(p: Color): boolean {
  const max = Math.max(...p);
  const min = Math.min(...p);
  return within(0, 85, max - min);
}

export function makeGrayish(img: Image): Image {
  return imageMapIf(
    img,
    (img: Image, x: number, y: number) => !isGrayish(img.getPixel(x, y)),
    (c: Color) => new Array<number>(3).fill(mean(c))
  );
}

export function pixelBlur(img: Image, x: number, y: number): Color {
  const neighbors: number[][] = [[], [], []];
  for (let i = x - 1; i < x + 2; i++) {
    for (let j = y - 1; j < y + 2; j++) {
      if (j < 0 || j >= img.height || i < 0 || i >= img.width) {
        continue;
      }
      const curr = img.getPixel(i, j);
      neighbors[0].push(curr[0]);
      neighbors[1].push(curr[1]);
      neighbors[2].push(curr[2]);
    }
  }
  const blur: Color = [mean(neighbors[0]), mean(neighbors[1]), mean(neighbors[2])];
  return blur;
}

export function imageBlur(img: Image): Image {
  return imageMapCoord(img, pixelBlur);
}

export function within(min: number, max: number, numPassed: number, minInclusive = true, maxInclusive = true): boolean {
  /**
   * Checks whether a number falls within an interval (inclusive).
   * @param min - Lower bound of the interval.
   * @param max - Upper bound of the interval.
   * @param numPassed - The number to test.
   * @param minInclusive - if the min should be included
   * @param maxInclusive - if the max should be included
   * @returns `true` if `min < || <= n < || <= max`, otherwise `false`.
   */
  if (min > max) {
    throw console.error("Please pass a proper min and max such that min < max.");
  }
  if (minInclusive && maxInclusive) {
    if (numPassed >= min && numPassed <= max) {
      return true;
    }
    return false;
  }
  if (minInclusive) {
    if (numPassed >= min && numPassed < max) {
      return true;
    }
    return false;
  }
  if (maxInclusive) {
    if (numPassed > min && numPassed <= max) {
      return true;
    }
    return false;
  }
  if (numPassed > min && numPassed < max) {
    return true;
  }
  return false;
}

export function mean(c: number[]): number {
  return Math.trunc(c.reduce((answer, num) => answer + num, 0) / c.length);
}
