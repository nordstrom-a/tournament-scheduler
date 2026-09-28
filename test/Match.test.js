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
})
