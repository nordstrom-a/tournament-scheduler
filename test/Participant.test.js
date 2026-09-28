import {describe, it } from 'node:test'
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
})