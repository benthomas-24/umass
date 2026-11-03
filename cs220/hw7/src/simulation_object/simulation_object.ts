import { Coordinate } from "../geometry.js";

export abstract class SimulationObject {
  constructor(public readonly id: string) {}

  abstract getLocation(): Coordinate;

  nextTick(): void {}
}
