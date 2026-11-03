import { afterEach, beforeEach, describe, expect, jest, test } from "@jest/globals";
import type { Coordinate as CoordinateType } from "./geometry.js";
import type { Agent as AgentType } from "./simulation_object/agent.js";
import type { Model as ModelType } from "./model.js";

let Coordinate: typeof import("./geometry.js").Coordinate;
let Model: typeof import("./model.js").Model;
let Agent: typeof import("./simulation_object/agent.js").Agent;
let Structure: typeof import("./simulation_object/structure.js").Structure;
let SimulationObject: typeof import("./simulation_object/simulation_object.js").SimulationObject;
let agentFactory: typeof import("./simulation_object/agent.js").agentFactory;
let structureFactory: typeof import("./simulation_object/structure.js").structureFactory;
let MainSimulationView: typeof import("./view.js").MainSimulationView;

beforeEach(async () => {
  // Reload all related modules together so each test gets a fresh singleton.
  // This avoids depending on private field names or working remove methods.
  jest.resetModules();

  ({ Coordinate } = await import("./geometry.js"));
  ({ Model } = await import("./model.js"));
  ({ SimulationObject } = await import("./simulation_object/simulation_object.js"));
  ({ Agent, agentFactory } = await import("./simulation_object/agent.js"));
  ({ Structure, structureFactory } = await import("./simulation_object/structure.js"));
  ({ MainSimulationView } = await import("./view.js"));

  document.body.replaceChildren();
});

afterEach(() => {
  jest.restoreAllMocks();
  document.body.replaceChildren();
});

function expectPosition(object: { getLocation(): CoordinateType }, x: number, y: number): void {
  const location = object.getLocation();
  expect(Number.isFinite(location.x)).toBe(true);
  expect(Number.isFinite(location.y)).toBe(true);
  expect(location.x).toBeCloseTo(x, 8);
  expect(location.y).toBeCloseTo(y, 8);
}

function tick(object: { nextTick(): void }, count: number): void {
  for (let i = 0; i < count; i++) {
    object.nextTick();
  }
}

function simple(id = "simple", x = 0, y = 0): AgentType {
  return agentFactory("simple_lobster", id, new Coordinate(x, y));
}

function house(id = "house", x = 0, y = 0) {
  return structureFactory("house", id, new Coordinate(x, y));
}

function createViewHarness() {
  function addImage(id: string): HTMLImageElement {
    const image = document.createElement("img");
    image.id = id;
    image.width = 101;
    image.height = 79;
    // No src: keep tests independent of image loading and network access.
    document.body.appendChild(image);
    return image;
  }

  const images = {
    regular: addImage("lobsterRegular"),
    sleeping: addImage("lobsterSleeping"),
    house: addImage("simpleHouse"),
  };

  const canvas = document.createElement("canvas");
  const drawImage = jest.fn<CanvasRenderingContext2D["drawImage"]>();

  // draw() only uses drawImage. No native canvas implementation is needed.
  const context = { drawImage } as unknown as CanvasRenderingContext2D;
  jest.spyOn(canvas, "getContext").mockReturnValue(context);

  const view = new MainSimulationView(canvas);

  function render() {
    drawImage.mockClear();
    view.draw();
    return drawImage.mock.calls;
  }

  return { view, images, render };
}

function expectedDraw(image: HTMLImageElement, x: number, y: number, scale: number) {
  return [image, Math.floor(x), Math.floor(y), Math.floor(image.width * scale), Math.floor(image.height * scale)];
}

describe("Model singleton", () => {
  test("getInstance creates a Model without throwing", () => {
    expect(() => Model.getInstance()).not.toThrow();
    expect(Model.getInstance()).toBeInstanceOf(Model);
  });

  test("repeated calls return exactly the same object", () => {
    const first = Model.getInstance();
    expect(Model.getInstance()).toBe(first);
    expect(Model.getInstance()).toBe(first);
  });

  test("state is shared through repeated getInstance calls", () => {
    const building = house("shared");
    Model.getInstance().addStructure(building);
    expect(Model.getInstance().getStructure("shared")).toBe(building);
  });

  test("an empty model can advance repeatedly", () => {
    expect(() => tick(Model.getInstance(), 3)).not.toThrow();
  });
});

