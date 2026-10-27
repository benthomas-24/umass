// A "sprite" is an image used to display an
// object or character on the screen.
// We represent these as the filename of the image and
// a number from [0-1] specifying the scale of the image
// (i.e., whether it should be displayed smaller than
// the actual image size).
export class Sprite {
    imageID;
    scale;
    constructor(
    // As a workaround to avoid having to use async/await,
    // we pre-load our images with html image tags.
    // Specify the ID of the image tag as the imageID
    // of the sprite.
    imageID, scale = 1) {
        this.imageID = imageID;
        this.scale = scale;
    }
}
//# sourceMappingURL=sprite.js.map