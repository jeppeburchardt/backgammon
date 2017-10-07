import { expect } from 'chai';
import { getMovePermutations, createBoard, getMoves, commitMove, commitMoves } from '../source/board';

describe('board.js', () => {

  describe('createBoard', () => {
    it('should create an empty board', () => {
      const board = createBoard();
      expect(board.tiles).to.be.an('array');
      expect(board.tiles.length).to.equal(2);
    });
  });

  describe('getMoves', () => {
    it('should find all moves on a board', () => {
      const board = createBoard();
      const result = getMoves(board, 0, 3);
      expect(result.length).to.equal(4);
      expect(result.some(m => m[0] === 1 && m[1] === 3)).to.be.true;
      expect(result.some(m => m[0] === 12 && m[1] === 3)).to.be.true;
      expect(result.some(m => m[0] === 17 && m[1] === 3)).to.be.true;
      expect(result.some(m => m[0] === 19 && m[1] === 3)).to.be.true;
    });

    it('should not allow a move if opponent is in the way', () => {
      const board = createBoard();
      board.tiles = [
        [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0],
      ];
      const result = getMoves(board, 0, 1);
      expect(result.length).to.equal(0);
    });

    it('should not allow other moves than moving out of jail', () => {
      const board = createBoard();
      board.tiles[0] = [
        1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
      ];
      const result = getMoves(board, 0, 3);
      expect(result.length).to.equal(1);
      expect(result.some(m => m[0] === 0 && m[1] === 3)).to.be.true;
    });

    it('should not allow bearing off when there are pieces in the first three quaters', () => {
      const board = createBoard();
      board.tiles = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ];
      const result = getMoves(board, 0, 3);
      expect(result.length).to.equal(1);
      expect(result.some(m => m[0] === 18 && m[1] === 3)).to.be.true;
    });

    it('should allow bearing off when there are only pieces in the last three quaters', () => {
      const board = createBoard();
      board.tiles = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ];
      const result = getMoves(board, 0, 3);
      expect(result.some(m => m[0] === 22 && m[1] === 3)).to.be.true;
    });
  });

  describe('commitMove', () => {
    it('should return a new board with the move applied', () => {
      const board = createBoard();
      const result = commitMove(board, 0, 1, 1);
      expect(result.tiles[0][1]).to.equal(1);
      expect(result.tiles[0][2]).to.equal(1);
      expect(board.tiles[0][1]).to.equal(2);
    });

    it('should return a new board with the hit applyed applied', () => {
      const board = createBoard();
      board.tiles = [
        [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      ];
      const result = commitMove(board, 0, 2, 1);
      expect(result.tiles[0][3]).to.equal(1); // move player
      expect(result.tiles[1][22]).to.equal(0); // remove hit opponent
      expect(result.tiles[1][0]).to.equal(1); // add opponent to jail
    });

    it('should bear off with a higher die roll', () => {
      const board = createBoard();
      board.tiles = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ];
      const result = commitMove(board, 0, 24, 6);
      expect(result.tiles[0][24]).to.equal(0);
      expect(result.tiles[0][25]).to.equal(1);
    });
  });

  describe('commitMoves', () => {
    it('should commit multiple moves', () => {
      const board = createBoard();
      board.tiles = [
        [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ];
      const result = commitMoves(board, 0, [[2,1], [3,1]]);
      expect(result.tiles[0][2]).to.equal(0);
      expect(result.tiles[0][3]).to.equal(0);
      expect(result.tiles[0][4]).to.equal(1);
    });
  });

  describe('getMovePermutations', () => {
    it('should find all permutations of a standat move', () => {
      const board = createBoard();
      board.tiles = [
        [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ];
      const result = getMovePermutations(board, 0, [1, 2]);
      // console.log(JSON.stringify(result, null, 2));
      expect(result.length).to.equal(7, 'expected exacly four permutations');
      expect(result.some(r => r.moves.join('-') === '7,1-8,2')).to.be.true;
      expect(result.some(r => r.moves.join('-') === '8,1-7,2')).to.be.true;
      expect(result.some(r => r.moves.join('-') === '8,1-9,2')).to.be.true;
      expect(result.some(r => r.moves.join('-') === '7,2-8,1')).to.be.true;
      expect(result.some(r => r.moves.join('-') === '7,2-9,1')).to.be.true;
      expect(result.some(r => r.moves.join('-') === '8,2-7,1')).to.be.true;
      expect(result.some(r => r.moves.join('-') === '8,2-10,1')).to.be.true;
    });
    it('should find 4 moves on a double roll', () => {
      const board = createBoard();
      board.tiles = [
        [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ];
      const result = getMovePermutations(board, 0, [1, 1]);
      console.log(JSON.stringify(result[0].moves));
      expect(result.length).to.equal(1, 'expected exacly one permutations');
      expect(result.some(r => r.moves.join('-') === '7,1-8,1-9,1-10,1')).to.be.true;
    });
  });
});
