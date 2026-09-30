# tournament-scheduler

A small, dependency-free JavaScript library for scheduling tournaments. It creates **round-robin** schedules (everyone meets everyone) with a sortable **league table**, and seeded **single-elimination** brackets (knockout cups) with automatic **byes**.

## Why use it?

- **Zero dependencies.** Only plain JavaScript and the Node.js standard library.
- **Framework-agnostic.** No UI and no I/O. You get plain objects back and render them however you like, in a web app, a CLI or a Discord bot.
- **Sport-agnostic.** Scores are just numbers and the point system is configurable, so it works for football, hockey, chess, e-sports or a board game night.
- **Handles the awkward cases for you.** Odd numbers of participants in a round-robin, and brackets that are not a power of two (for example 6 or 13 participants), are handled with byes.

### What it does not do (yet)

- No double round-robin (home and away), group stages, Swiss system or double elimination.
- Standings ties are broken by points, score difference, total scored and finally name. Head-to-head results are not used.
- No persistence or scheduling of dates, times or venues.
- There is no single `Tournament` facade class yet. You combine the schedulers and `Standings` yourself (see the examples below).

## Requirements

- Node.js **20 or later**
- ES modules (`import`/`export`)

## Installation

Install directly from GitHub:

```bash
npm install github:nordstrom-a/tournament-scheduler
```

## Quick start

### Round-robin with a league table

```js
import { Participant, RoundRobinScheduler, Standings } from 'tournament-scheduler'

const teams = ['AIK', 'Djurgården', 'Hammarby', 'IFK'].map(name => new Participant(name))

const rounds = new RoundRobinScheduler().createRounds(teams)
const standings = new Standings(teams)

for (const round of rounds) {
  console.log(`Round ${round.getNumber()}`)
  for (const match of round.getMatches()) {
    match.recordResult(2, 1) // use your real results here
    standings.recordMatch(match)
  }
}

for (const entry of standings.getEntries()) {
  console.log(entry.getParticipant().getName(), entry.getPoints())
}
```

With an odd number of participants, one participant sits out each round:

```js
for (const participant of round.getParticipantsWithBye()) {
  console.log(`${participant.getName()} has a bye`)
}
```

### Custom point system

The default is 3 points for a win, 1 for a draw and 0 for a loss. Pass only the values you want to change:

```js
const hockeyTable = new Standings(teams, { win: 2 })
const chessTable = new Standings(players, { win: 1, draw: 0.5 })
```

### Single-elimination bracket

```js
import { Participant, SingleEliminationScheduler } from 'tournament-scheduler'

const players = [
  new Participant('Anna', 1),
  new Participant('Bo', 2),
  new Participant('Cia', 3),
  new Participant('Dan', 4),
  new Participant('Eva'),
  new Participant('Filip')
]

const scheduler = new SingleEliminationScheduler()
let round = scheduler.createFirstRound(players)
// Round 1: Dan vs Eva, Cia vs Filip. Anna and Bo (seeds 1 and 2) get byes.

while (true) {
  for (const match of round.getMatches()) {
    match.recordResult(1, 0) // use your real results here
  }
  if (round.getMatches().length === 1) {
    break
  }
  round = scheduler.createNextRound()
}

const final = round.getMatches()[0]
console.log(`Champion: ${final.getWinner().getName()}`)
```

How the bracket is built:

- The bracket size is rounded up to the next power of two (6 participants gives 8 slots).
- Seeded participants are placed so that seed 1 and seed 2 can only meet in the final. Unseeded participants fill the remaining positions in the order given.
- The empty slots become byes, and they always go to the highest seeds.

## API

All classes are exported from the package root.

### `Participant`

| Member | Description |
| --- | --- |
| `new Participant(name, seed = null)` | `name` is a non-empty string (trimmed). `seed` is a positive integer, where 1 is the highest, or `null`. Throws `TypeError` / `RangeError` on invalid input. |
| `getName()` | The participant's name. |
| `getSeed()` | The seed, or `null`. |
| `isSeeded()` | `true` if the participant has a seed. |

### `Match`

| Member | Description |
| --- | --- |
| `new Match(home, away)` | Two different `Participant` instances. |
| `getHomeParticipant()` / `getAwayParticipant()` | The two participants. |
| `recordResult(homeScore, awayScore)` | Non-negative integers. Calling it again overwrites the result. |
| `isPlayed()` | `true` once a result is recorded. |
| `getHomeScore()` / `getAwayScore()` | The scores, or `null` if not played. |
| `isDraw()` | `true` if played and the scores are equal. |
| `getWinner()` / `getLoser()` | A `Participant`, or `null` for a draw. Throws if the match is not played. |

### `Round`

| Member | Description |
| --- | --- |
| `getNumber()` | The round number, starting at 1. |
| `getMatches()` | A copy of the matches in the round. |
| `getParticipantsWithBye()` | A copy of the participants who do not play this round. |
| `isComplete()` | `true` when every match in the round is played. |

### `RoundRobinScheduler`

| Member | Description |
| --- | --- |
| `createRounds(participants)` | Returns every round at once. `n` participants give `n - 1` rounds (`n` rounds if `n` is odd). Needs at least two participants. The given array is not modified. |

### `SingleEliminationScheduler`

One instance keeps track of one bracket.

| Member | Description |
| --- | --- |
| `createFirstRound(participants)` | Builds the bracket and returns round 1. Needs at least two participants. |
| `createNextRound()` | Pairs the winners and bye participants of the current round. Throws if a match is unplayed or drawn, if no first round exists, or if the final has already been created. |

### `Standings`

| Member | Description |
| --- | --- |
| `new Standings(participants, { win = 3, draw = 1, loss = 0 } = {})` | One table entry per participant. |
| `recordMatch(match)` | Adds a played match. Throws if the match is unplayed or involves a participant who is not in the table, and in that case the table is left unchanged. |
| `getEntries()` | `StandingsEntry[]`, best placed first. |

### `StandingsEntry`

`getParticipant()`, `getPlayed()`, `getWins()`, `getDraws()`, `getLosses()`, `getScored()`, `getConceded()`, `getScoreDifference()`, `getPoints()`.

## Running the tests

The tests use the built-in Node.js test runner, so nothing needs to be installed:

```bash
npm test
```

See [TEST_REPORT.md](TEST_REPORT.md) for what is tested and the latest results.

## Contributing

Bug reports and ideas are welcome as [GitHub issues](https://github.com/nordstrom-a/tournament-scheduler/issues). Pull requests should include tests for new behaviour, and `npm test` should pass.

## Version

0.1.0. The API may still change before 1.0.0.

## License

[MIT](LICENSE) © 2026 Anton Nordström
