import { Match } from './Match.js'

/**
 * A group of matches played in the same stage of a tournament.
 */
export class Round {
  #number
  #matches

  /**
   * @param {number} number - The round's position in the schedule, starting at 1.
   * @param {Match[]} matches - The matches played in this round.
   * @throws {RangeError} If the number is not a positive integer.
   */
  constructor(number, matches) {
    this.#assertValidNumber(number)
    this.#number = number
    this.#matches = [...matches]
  }

  /**
   * @returns {number} The round's position in the schedule, starting at 1.
   */
  getNumber() {
    return this.#number
  }

  /**
   * @returns {Match[]} A copy of the matches in this round.
   */
  getMatches() {
    return [...this.#matches]
  }

  /**
   * @returns {boolean} True if every match in the round has been played.
   */
  isComplete() {
    return this.#matches.every(match => match.isPlayed())
  }

  #assertValidNumber(number) {
    if (!Number.isInteger(number) || number < 1) {
      throw new RangeError('Round number must be a positive integer')
    }
  }
}
