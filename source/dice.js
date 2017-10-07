const die = () => (Math.floor(6 * Math.random()) + 1);

export const roll = () => ([
  die(),
  die(),
]);

export const rollToMoves = roll => roll[0] === roll[1]
  ? [roll[0], roll[0], roll[0], roll[0]]
  : [roll[0], roll[1]];

export const movePermutations = moves => moves.length === 2
  ? [moves.slice(), moves.slice().reverse()]
  : [moves];
