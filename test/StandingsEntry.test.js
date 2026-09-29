import { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { StandingsEntry } from '../src/StandingsEntry.js'
import { Participant } from '../src/Participant.js'

describe('StandingsEntry', () => {
  let aik
  let entry

  beforeEach(() => {
    aik = new Participant('AIK')
    entry = new StandingsEntry(aik)
  })

  it('starts with all values at zero', () => {
    assert.equal(entry.getParticipant(), aik)
    assert.equal(entry.getPlayed(), 0)
    assert.equal(entry.getPoints(), 0)
    assert.equal(entry.getScoreDifference(), 0)
  })

  it('counts a win when scoring more than conceding', () => {
    entry.recordMatch(3, 1, 3)

    assert.equal(entry.getWins(), 1)
    assert.equal(entry.getDraws(), 0)
    assert.equal(entry.getLosses(), 0)
  })

  it('counts a draw when scoring the same as conceding', () => {
    entry.recordMatch(2, 2, 1)

    assert.equal(entry.getDraws(), 1)
  })

  it('counts a loss when conceding more than scoring', () => {
    entry.recordMatch(0, 1, 0)

    assert.equal(entry.getLosses(), 1)
  })

  it('accumulates played, scored, conceded, difference and points over several matches', () => {
    entry.recordMatch(3, 1, 3)
    entry.recordMatch(2, 2, 1)
    entry.recordMatch(0, 1, 0)

    assert.equal(entry.getPlayed(), 3)
    assert.equal(entry.getScored(), 5)
    assert.equal(entry.getConceded(), 4)
    assert.equal(entry.getScoreDifference(), 1)
    assert.equal(entry.getPoints(), 4)
  })
})
