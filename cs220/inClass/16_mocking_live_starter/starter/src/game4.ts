import assert from "assert";
import { findIf, repeat, zip } from "./utils.js";
import { writeFileSync } from "fs";

// This last approach is somewhat of a hybrid between what
// we saw in game2.ts + game2.test.ts and game.ts + game3.test.ts
// How the dice rolls are generated is still an implementation detail,
// but we expose a method rollDice that we can spy on and alter the
// behavior of.

// As you go through this example, consider the tradeoffs of each
// of the approaches we've seen so far in terms of:
// - Information hiding
// - Robustness of the tests if the implementation changes
// - Understandability & general maintainability

export class Game {
  private scores: Map<string, number>;
  private playerPositions: Map<string, number>;
  private currentPlayer = 0;
  private board: BoardTile[] = [];

  constructor(private playerNames: string[], private pointsToWin: number) {
    this.scores = new Map(zip(this.playerNames, repeat(0, this.playerNames.length)));
    this.playerPositions = new Map(zip(this.playerNames, repeat(0, this.playerNames.length)));
  }

  // We need a setter because passing the board to the constructor
  // depends on first constructing BoardTiles that depend on the
  // game. There may be better design choices, but we'll use
  // this one for simplicity.
  setBoard(board: BoardTile[]) {
    this.board = board;
  }

  nextTurn() {
    // Random number from 1-6
    const diceRoll = Math.floor(Math.random() * 5) + 1;
    console.log(this.playerNames[this.currentPlayer] + " rolled a " + diceRoll);
    this.moveNSpaces(this.playerNames[this.currentPlayer], diceRoll);
    this.currentPlayer++;
    this.currentPlayer %= this.playerNames.length;
  }


  // Move forward or backwards the specified number of spaces, wrapping around
  // to the beginning or end of the board if we would go past either end.
  moveNSpaces(playerName: string, n: number) {
    const currentPosition = this.playerPositions.get(playerName);
    assert(currentPosition !== undefined);

    // Add length in case n is negative. Modulo the board length
    // will then always put us in bounds.
    const newPosition = (currentPosition + n + this.board.length) % this.board.length;
    this.playerPositions.set(playerName, newPosition);
    assert(newPosition >= 0);
    assert(newPosition < this.board.length);

    this.board[newPosition].activate(playerName);
  }

  adjustScore(playerName: string, points: number) {
    const currentPoints = this.scores.get(playerName);
    assert(currentPoints !== undefined);
    this.scores.set(playerName, currentPoints + points);
  }

  currentScore(playerName: string) {
    const currentPoints = this.scores.get(playerName);
    assert(currentPoints !== undefined);
    return currentPoints;
  }

  // Returns the name of the player that has met the win condition.
  // If no player meets the win condition, returns undefined.
  checkForWinner(): string | undefined {
    const found = findIf(this.scores.entries(), ([_, score]) => score >= this.pointsToWin);
    return found !== undefined ? found[0] : undefined;
  }

  saveGame(filename: string) {
    let saveData =
      "convert the whole game state to a string that we can restore from later";
    try {
      writeFileSync(filename, saveData);
    } catch (e) {
      throw new Error("Unexpected error: Couldn't save the game");
    }
  }
}

export abstract class BoardTile {
  constructor(protected game: Game) {}

  // Called when the specified player lands on this tile.
  abstract activate(playerName: string): void;
}

export class EmptyTile extends BoardTile {
  override activate(playerName: string): void {}
}

export class PointsTile extends BoardTile {
  constructor(game: Game, private points: number) {
    super(game);
  }

  override activate(playerName: string): void {
    console.log(this.points + " points!");
    this.game.adjustScore(playerName, this.points);
  }
}

export class MoveTile extends BoardTile {
  constructor(game: Game, private spacesToMove: number) {
    super(game);
  }

  override activate(playerName: string): void {
    console.log("Move " + this.spacesToMove + " spaces");
    this.game.moveNSpaces(playerName, this.spacesToMove);
  }
}