describe("Model agents", () => {
  let model: ModelType;

  beforeEach(() => {
    model = Model.getInstance();
  });

  test("adds and returns the same agent instance", () => {
    const agent = simple("a", 12, -8);
    model.addAgent(agent);

    expect(model.getAgent("a")).toBe(agent);
    expectPosition(model.getAgent("a"), 12, -8);
  });

  test("keeps multiple agents independently accessible", () => {
    const first = simple("first");
    const second = agentFactory("sleepy_lobster", "second", new Coordinate(8, 9));
    model.addAgent(first);
    model.addAgent(second);

    expect(model.getAgent("first")).toBe(first);
    expect(model.getAgent("second")).toBe(second);
  });

  test("rejects another agent with the same ID without replacing the original", () => {
    const original = simple("duplicate");
    const replacement = simple("duplicate", 99, 99);
    model.addAgent(original);

    expect(() => model.addAgent(replacement)).toThrow(new Error('Agent "duplicate" already exists'));
    expect(model.getAgent("duplicate")).toBe(original);
  });

  test("rejects adding the same instance twice", () => {
    const agent = simple("duplicate");
    model.addAgent(agent);

    expect(() => model.addAgent(agent)).toThrow(new Error('Agent "duplicate" already exists'));
  });

  test("getting an unknown ID throws the documented error", () => {
    expect(() => model.getAgent("missing")).toThrow(new Error('Agent "missing" not found'));
  });

  test("removing an unknown ID throws the documented error", () => {
    expect(() => model.removeAgent("missing")).toThrow(new Error('Couldn\'t remove agent "missing": Not found'));
  });

  test("removes only the requested agent", () => {
    const first = simple("first");
    const second = simple("second");
    model.addAgent(first);
    model.addAgent(second);

    model.removeAgent("first");

    expect(() => model.getAgent("first")).toThrow(new Error('Agent "first" not found'));
    expect(model.getAgent("second")).toBe(second);
  });

  test("removing an agent twice throws on the second removal", () => {
    model.addAgent(simple("a"));
    model.removeAgent("a");

    expect(() => model.removeAgent("a")).toThrow(new Error('Couldn\'t remove agent "a": Not found'));
  });

  test("an ID can be reused after removal", () => {
    model.addAgent(simple("reused"));
    model.removeAgent("reused");

    const replacement = simple("reused", 9, 12);
    model.addAgent(replacement);
    expect(model.getAgent("reused")).toBe(replacement);
  });

  test.each(["__proto__", "constructor", "toString"])(
    "handles the string ID %s without inherited-property collisions",
    id => {
      const agent = simple(id);
      model.addAgent(agent);
      expect(model.getAgent(id)).toBe(agent);
      model.removeAgent(id);
      expect(() => model.getAgent(id)).toThrow(new Error(`Agent "${id}" not found`));
    }
  );
});

