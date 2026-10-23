import { structureFactory } from "./simulation_object/structure.js";
import { Coordinate } from "./geometry.js";
import { Model } from "./model.js";

describe("Starter test", () => {
  test("Minimal Model + House test", () => {
    const location = new Coordinate(42, 42);
    const house = structureFactory("house", "My House", new Coordinate(42, 42));
    expect(house.getLocation()).toEqual(location);

    Model.getInstance().addStructure(house);
  });
});
