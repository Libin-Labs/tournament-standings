# @lp-labs/tournament-standings

Deterministic points-table aggregation from scored matches.

Original, standalone MIT TypeScript implementation with **zero runtime or peer dependencies**. ESM/CommonJS exports and separate declarations; Node18+ and compatible ES2022 browsers. No service, filesystem, network, clock or browser globals accessed on import. Compiler/formatter dependencies are development-only.

## Install

```sh
npm install @lp-labs/tournament-standings
```

## Working example

```js
import { standings } from '@lp-labs/tournament-standings';
if (standings(['A', 'B'], [{ home: 'A', away: 'B', homeGoals: 2, awayGoals: 1 }])[0].points !== 3)
  throw new Error('Standings');
```

CommonJS: `const api = require('@lp-labs/tournament-standings')`.

## Behavior, customization and limits

standings(teams,matches) uses fixed3 points win,1 draw,0 loss; sorts points, goal difference, goals for, then ordinal team ID. Team IDs nonempty <=100 chars, unique, <=1000; matches<=10000 with distinct known home/away and integer goals0..1000. Repeated fixtures allowed (each is a result); returns played/won/drawn/lost/for/against/points. No head-to-head or league-specific tie rules. O(teams log teams + matches), no mutation or prototype-key hazards.

Use the explicit function arguments and public types below to customize the documented behavior. There are no hidden environment settings or sibling-library requirements. Array inputs must be dense; sparse entries are invalid. Inputs are validated before a successful result is returned. Outputs do not mutate caller-owned inputs. Hostile proxies/getters and concurrent mutation are outside the contract.

## Errors and integration

Invalid data never produces an empty success-shaped substitute. TypeError reports incompatible runtime types/nonfinite numbers; RangeError reports unsupported ranges, invalid syntax, inconsistent states and exceeded budgets. Functions that explicitly return null, false or empty arrays describe those legitimate outcomes above. Errors propagate to callers; UI applications should catch at their boundary and visibly notify users. Numerical calculations use JavaScript IEEE754 unless the API explicitly uses bigint; compare approximate numerical results with application-appropriate tolerances.

## Complete public API

```ts
export interface ScoredMatch {
  home: string;
  away: string;
  homeGoals: number;
  awayGoals: number;
}
export interface Standing {
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}
export declare function standings(
  teams: readonly string[],
  matches: readonly ScoredMatch[],
): Standing[];
```

## Performance and portability

Complexity and resource ceilings are specified above. Buffered synchronous algorithms do not create workers or timers; callers can move expensive work to their own worker. Limits are enforced, not silently truncated. No runtime imports from any other library. No compatibility or completeness claims beyond the stated scope.

## Support

If this library is useful to you, consider supporting its maintenance with a [donation via PayPal](https://www.paypal.me/LibinPrasanth).

## Author

Created by [Libin Prasanth](https://www.linkedin.com/in/libinprasanth/). Connect on LinkedIn for updates and discussion.