describe("Model structures", () => {
  let model: ModelType;

  beforeEach(() => {
    model = Model.getInstance();
  });

  test("adds and returns the same structure instance", () => {
    const building = house("home", 42, -7);
    model.addStructure(building);

    expect(model.getStructure("home")).toBe(building);
    expectPosition(model.getStructure("home"), 42, -7);
  });

  test("rejects duplicate IDs without replacing the original structure", () => {
    const original = house("duplicate");
    model.addStructure(original);

    expect(() => model.addStructure(house("duplicate", 9, 9))).toThrow(
      new Error('Structure "duplicate" already exists')
    );
    expect(model.getStructure("duplicate")).toBe(original);
  });

  test("rejects adding the same structure twice", () => {
    const building = house("duplicate");
    model.addStructure(building);

    expect(() => model.addStructure(building)).toThrow(new Error('Structure "duplicate" already exists'));
  });

  test("getting an unknown structure uses the exact documented message", () => {
    // The source contract deliberately has no quotes around this ID.
    expect(() => model.getStructure("missing")).toThrow(new Error("Structure missing not found"));
  });

  test("removing an unknown structure throws the documented error", () => {
    expect(() => model.removeStructure("missing")).toThrow(
      new Error('Couldn\'t remove structure "missing": Not found')
    );
  });

  test("removes only the requested structure", () => {
    const first = house("first");
    const second = house("second");
    model.addStructure(first);
    model.addStructure(second);

    model.removeStructure("first");

    expect(() => model.getStructure("first")).toThrow(new Error("Structure first not found"));
    expect(model.getStructure("second")).toBe(second);
  });

  test("removing a structure twice throws on the second removal", () => {
    model.addStructure(house("a"));
    model.removeStructure("a");

    expect(() => model.removeStructure("a")).toThrow(new Error('Couldn\'t remove structure "a": Not found'));
  });

  test("a structure ID can be reused after removal", () => {
    model.addStructure(house("reused"));
    model.removeStructure("reused");

    const replacement = house("reused", 10, 20);
    model.addStructure(replacement);
    expect(model.getStructure("reused")).toBe(replacement);
  });

  test.each(["__proto__", "constructor", "toString"])("handles the structure ID %s", id => {
    const building = house(id);
    model.addStructure(building);
    expect(model.getStructure(id)).toBe(building);
    model.removeStructure(id);
    expect(() => model.getStructure(id)).toThrow(new Error(`Structure ${id} not found`));
  });
});

describe("Model tick dispatch", () => {
  test("calls nextTick exactly once on every registered object per tick", () => {
    const model = Model.getInstance();
    const first = simple("first");
    const second = agentFactory("sleepy_lobster", "second", new Coordinate(0, 0));
    const building = house();

    model.addAgent(first);
    model.addAgent(second);
    model.addStructure(building);

    const firstTick = jest.spyOn(first, "nextTick");
    const secondTick = jest.spyOn(second, "nextTick");
    const houseTick = jest.spyOn(building, "nextTick");

    tick(model, 3);

    expect(firstTick).toHaveBeenCalledTimes(3);
    expect(secondTick).toHaveBeenCalledTimes(3);
    expect(houseTick).toHaveBeenCalledTimes(3);
  });

  test("does not tick removed objects", () => {
    const model = Model.getInstance();
    const agent = simple();
    const building = house();
    model.addAgent(agent);
    model.addStructure(building);

    const agentTick = jest.spyOn(agent, "nextTick");
    const houseTick = jest.spyOn(building, "nextTick");

    model.removeAgent(agent.id);
    model.removeStructure(building.id);
    tick(model, 3);

    expect(agentTick).not.toHaveBeenCalled();
    expect(houseTick).not.toHaveBeenCalled();
  });

  test("advances moving agents independently while houses stay stationary", () => {
    const model = Model.getInstance();
    const first = simple("first");
    const second = agentFactory("sleepy_lobster", "second", new Coordinate(10, 10));
    const building = house("home", -5, 8);

    model.addAgent(first);
    model.addAgent(second);
    model.addStructure(building);
    first.startMoving(new Coordinate(20, 0), 2);
    second.startMoving(new Coordinate(10, 30), 3);

    tick(model, 2);

    expectPosition(first, 4, 0);
    expectPosition(second, 10, 16);
    expectPosition(building, -5, 8);
  });
});

