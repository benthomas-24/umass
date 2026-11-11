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
  private destination?: Coordinate;
  private speed?: number;

  constructor(id: string, initialLocation: Coordinate) {
    super(id);
    this.currLocation = initialLocation;
  }

  override nextTick(): void {
    if (this.destination === undefined || this.speed === undefined) {
      return;
    }

    const result = linearInterpolate(this.currLocation, this.destination, this.speed);
    this.currLocation = result.newLocation;

    if (result.reachedDestination) {
      this.onReachDestination();
    }
  }

  protected abstract onReachDestination(): void;

  startMoving(destination: Coordinate, speed: number): void {
    this.destination = destination;
    this.speed = speed;
  }

  override getLocation(): Coordinate {
    return this.currLocation;
  }
}

class SimpleLobster extends Agent {
  imageID: string = "lobsterRegular";
  scale: number = 0.4;
  sprite = this.createSprite();
  protected override onReachDestination(): void {
    console.log("Simple lobster arrived.");
  }
}

class SleepyLobster extends Agent {
  imageID = "lobsterRegular";
  scale = 0.4;
  private asleep = false;
  sprite = this.createSprite();

  protected override onReachDestination(): void {
    this.asleep = true;
    this.imageID = "lobsterSleeping";
    this.scale = 0.25;
  }
}
