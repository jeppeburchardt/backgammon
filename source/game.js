import { createBoard, getMovePermutations, commitMoves } from './board';
import { roll } from './dice';

export const findWinner = (board) => {
  if (board.tiles[0][25] === 15) {
    return 0;
  } else if (board.tiles[1][25] === 15) {
    return 1;
  } else {
    return -1;
  }
};

const runTurn = ({ forceRoll, players, board, turn }) => {
  const diceRoll = forceRoll || roll();
  const playerIndex = turn % 2;
  const player = players[playerIndex];
  const permutations = getMovePermutations(board, playerIndex, diceRoll);
  const moves = player.run(permutations, playerIndex);
  const result = commitMoves(board, playerIndex, moves);
  console.log('=======');
  console.log(players[playerIndex].name, diceRoll);
  console.log(board.tiles[playerIndex]);
  console.log(moves);
  console.log(result.tiles[playerIndex]);
  return result;
};

export const runGame = ({ players }) => new Promise((resolve, reject) => {
  let board = createBoard();
  let turn = 0;
  let isGameOver = false;
  let history = [];

  const initialRoll = roll();
  // const players = initialRoll[1] > initialRoll[0]
  //   ? players.reverse()
  //   : players;

  while(!isGameOver) {
    try {
      board = runTurn({
        forceRoll: turn === 0 ? initialRoll : null,
        players,
        board,
        turn,
      });
      const pi = turn % 2;

      history = [...history, board];
    } catch (error) {
      reject(error);
    }

    turn = turn + 1;
    //check win connditions:
    const winner = findWinner(board);
    if (winner > -1) {
      console.log('winner', players[winner].name);
      isGameOver = true;
    }
  }
  resolve('complete', history.length);
});
