import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { RoundRobinScheduler } from '../src/RoundRobinScheduler.js'
import { Participant } from '../src/Participant.js'

function createParticipants(count) {
  const participants = []
  for (let number = 1; number <= count; number++) {
    participants.push(new Participant(`Team ${number}`))
  }
  return participants
}

function getAllMatches(rounds) {
  return rounds.flatMap(round => round.getMatches())
}

function toPairingKey(match) {
  const names = [match.getHomeParticipant().getName(), match.getAwayParticipant().getName()]
  return names.sort().join(' vs ')
}

describe('RoundRobinScheduler', () => {
  describe('with an even number of participants', () => {
    it('creates n - 1 rounds with n / 2 matches each', () => {
      const rounds = new RoundRobinScheduler().createRounds(createParticipants(6))

      assert.equal(rounds.length, 5)
      for (const round of rounds) {
        assert.equal(round.getMatches().length, 3)
      }
    })

    it('pairs every participant with every other participant exactly once', () => {
      const rounds = new RoundRobinScheduler().createRounds(createParticipants(6))
      const pairingKeys = getAllMatches(rounds).map(toPairingKey)

      assert.equal(pairingKeys.length, 15)
      assert.equal(new Set(pairingKeys).size, 15)
    })

    it('lets each participant play at most once per round', () => {
      const rounds = new RoundRobinScheduler().createRounds(createParticipants(6))

      for (const round of rounds) {
        const playing = round.getMatches().flatMap(match => [match.getHomeParticipant(), match.getAwayParticipant()])
        assert.equal(new Set(playing).size, playing.length)
      }
    })

    it('numbers the rounds from 1 upwards', () => {
      const rounds = new RoundRobinScheduler().createRounds(createParticipants(4))

      assert.deepEqual(rounds.map(round => round.getNumber()), [1, 2, 3])
    })
  })

  describe('with an odd number of participants', () => {
    it('creates n rounds with one bye each', () => {
      const rounds = new RoundRobinScheduler().createRounds(createParticipants(5))

      assert.equal(rounds.length, 5)
      for (const round of rounds) {
        assert.equal(round.getMatches().length, 2)
        assert.equal(round.getParticipantsWithBye().length, 1)
      }
    })

    it('gives every participant exactly one bye', () => {
      const participants = createParticipants(5)
      const rounds = new RoundRobinScheduler().createRounds(participants)
      const participantsWithBye = rounds.flatMap(round => round.getParticipantsWithBye())

      assert.equal(new Set(participantsWithBye).size, participants.length)
    })

    it('pairs every participant with every other participant exactly once', () => {
      const rounds = new RoundRobinScheduler().createRounds(createParticipants(5))
      const pairingKeys = getAllMatches(rounds).map(toPairingKey)

      assert.equal(pairingKeys.length, 10)
      assert.equal(new Set(pairingKeys).size, 10)
    })
  })

  it('does not change the order of the given participant array', () => {
    const participants = createParticipants(4)
    const originalOrder = [...participants]

    new RoundRobinScheduler().createRounds(participants)

    assert.deepEqual(participants, originalOrder)
  })

  it('throws RangeError with fewer than two participants', () => {
    assert.throws(() => new RoundRobinScheduler().createRounds(createParticipants(1)), RangeError)
  })
})
