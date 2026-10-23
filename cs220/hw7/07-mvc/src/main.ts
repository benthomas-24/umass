import { assert } from "./assert.js";
import { agentFactory } from "./simulation_object/agent.js";
import { Coordinate } from "./geometry.js";
import { structureFactory } from "./simulation_object/structure.js";

function main() {
  const canvas = getCanvas();

  // TASK: Create an instance of MainSimulationView
  //       and attach it to the model.

  const lobsters = createLobsters();
  // TASK: Add each lobster to the model.

  const house = structureFactory("house", "my-house", new Coordinate(0, 0));
  // TASK: Add the house to the model.

  setInterval(() => {
    // TASK: Call nextTick on the model here.
    canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    // TASK: Call draw on the view here.
  }, 100);
}

// TODO: move this to include/ and import it in this file (also look at comment in model.test.ts)
// Returns an HTMLCanvasElement representing the canvas
// that the views will draw on.
function getCanvas() {
  const canvas = document.getElementById("simulationCanvas");
  assert(canvas !== null);
  return canvas as HTMLCanvasElement;
}

// Create some lobsters with arbitrary initial locations,
// destinations, and speeds.
function createLobsters() {
  // // Uncomment these simulation objects as you implement them.
  // const lobst1 = agentFactory("simple_lobster", "lobster1", new Coordinate(300, 400));
  // lobst1.startMoving(new Coordinate(750, 50), 10);
  // const lobst2 = agentFactory("simple_lobster", "lobster2", new Coordinate(800, 450));
  // const lobst3 = agentFactory("sleepy_lobster", "lobster3", new Coordinate(200, 300));
  // lobst3.startMoving(new Coordinate(0, 250), 5);
  // return []; // Add the uncommented lobsters to this array
}

main();
