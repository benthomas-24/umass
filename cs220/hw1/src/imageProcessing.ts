import type { Color, Image } from "../include/image.js";

/**
 * Saturates green color in each pixel of an image
 * @param img An image
 * @returns A new image where each pixel has the green channel set to its maximum.
 */
export function saturateGreen(img: Image): Image {
  const returnImage = img.copy();
  for (let x = 0; x < img.width; x++) {
    //for every row
    for (let y = 0; y < img.height; y++) {
      // for every column
      const curr = returnImage.getPixel(x, y);
      returnImage.setPixel(x, y, [curr[0], 255, curr[2]]);
    }
  }
  return returnImage; //keep
}

/**
 * Flips the colors of an image
 * @param img An image
 * @returns A new image where each pixel's channel has been
 *  set as the truncated average of the other two
 */
export function flipColors(img: Image): Image {
  const returnImage = img.copy();
  for (let x = 0; x < img.width; x++) {
    //for every row
    for (let y = 0; y < img.height; y++) {
      // for every column
      const curr = returnImage.getPixel(x, y);
      returnImage.setPixel(x, y, [
        Math.floor((curr[1] + curr[2]) / 2),
        Math.floor((curr[0] + curr[2]) / 2),
        Math.floor((curr[0] + curr[1]) / 2),
      ]);
    }
  }
  return returnImage;
}

/**
 * Modifies the given `img` such that the value of each pixel
 * in the given line is the result of applying `func` to the
 * corresponding pixel of `img`. If `lineNo` is not a valid line
 * number, then `img` should not be modified.
 * @param img An image
 * @param lineNo A line number
 * @param func A color transformation function
 */
export function mapLine(img: Image, lineNo: number, func: (c: Color) => Color): void {
  if (lineNo < 0 || lineNo >= img.height) {
    return;
  }
  for (let x = 0; x < img.width; x++) {
    img.setPixel(x, lineNo, func(img.getPixel(x, lineNo)));
  }
  return;
}

/**
 * The result must be a new image with the same dimensions as `img`.
 * The value of each pixel in the new image should be the result of
 * applying `func` to the corresponding pixel of `img`.
 * @param img An image
 * @param func A color transformation function
 */
export function imageMap(img: Image, func: (c: Color) => Color): Image {
  const returnImage = img.copy();
  for (let x = 0; x < img.width; x++) {
    for (let y = 0; y < img.height; y++) {
      returnImage.setPixel(x, y, func(img.getPixel(x, y)));
    }
  }
  return returnImage;
}

/**
 * Saturates green color in an image
 * @param img An image
 * @returns A new image where each pixel has the green channel has been set to its maximum.
 */
export function mapToGreen(img: Image): Image {
  return imageMap(img, (c: Color): Color => [c[0], 255, c[2]]);
}

/**
 * Flips the colors of an image
 * @param img An image
 * @returns A new image where each pixels channel has been
 *  set as the truncated average of the other two
 */
export function mapFlipColors(img: Image): Image {
  return imageMap(
    img,
    (c: Color): Color => [Math.floor((c[1] + c[2]) / 2), Math.floor((c[0] + c[2]) / 2), Math.floor((c[0] + c[1]) / 2)]
  );
}
