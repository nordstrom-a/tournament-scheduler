import { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { Standings } from '../src/Standings.js'
import { Match } from '../src/Match.js'
import { Participant } from '../src/Participant.js'

function createPlayedMatch(home, away, homeScore, awayScore) {
  const match = new Match(home, away)
  match.recordResult(homeScore, awayScore)
  return match
}

function getNames(standings) {
  return standings.getEntries().map(entry => entry.getParticipant().getName())
}

describe('Standings', () => {
  let aik
  let ifk
  let djurgarden

  beforeEach(() => {
    aik = new Participant('AIK')
    ifk = new Participant('IFK')
    djurgarden = new Participant('Djurgården')
  })

  it('has one entry per participant', () => {
    const standings = new Standings([aik, ifk, djurgarden])

    assert.equal(standings.getEntries().length, 3)
  })

  it('awards 3 points for a win, 1 for a draw and 0 for a loss by default', () => {
    const standings = new Standings([aik, ifk, djurgarden])

    standings.recordMatch(createPlayedMatch(aik, ifk, 2, 0))
    standings.recordMatch(createPlayedMatch(ifk, djurgarden, 1, 1))

    const [first, second, third] = standings.getEntries()
    assert.equal(first.getPoints(), 3)
    assert.equal(second.getPoints(), 1)
    assert.equal(third.getPoints(), 1)
  })

  it('uses a custom point system when given', () => {
    const standings = new Standings([aik, ifk], { win: 2 })

    standings.recordMatch(createPlayedMatch(aik, ifk, 1, 0))

    assert.equal(standings.getEntries()[0].getPoints(), 2)
  })

  it('orders entries by points first', () => {
    const standings = new Standings([aik, ifk, djurgarden])

    standings.recordMatch(createPlayedMatch(djurgarden, aik, 1, 0))
    standings.recordMatch(createPlayedMatch(ifk, aik, 1, 1))

    assert.deepEqual(getNames(standings), ['Djurgården', 'IFK', 'AIK'])
  })

  it('breaks a points tie by score difference', () => {
    const standings = new Standings([aik, ifk, djurgarden])

    standings.recordMatch(createPlayedMatch(aik, djurgarden, 1, 0))
    standings.recordMatch(createPlayedMatch(ifk, djurgarden, 3, 0))

    assert.deepEqual(getNames(standings), ['IFK', 'AIK', 'Djurgården'])
  })

  it('breaks a score difference tie by total scored', () => {
    const standings = new Standings([aik, ifk, djurgarden])

    standings.recordMatch(createPlayedMatch(aik, djurgarden, 1, 0))
    standings.recordMatch(createPlayedMatch(ifk, djurgarden, 3, 2))

    assert.deepEqual(getNames(standings), ['IFK', 'AIK', 'Djurgården'])
  })

  it('orders fully tied entries alphabetically by name', () => {
    const standings = new Standings([ifk, djurgarden, aik])

    assert.deepEqual(getNames(standings), ['AIK', 'Djurgården', 'IFK'])
  })

  it('throws when recording a match that has not been played', () => {
    const standings = new Standings([aik, ifk])

    assert.throws(() => standings.recordMatch(new Match(aik, ifk)), Error)
  })

  it('leaves the table unchanged when a participant is unknown', () => {
    const standings = new Standings([aik, ifk])
    const outsider = new Participant('Outsider')

    assert.throws(() => standings.recordMatch(createPlayedMatch(aik, outsider, 1, 0)), Error)
    assert.equal(standings.getEntries()[0].getPlayed(), 0)
  })
})
