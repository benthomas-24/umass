import { EmptyTile, Game, MoveTile, PointsTile } from "./game.js";

function main() {
  const players = ["WALUIGI", "Peach", "Bowser"];

  const game = new Game(players, 3);
  game.setBoard([
    new EmptyTile(game),
    new EmptyTile(game),
    new PointsTile(game, 1),
    new EmptyTile(game),
    new PointsTile(game, 1),
    new PointsTile(game, 1),
    new EmptyTile(game),
    new EmptyTile(game),
    new PointsTile(game, 1),
    new PointsTile(game, 1),
    new MoveTile(game, -2),
    new PointsTile(game, 1),
    new PointsTile(game, 1),
    new EmptyTile(game),
    new MoveTile(game, -2),
    new PointsTile(game, 2),
    new MoveTile(game, -2),
    new PointsTile(game, 2),
    new PointsTile(game, 2),
  ]);

  let winner = undefined;
  while (winner === undefined) {
    game.nextTurn();

    for (const player of players) {
      console.log(player + " has " + game.currentScore(player) + " points");
    }

    winner = game.checkForWinner();
  }
  console.log(winner + " Wins!");
}

main();
