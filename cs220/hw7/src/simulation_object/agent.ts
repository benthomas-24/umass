import { Coordinate, linearInterpolate } from "../geometry.js";
import { Sprite } from "../sprite.js";
import { SimulationObject } from "./simulation_object.js";

export function agentFactory(type: string, id: string, initialLocation: Coordinate): Agent {
  if (type == "simple_lobster") {
    return new SimpleLobster(id, initialLocation);
  }
  throw new Error("unsupported agent type: " + type);
}

export abstract class Agent extends SimulationObject {
  private currLocation: Coordinate;
  private newLocation = { reachedDestination: false, newLocation: new Coordinate(0, 0) };
  private destination?: Coordinate;
  private speed?: number;
  constructor(id: string, private initial_location: Coordinate) {
    super(id);
    this.initial_location = initial_location;
    this.currLocation = this.initial_location;
  }
  override nextTick(): void {
    if (this.destination === undefined || this.speed === undefined) return;
    this.newLocation = linearInterpolate(this.currLocation, this.destination, this.speed);
    this.currLocation = this.newLocation.newLocation;
  }
  /**
   * Sets this agent's velocity to move towards the
   * specified destination at the given speed.
   */
  startMoving(destination: Coordinate, speed: number): void {
    this.destination = destination;
    this.speed = speed;
  }
  override getLocation(): Coordinate {
    return this.currLocation;
  }
}

class SimpleLobster extends Agent {
  imageID = "lobsterRegular";
  scale = 0.4;
  sprite = new Sprite(this.imageID, this.scale);
}

class SleepyLobster extends Agent {
  imageID = "lobsterRegular";
  scale = 0.4;
}
