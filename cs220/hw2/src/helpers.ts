import { COLORS, Image, Color } from "../include/image.js";

export function createWhiteImage(width = 10, height = 10): Image {
  return Image.create(width, height, COLORS.WHITE);
}

export function createBlackImage(): Image {
  return Image.create(10, 10, COLORS.BLACK);
}

export function createRainbowImage(width = 10, height = 10, alternatePixel = false): Image {
  const img = createWhiteImage(width, height);
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
    for (let y = 0; y < img.height; y++) {
      const index = alternatePixel ? (x + y) % rainbow.length : x % rainbow.length;
      img.setPixel(x, y, rainbow[index]);
    }
  }
  return img;
}
