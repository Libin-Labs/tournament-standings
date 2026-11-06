import assert from 'node:assert/strict';
import test from 'node:test';
import * as api from '../dist/esm/index.js';
test('win aggregation', () => {
  const r = api.standings(['A', 'B'], [{ home: 'A', away: 'B', homeGoals: 2, awayGoals: 1 }]);
  assert.equal(r[0].team, 'A');
  assert.equal(r[0].points, 3);
  assert.equal(r[1].lost, 1);
});
test('draw aggregation', () => {
  const r = api.standings(['A', 'B'], [{ home: 'A', away: 'B', homeGoals: 0, awayGoals: 0 }]);
  assert.ok(r.every((x) => x.points === 1 && x.drawn === 1));
});
test('deterministic ID tie', () => {
  assert.deepEqual(
    api.standings(['z', 'a'], []).map((x) => x.team),
    ['a', 'z'],
  );
});
test('prototype IDs', () => {
  assert.equal(api.standings(['__proto__', 'constructor'], []).length, 2);
});
test('invalid fixture rejection', () => {
  assert.throws(() => api.standings(['A', 'A'], []));
  assert.throws(() => api.standings(['A'], [{ home: 'A', away: 'A', homeGoals: 0, awayGoals: 0 }]));
  assert.throws(() =>
    api.standings(['A', 'B'], [{ home: 'A', away: 'B', homeGoals: 1.5, awayGoals: 0 }]),
  );
});
test('match conservation', () => {
  const teams = ['a', 'b', 'c', 'd'],
    matches = [];
  for (let i = 0; i < 4; i++)
    for (let j = i + 1; j < 4; j++)
      matches.push({ home: teams[i], away: teams[j], homeGoals: i, awayGoals: j });
  const r = api.standings(teams, matches);
  assert.equal(
    r.reduce((s, x) => s + x.played, 0),
    12,
  );
  assert.equal(
    r.reduce((s, x) => s + x.goalsFor, 0),
    r.reduce((s, x) => s + x.goalsAgainst, 0),
  );
  assert.equal(
    r.reduce((s, x) => s + x.points, 0),
    18,
  );
});
