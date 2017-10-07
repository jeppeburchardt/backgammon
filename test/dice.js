import { expect } from 'chai';
import { roll, rollToMoves, movePermutations } from '../source/dice';

describe('dice.js', () => {
  describe('roll', () => {
    it('should return two numbers', () => {
      const result = roll();
      expect(result[0]).to.be.a('number');
      expect(result[1]).to.be.a('number');
    });
  });

  describe('rollToMoves', () => {
    it('should double moves if both dice have the same value', () => {
      const roll = [3, 3];
      const result = rollToMoves(roll);
      expect(result.length).to.equal(4);
    });
    it('should NOT double moves if both dice don´t have the same value', () => {
      const roll = [2, 3];
      const result = rollToMoves(roll);
      expect(result.length).to.equal(2);
    })
  });
  describe('movePermutations', () => {
    it('should give all possible move orders', () => {
      const moves = [1, 2];
      const result = movePermutations(moves);
      expect(result).to.deep.equal([
        [1, 2],
        [2, 1],
      ]);
    });
    it('should give all possible move orders on a double roll', () => {
      const moves = [1, 1, 1, 1];
      const result = movePermutations(moves);
      expect(result).to.deep.equal([
        [1, 1, 1, 1],
      ]);
    });
  });
});
