function finite(value: number, min = -Number.MAX_VALUE, max = Number.MAX_VALUE): number {
  if (typeof value !== 'number' || !Number.isFinite(value))
    throw new TypeError('Expected finite number');
  if (value < min || value > max) throw new RangeError('Number outside supported bounds');
  return value;
}
function integer(value: number, min = 0, max = 1000000): number {
  if (!Number.isSafeInteger(value)) throw new RangeError('Expected safe integer');
  return finite(value, min, max);
}
function strictText(value: string, max = 16384): void {
  if (typeof value !== 'string') throw new TypeError('Expected string');
  if (value.length > max) throw new RangeError('Text length budget exceeded');
}
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
export function standings(teams: readonly string[], matches: readonly ScoredMatch[]): Standing[] {
  if (
    !Array.isArray(teams) ||
    !teams.length ||
    teams.length > 1000 ||
    !Array.isArray(matches) ||
    matches.length > 10000
  )
    throw new RangeError('Input budget');
  const rows = new Map<string, Standing>();
  for (const team of teams) {
    strictText(team, 100);
    if (!team || rows.has(team)) throw new RangeError('Unique nonempty teams required');
    rows.set(team, {
      team,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
    });
  }
  for (const match of matches) {
    if (!match) throw new TypeError('Expected match');
    const a = rows.get(match.home),
      b = rows.get(match.away);
    if (!a || !b || a === b) throw new RangeError('Distinct known opponents required');
    integer(match.homeGoals, 0, 1000);
    integer(match.awayGoals, 0, 1000);
    a.played++;
    b.played++;
    a.goalsFor += match.homeGoals;
    a.goalsAgainst += match.awayGoals;
    b.goalsFor += match.awayGoals;
    b.goalsAgainst += match.homeGoals;
    if (match.homeGoals === match.awayGoals) {
      a.drawn++;
      b.drawn++;
      a.points++;
      b.points++;
    } else {
      const w = match.homeGoals > match.awayGoals ? a : b,
        l = w === a ? b : a;
      w.won++;
      w.points += 3;
      l.lost++;
    }
  }
  return [...rows.values()].sort(
    (a, b) =>
      b.points - a.points ||
      b.goalsFor - b.goalsAgainst - (a.goalsFor - a.goalsAgainst) ||
      b.goalsFor - a.goalsFor ||
      (a.team < b.team ? -1 : a.team > b.team ? 1 : 0),
  );
}
