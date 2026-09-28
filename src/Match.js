import { Participant } from './Participant.js'

/**
 * A single match between two participants.
 */
export class Match {
  #homeParticipant
  #awayParticipant

  /**
   * @param {Participant} homeParticipant - The participant listed first.
   * @param {Participant} awayParticipant - The participant listed second.
   * @throws {TypeError} If either argument is not a Participant.
   * @throws {Error} If both arguments are the same participant.
   */
  constructor(homeParticipant, awayParticipant) {
    this.#assertIsParticipant(homeParticipant)
    this.#assertIsParticipant(awayParticipant)
    this.#assertDifferentParticipants(homeParticipant, awayParticipant)
    this.#homeParticipant = homeParticipant
    this.#awayParticipant = awayParticipant
  }

  /**
   * @returns {Participant} The home participant.
   */
  getHomeParticipant() {
    return this.#homeParticipant
  }

  /**
   * @returns {Participant} The away participant.
   */
  getAwayParticipant() {
    return this.#awayParticipant
  }

  #assertIsParticipant(participant) {
    if (!(participant instanceof Participant)) {
      throw new TypeError('Match requires two Participant instances')
    }
  }

  #assertDifferentParticipants(homeParticipant, awayParticipant) {
    if (homeParticipant === awayParticipant) {
      throw new Error('A participant cannot play against itself')
    }
  }
}
