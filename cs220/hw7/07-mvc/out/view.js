export class View {
}
export class MainSimulationView {
    canvas;
    // Map of object id to drawable object
    // Keep this map up to date when this view recieves updates
    // from the model.
    drawableObjects = new Map();
    constructor(canvas) {
        this.canvas = canvas;
    }
    // The draw method is provided for you.
    // It draws each drawable object on the canvas.
    // DO NOT MODIFY.
    draw() {
        for (const drawable of this.drawableObjects.values()) {
            this.canvas.getContext("2d")?.drawImage(drawable.getSpriteImage(), 
            // Use integer pixels for efficiency.
            // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#avoid_floating-point_coordinates_and_use_integers_instead
            Math.floor(drawable.location.x), Math.floor(drawable.location.y), Math.floor(drawable.getSpriteImage().width * drawable.getSprite().scale), Math.floor(drawable.getSpriteImage().height * drawable.getSprite().scale));
        }
    }
}
// Stores information needed to draw a simulation object.
class DrawableSimulationObject {
    id;
    location;
    sprite;
    loadedImage;
    constructor(id, location, sprite) {
        this.id = id;
        this.location = location;
        this.sprite = sprite;
        this.loadedImage = document.getElementById(sprite.imageID);
    }
    getSprite() {
        return this.sprite;
    }
    getSpriteImage() {
        return this.loadedImage;
    }
}
//# sourceMappingURL=view.js.map