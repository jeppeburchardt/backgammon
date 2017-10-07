import { movePermutations, rollToMoves } from './dice';

export const createBoard = () => ({
  tiles: [
    [0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 3, 0, 5, 0, 0, 0, 0, 0, 0],
    [0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 3, 0, 5, 0, 0, 0, 0, 0, 0],
  ],
});

export const copy = (board) => ({
  tiles: [
    board.tiles[0].slice(),
    board.tiles[1].slice(),
  ],
})

export const getMoves = (board, player, die) => {
  const tiles = board.tiles[player];
  const opponentTiles = board.tiles[1 - player].slice().reverse();
  const moves = [];
  const canBearOff = !tiles.some((num, tile) => tile < 19 && num > 0);

  // player has a jailed piece
  if (tiles[0] > 0) {
    if (opponentTiles[die + 1] < 2) {
      moves.push([0, die]);
    }
  } else {
    tiles.forEach((numPieces, tile) => {
      if (numPieces > 0) {
        if (tile + die < 25 && opponentTiles[tile + die] < 2) {
          moves.push([tile, die]);
        } else if (canBearOff) {
          moves.push([tile, die]);
        }
      }
    });
  }

  return moves;
};

export const commitMoves = (board, player, moves) => {
  return moves.reduce((b, move) => commitMove(b, player, move[0], move[1]), board);
};

export const commitMove = (board, player, tile, die) => {
  const newBoard = copy(board);
  const newPosition = Math.min(tile + die, 25);
  const positionRelativeToOpponent = 25 - (tile + die);
  newBoard.tiles[player][tile] = newBoard.tiles[player][tile] - 1;
  newBoard.tiles[player][newPosition] = newBoard.tiles[player][newPosition] + 1;
  if (newBoard.tiles[1 - player][positionRelativeToOpponent] === 1) {
    newBoard.tiles[1 - player][positionRelativeToOpponent] = 0;
    newBoard.tiles[1 - player][0] = newBoard.tiles[1 - player][0] + 1;
  }
  return newBoard;
};

export const getMovePermutations = (board, player, dice) => {
  const all = movePermutations(rollToMoves(dice))
    .reduce((gamePermutations, dicePermutation, moveIndex) => ([
        ...gamePermutations,
        ...dicePermutation.reduce((result, die, dieIndex) => {
            //expand from all previous permutations:
            const newIndex = dieIndex + 1;
            result[dieIndex] && result[dieIndex].forEach(prev => {
              //apply new moves to copys of previous permutations
              const permutations = getMoves(prev.board, player, die).map(move => ({
                moves: [...prev.moves, move],
                board: commitMove(prev.board, player, move[0], move[1]),
              }));
              //add new permutations to result depth
              result[newIndex] = !!result[newIndex]
                ? [...result[newIndex], ...permutations]
                : permutations;
            });
            return result;
          }, [
            [{ board: copy(board), moves: [] }],
          ]),
        ]),
      [],
    );
    const flatten = Array.prototype.concat.apply([], all);
  	//check if all dices can be used:
  	const isObstructed = flatten.every(p => p.moves.length < rollToMoves(dice).length);
    //check if player is stuck
  	const isStuck = flatten.every(p => p.moves.length == 0);

  	if (isStuck) {
  		// player is stuck, no moves available!
  		return [];

  	} else if (isObstructed) {
  		// if a player can only use one or the other die, the highest must be used!
  		return flatten
        .filter(p => p.moves.length > 0)
        .sort((a, b) => a.moves[0][1] - b.moves[0][1])
        .pop();

  	}
		// remove all moves that does not use all dice:
		return flatten.filter(p => p.moves.length == rollToMoves(dice).length);
};
