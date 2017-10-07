const run = (permutations, playerIndex) => {

  // map permutations to a score to find the best move
  const scoredPermutations = permutations.map(perm => {

    // get 50 point for each piece that is beared off
    let score = perm.board.tiles[playerIndex][25] * 50;

    // get points for each piece according to how far it is on the board
    // add negative score for each piece that stands alone
    score = score + perm.board.tiles[playerIndex].reduce(
      (s, amount, tile) => s + (amount > 1 ? tile * amount : -(tile * amount)),
      0,
    );

    return { score, moves: perm.moves };
  });

  // sort by score
  const sorted = scoredPermutations.sort((a, b) => b.score - a.score);

  // return moved from the highest rated permutation
  return (sorted[0] || { moves: [] }).moves;
};

export default run;
