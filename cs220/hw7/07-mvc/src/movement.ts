import { Coordinate, Vector2D } from "./geometry.js";

export class Movement {
  // How fast the entity is moving and in what direction
  private velocity: Vector2D = new Vector2D(0, 0);

  constructor(private location: Coordinate) {}

  getLocation() {
    return this.location;
  }

  setLocation(newLocation: Coordinate) {
    this.location = newLocation;
  }

  getVelocity() {
    return this.velocity;
  }

  setVelocity(velocity: Vector2D) {
    this.velocity = velocity;
  }

  getSpeed() {
    return this.velocity.magnitude();
  }

  // Sets the entity's velocity to move in the direction
  // of the destination at the given speed.
  setVelocityTowards(destination: Coordinate, speed: number) {
    this.setVelocity(Vector2D.fromPoints(this.getLocation(), destination).normalize().scale(speed));
  }

  isMoving() {
    return this.velocity.magnitude() !== 0;
  }

  // Updates the entity's location after one time unit
  // moving at its current velocity.
  updateLocation() {
    this.location = new Coordinate(this.location.x + this.velocity.x, this.location.y + this.velocity.y);
  }
}
