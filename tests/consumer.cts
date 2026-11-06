import { standings } from '@lp-labs/tournament-standings';
if (standings(['A', 'B'], [{ home: 'A', away: 'B', homeGoals: 2, awayGoals: 1 }])[0].points !== 3)
  throw new Error('Standings');
// @ts-expect-error invalid argument must be rejected by declarations
standings([1, 2], []);
