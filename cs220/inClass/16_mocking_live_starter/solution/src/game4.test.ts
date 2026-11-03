// BEGIN SOLUTION
// This is the part where it gets more language/framework-specific.
// Here we ask jest to replace the entire "fs" module
// with a fake one, and we specify how we want writeFileSync
// to behave.
// Yes, this has to go at the top of the test file before any imports
// that use the mocked dependency.
jest.mock("fs", () => {
  return {
    writeFileSync: () => {
      // Throwing an exception that matches Node's SystemError is
      // a bit clunky. That is, you can't just say
      // throw new SystemError().
      // To avoid getting into the weeds, we'll skip that detail.
      throw new Error("Some unexpected error from fs.writeFileSync");
    }
  };
});
// END SOLUTION
import { EmptyTile, Game, MoveTile, PointsTile } from "./game4.js";

describe("Game", () => {
  test("V4 Player moves backwards and wraps around", () => {
    const playerName = "Waluigi";
    const game = new Game([playerName], 42);
    game.setBoard([
      new EmptyTile(game),
      new MoveTile(game, -2),
      new PointsTile(game, 1),
      new PointsTile(game, 2),
    ]);

    // This time, we add a public rollDice method to our
    // our Game class and mock that method.
    // BEGIN SOLUTION
    // Notice how we can just tell it to return 1
    // instead of having to figure out floating point
    // value Math.random needs to return to get what we want.
    jest.spyOn(game, "rollDice").mockReturnValue(1);
    // END SOLUTION

    // Optional exercise: Write a test that examines the
    // "forward wraparound" behavior.

    expect(game.currentScore(playerName)).toEqual(0);
    game.nextTurn();
    expect(game.currentScore(playerName)).toEqual(2);
  });

  // To test this rare edge case, we need to mock the behavior
  // of the "fs" module that provides filesystem operations.
  test('Saving game fails - no disk space left', () => {
    const playerName = "Waluigi";
    const game = new Game([playerName], 42);
    game.setBoard([
      new EmptyTile(game),
      new MoveTile(game, -2),
      new PointsTile(game, 1),
      new PointsTile(game, 2),
    ]);

    expect(() => {
      game.saveGame("save.txt");
    }).toThrow("Unexpected error: Couldn't save the game");
  });
});
