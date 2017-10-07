import { runGame } from './source/game';
import runner from './source/players/runner';

runGame({ players: [
  { name: 'Runner A', run: runner },
  { name: 'Runner B', run: runner },
]}).then(result => console.log(result)).catch(e => console.error(e));
