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