describe.each(["simple_lobster", "sleepy_lobster"])("%s movement", type => {
  function create(x = 0, y = 0) {
    return agentFactory(type, "lobster", new Coordinate(x, y));
  }

  test("creates an Agent and SimulationObject with the requested ID", () => {
    const agent = create();
    expect(agent).toBeInstanceOf(Agent);
    expect(agent).toBeInstanceOf(SimulationObject);
    expect(agent.id).toBe("lobster");
  });

  test("preserves negative and fractional initial coordinates", () => {
    expectPosition(create(-12.5, 8.75), -12.5, 8.75);
  });

  test("stays at its initial location before receiving a movement command", () => {
    const agent = create(6, -4);
    tick(agent, 5);
    expectPosition(agent, 6, -4);
  });

  test("startMoving sets up motion without immediately changing position", () => {
    const agent = create(2, 3);
    agent.startMoving(new Coordinate(12, 3), 2);
    expectPosition(agent, 2, 3);
  });

  test("moves the specified distance on each tick", () => {
    const agent = create();
    agent.startMoving(new Coordinate(10, 0), 2);

    for (let step = 1; step <= 4; step++) {
      agent.nextTick();
      expectPosition(agent, step * 2, 0);
    }
  });

  test("moves vertically without changing x", () => {
    const agent = create(7, 9);
    agent.startMoving(new Coordinate(7, -9), 3);

    tick(agent, 2);
    expectPosition(agent, 7, 3);
  });

  test("normalizes diagonal movement so speed is total distance per tick", () => {
    const agent = create();
    agent.startMoving(new Coordinate(6, 8), 2);

    agent.nextTick();
    expectPosition(agent, 1.2, 1.6);

    agent.nextTick();
    expectPosition(agent, 2.4, 3.2);
  });

  test("moves diagonally toward negative coordinates", () => {
    const agent = create(3, 4);
    agent.startMoving(new Coordinate(-3, -4), 2.5);

    agent.nextTick();
    expectPosition(agent, 1.5, 2);
  });

  test("arrives exactly when distance equals speed", () => {
    const agent = create();
    agent.startMoving(new Coordinate(3, 4), 5);

    agent.nextTick();
    expectPosition(agent, 3, 4);
    tick(agent, 3);
    expectPosition(agent, 3, 4);
  });

  test("clamps the final partial step instead of overshooting", () => {
    const agent = create();
    agent.startMoving(new Coordinate(5, 0), 2);

    tick(agent, 2);
    expectPosition(agent, 4, 0);
    agent.nextTick();
    expectPosition(agent, 5, 0);
    tick(agent, 4);
    expectPosition(agent, 5, 0);
  });

  test("reaches a destination closer than one full step", () => {
    const agent = create(-1, -1);
    agent.startMoving(new Coordinate(2, 3), 100);

    agent.nextTick();
    expectPosition(agent, 2, 3);
  });

  test("supports fractional speeds and destinations", () => {
    const agent = create(0.25, -0.5);
    agent.startMoving(new Coordinate(1, -0.5), 0.25);

    agent.nextTick();
    expectPosition(agent, 0.5, -0.5);
    tick(agent, 2);
    expectPosition(agent, 1, -0.5);
  });

  test("a destination equal to the current position never produces NaN", () => {
    const agent = create(4, -2);
    agent.startMoving(new Coordinate(4, -2), 3);

    tick(agent, 3);
    expectPosition(agent, 4, -2);
  });

  test("separate agents do not share movement state", () => {
    const moving = create();
    const stationary = agentFactory(type, "other", new Coordinate(10, 10));

    moving.startMoving(new Coordinate(10, 0), 2);
    moving.nextTick();
    stationary.nextTick();

    expectPosition(moving, 2, 0);
    expectPosition(stationary, 10, 10);
  });

  test("design-note contract: ignores new movement commands after arrival", () => {
    const agent = create();
    agent.startMoving(new Coordinate(3, 4), 5);
    agent.nextTick();
    expectPosition(agent, 3, 4);

    agent.startMoving(new Coordinate(30, 40), 5);
    tick(agent, 5);
    expectPosition(agent, 3, 4);
  });
});

