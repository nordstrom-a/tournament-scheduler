import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { SingleEliminationScheduler } from '../src/SingleEliminationScheduler.js'
import { Participant } from '../src/Participant.js'

function createSeededParticipants(count) {
  const participants = []
  for (let seed = 1; seed <= count; seed++) {
    participants.push(new Participant(`Seed ${seed}`, seed))
  }
  return participants
}

function getPairings(round) {
  return round.getMatches().map(match =>
    `${match.getHomeParticipant().getName()} vs ${match.getAwayParticipant().getName()}`)
}

function getByeNames(round) {
  return round.getParticipantsWithBye().map(participant => participant.getName())
}

describe('SingleEliminationScheduler', () => {
  describe('createFirstRound', () => {
    it('pairs eight seeds so the top two can only meet in the final', () => {
      const round = new SingleEliminationScheduler().createFirstRound(createSeededParticipants(8))

      assert.deepEqual(getPairings(round), [
        'Seed 1 vs Seed 8',
        'Seed 4 vs Seed 5',
        'Seed 2 vs Seed 7',
        'Seed 3 vs Seed 6'
      ])
    })

    it('creates a single match for two participants', () => {
      const round = new SingleEliminationScheduler().createFirstRound(createSeededParticipants(2))

      assert.deepEqual(getPairings(round), ['Seed 1 vs Seed 2'])
    })

    it('places participants by seed regardless of array order', () => {
      const participants = createSeededParticipants(4).reverse()

      const round = new SingleEliminationScheduler().createFirstRound(participants)

      assert.deepEqual(getPairings(round), ['Seed 1 vs Seed 4', 'Seed 2 vs Seed 3'])
    })

    it('places unseeded participants after the seeded ones', () => {
      const participants = [new Participant('Unseeded'), new Participant('Top', 1)]

      const round = new SingleEliminationScheduler().createFirstRound(participants)

      assert.deepEqual(getPairings(round), ['Top vs Unseeded'])
    })

    it('gives byes to the top two seeds with six participants', () => {
      const round = new SingleEliminationScheduler().createFirstRound(createSeededParticipants(6))

      assert.deepEqual(getByeNames(round), ['Seed 1', 'Seed 2'])
      assert.deepEqual(getPairings(round), ['Seed 4 vs Seed 5', 'Seed 3 vs Seed 6'])
    })

    it('gives byes to the top three seeds with five participants', () => {
      const round = new SingleEliminationScheduler().createFirstRound(createSeededParticipants(5))

      assert.deepEqual(getByeNames(round), ['Seed 1', 'Seed 2', 'Seed 3'])
      assert.deepEqual(getPairings(round), ['Seed 4 vs Seed 5'])
    })

    it('throws RangeError with fewer than two participants', () => {
      assert.throws(() => new SingleEliminationScheduler().createFirstRound(createSeededParticipants(1)), RangeError)
    })
  })
})
