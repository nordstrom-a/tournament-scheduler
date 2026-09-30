# Test Report

## Summary

The module is tested with **automated unit tests** written with the Node.js built-in test runner (`node:test`) and assertion library (`node:assert/strict`). No test framework has to be installed.

The tests are in the [`test/`](test/) directory, separate from the module code in [`src/`](src/). There is one test file per class, and each test creates its own fresh objects (`beforeEach` or local variables), so the tests do not depend on each other.

To run the same tests yourself:

```bash
git clone https://github.com/nordstrom-a/tournament-scheduler.git
cd tournament-scheduler
npm test
```

I chose automated unit tests because the module has no user interface and its most important behaviour is rule-based: every participant must meet every other participant exactly once, byes must go to the top seeds, the table must be sorted in the right order. Rules like these are easy to state as exact expected values, and the tests can be re-run after every small change. That was useful, because the tests were run before every commit, and the refactoring of `SingleEliminationScheduler` (keeping track of bracket slots) could be verified without changing any behaviour.

Beyond single cases, the scheduler tests check **properties** of the whole schedule. For example, the round-robin tests collect all pairings and check with a `Set` that there are no duplicates and that the count equals n(n-1)/2.

The code examples in [README.md](README.md) were also run manually against the installed package, to check that the documented usage works.

**Environment:** Node.js v24.7.0, macOS. Last run: 2026-09-30.

## Test Results

**Totals:** 63 tests in 11 suites, **63 passed, 0 failed.**

