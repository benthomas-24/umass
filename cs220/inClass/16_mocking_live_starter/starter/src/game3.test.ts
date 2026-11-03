import { EmptyTile, Game, MoveTile, PointsTile } from "./game.js";

// These tests do not require modifying the Game class,
// so we can use the original in game.ts

describe("Game", () => {
  test("V3.1 Player moves backwards and wraps around", () => {
    const playerName = "Waluigi";
    const game = new Game([playerName], 42);
    game.setBoard([
      new EmptyTile(game),
      new MoveTile(game, -2),
      new PointsTile(game, 1),
      new PointsTile(game, 2),
    ]);

    // Our testing framework, jest, provides ways to
    // observe and modify the behavior of existing functions.
    // First we ask it to "spy" on Math.random (Math
    // is an object that has a method "random").
    // Then, we modify the behavior of Math.random to
    // always return 0.17, which makes our
    // dice roll code in Game always roll 1.

    // Consider: What are the tradeoffs of the two approaches
    // we've seen so far?

    expect(game.currentScore(playerName)).toEqual(0);
    game.nextTurn();
    expect(game.currentScore(playerName)).toEqual(2);
  });

  test("V3.2 Player wraps around backwards and forwards", () => {
    const playerName = "Waluigi";
    const game = new Game([playerName], 42);
    game.setBoard([
      new EmptyTile(game),
      new MoveTile(game, -2),
      new PointsTile(game, 1),
      new PointsTile(game, 2),
    ]);

    // We can also tell jest to make Math.random
    // produce specific values depending on how many
    // times it's been called.
    // Here we make it roll a 1 and then a 3.

    expect(game.currentScore(playerName)).toEqual(0);
    game.nextTurn();
    expect(game.currentScore(playerName)).toEqual(2);
    game.nextTurn();
    expect(game.currentScore(playerName)).toEqual(3);
  });
});
