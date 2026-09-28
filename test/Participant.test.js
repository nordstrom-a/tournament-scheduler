import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { Participant } from '../src/Participant.js'

describe('Participant', () => {
  it('stores the given name', () => {
    const participant = new Participant('AIK')

    assert.equal(participant.getName(), 'AIK')
  })

  it('trims surrounding whitespace from the name', () => {
    const participant = new Participant('  IFK  ')

    assert.equal(participant.getName(), 'IFK')
  })

  it('throws TypeError when the name is empty', () => {
    assert.throws(() => new Participant('  '), TypeError)
  })

  it('throws TypeError when the name is not a string', () => {
    assert.throws(() => new Participant(67), TypeError)
  })

  it('is unseeded by default', () => {
    const participant = new Participant('AIK')

    assert.equal(participant.getSeed(), null)
    assert.equal(participant.isSeeded(), false)
  })

  it('stores the given seed', () => {
    const participant = new Participant('AIK', 3)

    assert.equal(participant.getSeed(), 3)
    assert.equal(participant.isSeeded(), true)
  })

  it('throws RangeError when the seed is zero or negative', () => {
    assert.throws(() => new Participant('AIK', 0), RangeError)
    assert.throws(() => new Participant('AIK', -2), RangeError)
  })

  it('throws RangeError when the seed is not an integer', () => {
    assert.throws(() => new Participant('AIK', 1.5), RangeError)
    assert.throws(() => new Participant('AIK', '1'), RangeError)
  })
})
