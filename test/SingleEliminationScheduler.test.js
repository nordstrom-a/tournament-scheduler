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

function letHomeParticipantsWin(round) {
  for (const match of round.getMatches()) {
    match.recordResult(1, 0)
  }
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

  describe('createNextRound', () => {
    it('pairs first round winners with the participants who had a bye', () => {
      const scheduler = new SingleEliminationScheduler()
      letHomeParticipantsWin(scheduler.createFirstRound(createSeededParticipants(6)))

      const secondRound = scheduler.createNextRound()

      assert.deepEqual(getPairings(secondRound), ['Seed 1 vs Seed 4', 'Seed 2 vs Seed 3'])
      assert.deepEqual(getByeNames(secondRound), [])
    })

    it('numbers the round consecutively', () => {
      const scheduler = new SingleEliminationScheduler()
      letHomeParticipantsWin(scheduler.createFirstRound(createSeededParticipants(4)))

      assert.equal(scheduler.createNextRound().getNumber(), 2)
    })

    it('reaches a single-match final after three rounds with eight participants', () => {
      const scheduler = new SingleEliminationScheduler()
      let round = scheduler.createFirstRound(createSeededParticipants(8))

      while (round.getMatches().length > 1) {
        letHomeParticipantsWin(round)
        round = scheduler.createNextRound()
      }

      assert.equal(round.getNumber(), 3)
      assert.deepEqual(getPairings(round), ['Seed 1 vs Seed 2'])
    })

    it('throws when no first round has been created', () => {
      assert.throws(() => new SingleEliminationScheduler().createNextRound(), Error)
    })

    it('throws when a match in the current round is not played', () => {
      const scheduler = new SingleEliminationScheduler()
      scheduler.createFirstRound(createSeededParticipants(4))

      assert.throws(() => scheduler.createNextRound(), Error)
    })

    it('throws when a match in the current round is a draw', () => {
      const scheduler = new SingleEliminationScheduler()
      const firstRound = scheduler.createFirstRound(createSeededParticipants(2))
      firstRound.getMatches()[0].recordResult(1, 1)

      assert.throws(() => scheduler.createNextRound(), Error)
    })

    it('throws when the final has already been created', () => {
      const scheduler = new SingleEliminationScheduler()
      letHomeParticipantsWin(scheduler.createFirstRound(createSeededParticipants(2)))

      assert.throws(() => scheduler.createNextRound(), Error)
    })
  })
})
