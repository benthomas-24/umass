import { EmptyTile, Game, MoveTile, PointsTile } from "./game.js";

describe("Game", () => {
  test("V1 Player moves backwards and wraps around", () => {
    const playerName = "Waluigi";
    const game = new Game([playerName], 42);
    game.setBoard([
      new EmptyTile(game),
      new MoveTile(game, -2),
      new PointsTile(game, 1),
      new PointsTile(game, 2),
    ]);

    // To trigger the "wrap-backwards" behavior, we need to guarantee that the player
    // lands on the MoveTile at index 1.
    // Since the implementation generates a random number, this test passes sometimes
    // but usually fails.

    expect(game.currentScore(playerName)).toEqual(0);
    game.nextTurn();
    expect(game.currentScore(playerName)).toEqual(2);
  });
});
