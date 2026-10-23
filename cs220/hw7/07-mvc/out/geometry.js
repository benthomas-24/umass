export class Coordinate {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    almostEqual(other) {
        return this.distanceTo(other) < 0.01;
    }
    distanceTo(other) {
        return Math.sqrt(Math.pow(other.x - this.x, 2) + Math.pow(other.y - this.y, 2));
    }
}
export class Vector2D {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    static fromPoints(start, end) {
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
    scale(scaleBy) {
        return new Vector2D(this.x * scaleBy, this.y * scaleBy);
    }
}
export function linearInterpolate(from, to, speed) {
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
//# sourceMappingURL=geometry.js.map