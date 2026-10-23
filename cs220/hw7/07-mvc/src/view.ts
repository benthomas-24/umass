import { assert } from "./assert.js";
import type { Coordinate } from "./geometry.js";
import type { Sprite } from "./sprite.js";

export abstract class View {
  // Do not alter or remove this declaration.
  abstract draw(): void;
}

export class MainSimulationView {
  // Map of object id to drawable object
  // Keep this map up to date when this view recieves updates
  // from the model.
  private drawableObjects = new Map<string, DrawableSimulationObject>();

  constructor(private canvas: HTMLCanvasElement) {}

  // The draw method is provided for you.
  // It draws each drawable object on the canvas.
  // DO NOT MODIFY.
  override draw() {
    for (const drawable of this.drawableObjects.values()) {
      this.canvas.getContext("2d")?.drawImage(
        drawable.getSpriteImage(),
        // Use integer pixels for efficiency.
        // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#avoid_floating-point_coordinates_and_use_integers_instead
        Math.floor(drawable.location.x),
        Math.floor(drawable.location.y),
        Math.floor(drawable.getSpriteImage().width * drawable.getSprite().scale),
        Math.floor(drawable.getSpriteImage().height * drawable.getSprite().scale)
      );
    }
  }
}

// Stores information needed to draw a simulation object.
class DrawableSimulationObject {
  private loadedImage: HTMLImageElement;

  constructor(public readonly id: string, public location: Coordinate, private sprite: Sprite) {
    this.loadedImage = document.getElementById(sprite.imageID) as HTMLImageElement;
  }

  getSprite() {
    return this.sprite;
  }
  getSpriteImage() {
    return this.loadedImage;
  }
}
