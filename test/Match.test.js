import { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { Match } from '../src/Match.js'
import { Participant } from '../src/Participant.js'

describe('Match', () => {
  let aik
  let ifk

  beforeEach(() => {
    aik = new Participant('AIK')
    ifk = new Participant('IFK')
  })

  it('stores home and away participants', () => {
    const match = new Match(aik, ifk)

    assert.equal(match.getHomeParticipant(), aik)
    assert.equal(match.getAwayParticipant(), ifk)
  })

  it('throws TypeError when a participant is not a Participant', () => {
    assert.throws(() => new Match(aik, 'IFK'), TypeError)
  })

  it('throws when a participant plays against itself', () => {
    assert.throws(() => new Match(aik, aik), Error)
  })

  it('is not played and has no scores when created', () => {
    const match = new Match(aik, ifk)

    assert.equal(match.isPlayed(), false)
    assert.equal(match.getHomeScore(), null)
    assert.equal(match.getAwayScore(), null)
  })

  it('stores a recorded result and becomes played', () => {
    const match = new Match(aik, ifk)

    match.recordResult(2, 1)

    assert.equal(match.isPlayed(), true)
    assert.equal(match.getHomeScore(), 2)
    assert.equal(match.getAwayScore(), 1)
  })

  it('overwrites the result when recorded again', () => {
    const match = new Match(aik, ifk)

    match.recordResult(2, 1)
    match.recordResult(0, 0)

    assert.equal(match.getHomeScore(), 0)
    assert.equal(match.getAwayScore(), 0)
  })

  it('throws RangeError for negative or non-integer scores', () => {
    const match = new Match(aik, ifk)

    assert.throws(() => match.recordResult(-1, 0), RangeError)
    assert.throws(() => match.recordResult(1.5, 0), RangeError)
  })

  it('returns the home participant as winner when home scores more', () => {
    const match = new Match(aik, ifk)

    match.recordResult(3, 1)

    assert.equal(match.getWinner(), aik)
    assert.equal(match.getLoser(), ifk)
  })

  it('returns the away participant as winner when away scores more', () => {
    const match = new Match(aik, ifk)

    match.recordResult(0, 2)

    assert.equal(match.getWinner(), ifk)
    assert.equal(match.getLoser(), aik)
  })

  it('is a draw with no winner or loser when scores are equal', () => {
    const match = new Match(aik, ifk)

    match.recordResult(1, 1)

    assert.equal(match.isDraw(), true)
    assert.equal(match.getWinner(), null)
    assert.equal(match.getLoser(), null)
  })

  it('is not a draw before it has been played', () => {
    const match = new Match(aik, ifk)

    assert.equal(match.isDraw(), false)
  })

  it('throws when asking for winner or loser before it has been played', () => {
    const match = new Match(aik, ifk)

    assert.throws(() => match.getWinner(), Error)
    assert.throws(() => match.getLoser(), Error)
  })
})
