import { EmptyTile, Game, MoveTile, PointsTile } from "./game2.js";

describe("Game", () => {
  test("V2 Player moves backwards and wraps around", () => {
    // Write our own fake random number generator

    const playerName = "Waluigi";
    const game = new Game([playerName], 42);
    game.setBoard([
      new EmptyTile(game),
      new MoveTile(game, -2),
      new PointsTile(game, 1),
      new PointsTile(game, 2),
    ]);

    expect(game.currentScore(playerName)).toEqual(0);
    game.nextTurn();
    expect(game.currentScore(playerName)).toEqual(2);
  });
});
