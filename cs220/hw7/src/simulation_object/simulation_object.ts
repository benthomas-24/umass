import { Coordinate } from "../geometry.js";
import { Sprite } from "../sprite.js";

export abstract class SimulationObject {
  protected abstract imageID: string;
  protected abstract scale: number;
  protected abstract sprite: Sprite;

  constructor(public readonly id: string) {}

  abstract getLocation(): Coordinate;

  nextTick(): void {}

  createSprite() {
    return new Sprite(this.imageID, this.scale);
  }
}
