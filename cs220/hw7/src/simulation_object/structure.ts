import type { Coordinate } from "../geometry.js";
import { SimulationObject } from "./simulation_object.js";

export function structureFactory(type: string, id: string, location: Coordinate): Structure {
  throw new Error("Not implemented yet");
}

export abstract class Structure extends SimulationObject {}
