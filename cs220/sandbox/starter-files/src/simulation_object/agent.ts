import { Coordinate } from "../geometry.js";
import { SimulationObject } from "./simulation_object.js";

export function agentFactory(type: string, id: string, initialLocation: Coordinate): Agent {
  throw new Error("Not implemented yet");
}

export abstract class Agent extends SimulationObject {
  // TASK: Decide whether startMoving should be abstract or not.
  abstract startMoving(destination: Coordinate, speed: number): void;
}
