import type { Coordinate } from "../geometry.js";
import { SimulationObject } from "./simulation_object.js";
import { Sprite } from "../sprite.js";

export function structureFactory(type: string, id: string, location: Coordinate): Structure {
  if (type != "house") throw new Error("unsupported structure type: " + type);
  return new House(id, location);
}

export abstract class Structure extends SimulationObject {
  constructor(id: string, protected location: Coordinate) {
    super(id);
    this.location = location;
  }
}

class House extends Structure {
  override getLocation(): Coordinate {
    return this.location;
  }
  imageID = "simpleHouse";
  scale = 1.0;
  sprite = this.createSprite();
}
