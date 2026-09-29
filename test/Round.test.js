import { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { Round } from '../src/Round.js'
import { Match } from '../src/Match.js'
import { Participant } from '../src/Participant.js'

describe('Round', () => {
  let aik
  let ifk
  let djurgarden
  let hammarby

  beforeEach(() => {
    aik = new Participant('AIK')
    ifk = new Participant('IFK')
    djurgarden = new Participant('Djurgården')
    hammarby = new Participant('Hammarby')
  })

  it('stores its number and matches', () => {
    const match = new Match(aik, ifk)
    const round = new Round(1, [match])

    assert.equal(round.getNumber(), 1)
    assert.deepEqual(round.getMatches(), [match])
  })

  it('has no bye participants by default', () => {
    const round = new Round(1, [new Match(aik, ifk)])

    assert.deepEqual(round.getParticipantsWithBye(), [])
  })

  it('stores the given bye participants', () => {
    const round = new Round(1, [new Match(aik, ifk)], [hammarby])

    assert.deepEqual(round.getParticipantsWithBye(), [hammarby])
  })

  it('is complete only when every match has been played', () => {
    const firstMatch = new Match(aik, ifk)
    const secondMatch = new Match(djurgarden, hammarby)
    const round = new Round(1, [firstMatch, secondMatch])

    firstMatch.recordResult(1, 0)
    assert.equal(round.isComplete(), false)

    secondMatch.recordResult(2, 2)
    assert.equal(round.isComplete(), true)
  })

  it('returns a copy so the internal match list cannot be changed', () => {
    const round = new Round(1, [new Match(aik, ifk)])

    round.getMatches().push(new Match(djurgarden, hammarby))

    assert.equal(round.getMatches().length, 1)
  })

  it('throws RangeError when the number is not a positive integer', () => {
    assert.throws(() => new Round(0, []), RangeError)
    assert.throws(() => new Round(1.5, [], RangeError))
  })
})