| What was tested | How it was tested | Result |
| --- | --- | --- |
| `Participant` stores a trimmed name | Unit test: `new Participant('  IFK  ')`, check that `getName()` returns `'IFK'`. | ✅ Passed |
| `Participant` rejects invalid names | Unit tests: an empty/whitespace string and a number must throw `TypeError`. | ✅ Passed |
| `Participant` seed is optional | Unit tests: without a seed, `getSeed()` is `null` and `isSeeded()` is `false`. With seed 3, both reflect it. | ✅ Passed |
| `Participant` rejects invalid seeds | Unit tests: `0`, `-2`, `1.5` and `'1'` must throw `RangeError`. | ✅ Passed |
| `Match` stores its participants | Unit test: check that `getHomeParticipant()` and `getAwayParticipant()` return the same objects that were given. | ✅ Passed |
| `Match` rejects invalid participants | Unit tests: a string instead of a `Participant` throws `TypeError`. The same participant on both sides throws `Error`. | ✅ Passed |
| `Match.recordResult()` | Unit tests: a new match is unplayed with `null` scores. After `recordResult(2, 1)` it is played with those scores. A second call overwrites the result. | ✅ Passed |
| `Match.recordResult()` rejects invalid scores | Unit test: `-1` and `1.5` must throw `RangeError`. | ✅ Passed |
| `Match.getWinner()` / `getLoser()` | Unit tests: for 3–1 the home participant wins, for 0–2 the away participant wins, and for 1–1 both return `null` and `isDraw()` is `true`. | ✅ Passed |
| `Match` before it is played | Unit tests: `isDraw()` returns `false`, and `getWinner()` / `getLoser()` throw `Error`. | ✅ Passed |
| `Round` stores number, matches and byes | Unit tests: the values given to the constructor are returned. Byes default to an empty array. | ✅ Passed |
| `Round.isComplete()` | Unit test: two matches. `false` after one result, `true` after both. | ✅ Passed |
| `Round` encapsulation | Unit test: pushing to the array from `getMatches()` does not change the round. | ✅ Passed |
| `Round` rejects invalid numbers | Unit test: `0` and `1.5` must throw `RangeError`. | ✅ Passed |
| `RoundRobinScheduler`, even count: size of the schedule | Unit test with 6 participants: 5 rounds with 3 matches each. | ✅ Passed |
| `RoundRobinScheduler`, even count: everyone meets everyone once | Unit test with 6 participants: all 15 pairings are collected as sorted name keys and a `Set` confirms 15 unique pairings. | ✅ Passed |
| `RoundRobinScheduler`: nobody plays twice in one round | Unit test: for each round, a `Set` of all playing participants has the same size as the list. | ✅ Passed |
| `RoundRobinScheduler`: round numbering | Unit test with 4 participants: round numbers are `[1, 2, 3]`. | ✅ Passed |
| `RoundRobinScheduler`, odd count: byes | Unit tests with 5 participants: 5 rounds, each with 2 matches and 1 bye, and every participant gets exactly one bye. | ✅ Passed |
| `RoundRobinScheduler`, odd count: everyone meets everyone once | Unit test with 5 participants: 10 unique pairings. | ✅ Passed |
| `RoundRobinScheduler` does not modify the input | Unit test: the participant array has the same order after `createRounds()`. | ✅ Passed |
| `RoundRobinScheduler` needs two participants | Unit test: one participant must throw `RangeError`. | ✅ Passed |
| `SingleEliminationScheduler`: seeded pairings | Unit test with 8 seeds: round 1 is exactly 1–8, 4–5, 2–7, 3–6, so seeds 1 and 2 can only meet in the final. Two participants give a single match. | ✅ Passed |
| `SingleEliminationScheduler`: placement by seed | Unit tests: participants given in reverse seed order still pair 1–4, 2–3. Unseeded participants are placed after seeded ones. | ✅ Passed |
| `SingleEliminationScheduler`: byes when the bracket is not full | Unit tests: 6 participants give byes to seeds 1–2 and matches 4–5, 3–6. 5 participants give byes to seeds 1–3 and one match 4–5. | ✅ Passed |
| `SingleEliminationScheduler.createNextRound()` | Unit test with 6 participants (home side always wins): round 2 is 1–4 and 2–3 with no byes, and it is numbered 2. | ✅ Passed |
| `SingleEliminationScheduler`: full bracket | Unit test with 8 participants: the rounds are played in a loop until one match remains. That is round 3, and the final is seed 1 vs seed 2. | ✅ Passed |
| `SingleEliminationScheduler` invalid use | Unit tests: `Error` when there is no first round, when a match is unplayed, when a match is a draw, and when the final already exists. `RangeError` with fewer than two participants. | ✅ Passed |
| `StandingsEntry` counting | Unit tests: a win, a draw and a loss are each counted correctly, and three matches accumulate played (3), scored (5), conceded (4), difference (+1) and points (4). | ✅ Passed |
| `Standings` point system | Unit tests: the default is 3/1/0 (checked after a win and a draw), and `{ win: 2 }` gives 2 points for a win. | ✅ Passed |
| `Standings` sorting | Unit tests, each built so that only one rule decides: points, then score difference, then total scored, then name alphabetically. | ✅ Passed |
| `Standings.recordMatch()` rejects invalid matches | Unit test: an unplayed match throws `Error`. | ✅ Passed |
| `Standings.recordMatch()` leaves the table unchanged on error | Regression test: a match against a participant who is not in the table throws, and the known participant still has 0 played. | ✅ Passed (bug found and fixed, see below) |
| Public API via the package name | Manual test: the package was linked into a separate folder and the README examples were run with `import ... from 'tournament-scheduler'`. | ✅ Passed |

## Bugs found during testing

| Problem | How it was found | Fix |
| --- | --- | --- |
| `Standings.recordMatch()` updated the home participant's row before it discovered that the away participant was unknown. The table was then left half-updated. | Code review while writing `Standings`. | Both participants are validated before anything is changed. A regression test was added. |
| A test for `Round` passed without testing what it claimed: a misplaced parenthesis, `new Round(1.5, [], RangeError)`, meant that `assert.throws` only checked that *some* error was thrown. | Code review of the test file. | Fixed in a separate commit so that the test now checks for `RangeError`. |

## Known limitations (not tested because not supported)

- Head-to-head results as a tie-breaker in `Standings`.
- Double round-robin, group stages and double elimination.