describe("Factories and structures", () => {
  test.each(["", "lobster", "SimpleLobster", "HOUSE"])("agentFactory rejects unsupported type %j", type => {
    expect(() => agentFactory(type, "a", new Coordinate(0, 0))).toThrow(new Error(`unsupported agent type: ${type}`));
  });

  test.each(["", "House", "simple_lobster", "castle"])("structureFactory rejects unsupported type %j", type => {
    expect(() => structureFactory(type, "s", new Coordinate(0, 0))).toThrow(
      new Error(`unsupported structure type: ${type}`)
    );
  });

  test("a house is a Structure and SimulationObject with its requested ID", () => {
    const building = house("my-house");
    expect(building).toBeInstanceOf(Structure);
    expect(building).toBeInstanceOf(SimulationObject);
    expect(building.id).toBe("my-house");
  });

  test.each([
    [0, 0],
    [42, 42],
    [-8, -12],
    [1.25, -9.75],
  ])("a house remains at (%s, %s) across ticks", (x, y) => {
    const building = house("home", x, y);
    expectPosition(building, x, y);
    tick(building, 10);
    expectPosition(building, x, y);
  });

  test("separate houses retain independent positions", () => {
    const first = house("first", 1, 2);
    const second = house("second", 8, 9);

    expect(first).not.toBe(second);
    expectPosition(first, 1, 2);
    expectPosition(second, 8, 9);
  });
});

