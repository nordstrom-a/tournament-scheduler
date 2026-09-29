import { Match } from './Match.js'
import { Participant } from './Participant.js'

/**
 * A group of matches played in the same stage of a tournament.
 */
export class Round {
  #number
  #matches
  #participantsWithBye

  /**
   * @param {number} number - The round's position in the schedule, starting at 1.
   * @param {Match[]} matches - The matches played in this round.
   * @param {Participant[]} [participantsWithBye=[]] - Participants who do not play this round.
   * @throws {RangeError} If the number is not a positive integer.
   */
  constructor(number, matches, participantsWithBye = []) {
    this.#assertValidNumber(number)
    this.#number = number
    this.#matches = [...matches]
    this.#participantsWithBye = [...participantsWithBye]
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
   * @returns {Participant[]} A copy of the participants who do not play this round.
   */
  getParticipantsWithBye() {
    return [...this.#participantsWithBye]
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
