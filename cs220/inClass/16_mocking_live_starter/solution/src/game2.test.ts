// SKELETON import { EmptyTile, Game, MoveTile, PointsTile } from "./game2.js";
// BEGIN SOLUTION
import { EmptyTile, Game, MoveTile, PointsTile, RandomNumberGenerator } from "./game2.js";
// END SOLUTION

describe("Game", () => {
  test("V2 Player moves backwards and wraps around", () => {
    // Write our own fake random number generator
    // BEGIN SOLUTION
    class NotRandom implements RandomNumberGenerator {
      randomInt(min: number, max: number): number {
        return 1; // cf. https://xkcd.com/221/
      }
    }
    // END SOLUTION

    const playerName = "Waluigi";
    // SKELETON const game = new Game([playerName], 42);
    // BEGIN SOLUTION
    const game = new Game([playerName], 42, new NotRandom());
    // END SOLUTION
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