describe("View observer updates through rendered output", () => {
  test("an empty view draws nothing", () => {
    const harness = createViewHarness();
    expect(harness.render()).toHaveLength(0);
  });

  test.each(["simple_lobster", "sleepy_lobster"])(
    "adding %s broadcasts its initial position and regular sprite",
    type => {
      const model = Model.getInstance();
      const harness = createViewHarness();
      model.attach(harness.view);

      model.addAgent(agentFactory(type, "a", new Coordinate(12.9, -3.2)));

      const calls = harness.render();
      expect(calls).toHaveLength(1);
      expect(calls).toContainEqual(expectedDraw(harness.images.regular, 12.9, -3.2, 0.4));
    }
  );

  test("adding a house broadcasts its position and full-size sprite", () => {
    const model = Model.getInstance();
    const harness = createViewHarness();
    model.attach(harness.view);
    model.addStructure(house("home", 5.9, 7.1));

    const calls = harness.render();
    expect(calls).toHaveLength(1);
    expect(calls).toContainEqual(expectedDraw(harness.images.house, 5.9, 7.1, 1));
  });

  test("movement updates the existing drawable instead of adding duplicates", () => {
    const model = Model.getInstance();
    const harness = createViewHarness();
    model.attach(harness.view);
    const agent = simple();
    model.addAgent(agent);
    agent.startMoving(new Coordinate(20, 0), 2);

    tick(model, 3);

    const calls = harness.render();
    expect(calls).toHaveLength(1);
    expect(calls).toContainEqual(expectedDraw(harness.images.regular, 6, 0, 0.4));
  });

  test("multiple agents and structures appear together", () => {
    const model = Model.getInstance();
    const harness = createViewHarness();
    model.attach(harness.view);

    model.addAgent(simple("a", 1, 2));
    model.addAgent(agentFactory("sleepy_lobster", "b", new Coordinate(3, 4)));
    model.addStructure(house("home", 5, 6));

    const calls = harness.render();
    expect(calls).toHaveLength(3);
    expect(calls).toEqual(
      expect.arrayContaining([
        expectedDraw(harness.images.regular, 1, 2, 0.4),
        expectedDraw(harness.images.regular, 3, 4, 0.4),
        expectedDraw(harness.images.house, 5, 6, 1),
      ])
    );
  });

  test("SimpleLobster keeps its regular sprite after arrival", () => {
    const model = Model.getInstance();
    const harness = createViewHarness();
    model.attach(harness.view);
    const agent = simple();
    model.addAgent(agent);

    agent.startMoving(new Coordinate(3, 4), 5);
    model.nextTick();

    expect(harness.render()).toEqual([expectedDraw(harness.images.regular, 3, 4, 0.4)]);
  });

  test("SleepyLobster changes sprite and scale exactly when it arrives", () => {
    const model = Model.getInstance();
    const harness = createViewHarness();
    model.attach(harness.view);
    const agent = agentFactory("sleepy_lobster", "sleepy", new Coordinate(0, 0));
    model.addAgent(agent);
    agent.startMoving(new Coordinate(6, 8), 5);

    model.nextTick();
    expect(harness.render()).toEqual([expectedDraw(harness.images.regular, 3, 4, 0.4)]);

    model.nextTick();
    expect(harness.render()).toEqual([expectedDraw(harness.images.sleeping, 6, 8, 0.25)]);

    agent.startMoving(new Coordinate(60, 80), 10);
    tick(model, 3);
    expectPosition(agent, 6, 8);
    expect(harness.render()).toEqual([expectedDraw(harness.images.sleeping, 6, 8, 0.25)]);
  });

  test("removing objects removes their drawables while preserving other objects", () => {
    const model = Model.getInstance();
    const harness = createViewHarness();
    model.attach(harness.view);
    model.addAgent(simple("a", 1, 2));
    model.addStructure(house("home", 3, 4));

    expect(harness.render()).toHaveLength(2);

    model.removeAgent("a");
    expect(harness.render()).toEqual([expectedDraw(harness.images.house, 3, 4, 1)]);

    model.removeStructure("home");
    expect(harness.render()).toHaveLength(0);
  });

  test("reusing a removed ID displays the replacement position", () => {
    const model = Model.getInstance();
    const harness = createViewHarness();
    model.attach(harness.view);

    model.addStructure(house("home", 1, 2));
    model.removeStructure("home");
    model.addStructure(house("home", 30, 40));

    expect(harness.render()).toEqual([expectedDraw(harness.images.house, 30, 40, 1)]);
  });

  test("every attached view receives initial state and movement updates", () => {
    const model = Model.getInstance();
    const first = createViewHarness();

    // Reuse the image elements already in the document; each view has its
    // own canvas and draw spy.
    const canvas = document.createElement("canvas");
    const drawImage = jest.fn<CanvasRenderingContext2D["drawImage"]>();
    const context = { drawImage } as unknown as CanvasRenderingContext2D;
    jest.spyOn(canvas, "getContext").mockReturnValue(context);
    const secondView = new MainSimulationView(canvas);

    model.attach(first.view);
    model.attach(secondView);

    const agent = simple();
    model.addAgent(agent);
    agent.startMoving(new Coordinate(10, 0), 2);
    model.nextTick();

    const expected = expectedDraw(first.images.regular, 2, 0, 0.4);
    expect(first.render()).toEqual([expected]);

    drawImage.mockClear();
    secondView.draw();
    expect(drawImage.mock.calls).toEqual([expected]);

    model.detach(secondView);
    model.nextTick();

    expect(first.render()).toEqual([expectedDraw(first.images.regular, 4, 0, 0.4)]);

    // Detach may retain or clear existing drawables. Either way, it must
    // stop receiving new state changes.
    drawImage.mockClear();
    secondView.draw();
    expect(drawImage.mock.calls).not.toContainEqual(expectedDraw(first.images.regular, 4, 0, 0.4));
  });

  test("a detached empty view does not receive later additions", () => {
    const model = Model.getInstance();
    const harness = createViewHarness();
    model.attach(harness.view);
    model.detach(harness.view);

    model.addStructure(house());
    model.addAgent(simple());
    model.nextTick();

    expect(harness.render()).toHaveLength(0);
  });

  test("a detached view can subscribe again and receive future additions", () => {
    const model = Model.getInstance();
    const harness = createViewHarness();
    model.attach(harness.view);
    model.detach(harness.view);
    model.attach(harness.view);

    model.addStructure(house("home", 7, 8));

    expect(harness.render()).toEqual([expectedDraw(harness.images.house, 7, 8, 1)]);
  });
});
