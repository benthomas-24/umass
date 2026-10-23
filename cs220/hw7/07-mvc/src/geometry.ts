export class Coordinate {
  constructor(public readonly x: number, public readonly y: number) {}

  almostEqual(other: Coordinate) {
    return this.distanceTo(other) < 0.01;
  }

  distanceTo(other: Coordinate) {
    return Math.sqrt(Math.pow(other.x - this.x, 2) + Math.pow(other.y - this.y, 2));
  }
}

export class Vector2D {
  constructor(public readonly x: number, public readonly y: number) {}

  static fromPoints(start: Coordinate, end: Coordinate) {
    return new Vector2D(end.x - start.x, end.y - start.y);
  }

  static zero() {
    return new Vector2D(0, 0);
  }

  magnitude() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  normalize() {
    const magnitude = this.magnitude();
    return new Vector2D(this.x / magnitude, this.y / magnitude);
  }

  scale(scaleBy: number) {
    return new Vector2D(this.x * scaleBy, this.y * scaleBy);
  }
}

export function linearInterpolate(from: Coordinate, to: Coordinate, speed: number) {
  const distanceToMove = from.distanceTo(to);
  if (distanceToMove <= speed) {
    return {
      reachedDestination: true,
      newLocation: to,
    };
  }
  const time = speed / distanceToMove;
  return {
    reachedDestination: false,
    newLocation: new Coordinate(from.x + (to.x - from.x) * time, from.y + (to.y - from.y) * time),
  };
}
