import { Participant } from './Participant.js'

/**
 * A single match between two participants.
 */
export class Match {
  #homeParticipant
  #awayParticipant
  #homeScore = null
  #awayScore = null

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

  /**
   * @returns {number|null} The home score, or null if the match is not played.
   */
  getHomeScore() {
    return this.#homeScore
  }

  /**
   * @returns {number|null} The away score, or null if the match is not played.
   */
  getAwayScore() {
    return this.#awayScore
  }

  /**
   * @returns {boolean} True if a result has been recorded.
   */
  isPlayed() {
    return this.#homeScore !== null
  }

  /**
   * Records the final score. Calling it again overwrites the previous result.
   * 
   * @param {number} homeScore - Non-negative integer.
   * @param {number} awayScore - Non-negative integer.
   * @throws {RangeError} If a score is not a non-negative integer.
   */
  recordResult(homeScore, awayScore) {
    this.#assertValidScore(homeScore)
    this.#assertValidScore(awayScore)
    this.#homeScore = homeScore
    this.#awayScore = awayScore
  }

  /**
   * @returns {boolean} True if the match is played and both scores are equal.
   */
  isDraw() {
    return this.isPlayed() && this.#homeScore === this.#awayScore
  }

  /**
   * @returns {Participant|null} The winner, or null if the match was a draw.
   * @throws {Error} If the match has not been played.
   */
  getWinner() {
    this.#assertPlayed()
    if (this.isDraw()) {
      return null
    }
    return this.#homeScore > this.#awayScore ? this.#homeParticipant : this.#awayParticipant
  }

  /**
   * @returns {Participant|null} The loser, or null if the match was a draw.
   * @throws {Error} If the match has not been played.
   */
  getLoser() {
    const winner = this.getWinner()
    if (winner === null) {
      return null
    }
    return winner === this.#homeParticipant ? this.#awayParticipant : this.#homeParticipant
  }

  /**
   * @param {Participant} participant - The home or the away participant.
   * @returns {number} The score made by the participant.
   * @throws {Error} If the match has not been played or the participant does not take part in it.
   */
  getScoreFor(participant) {
    this.#assertPlayed()
    this.#assertTakesPart(participant)
    return participant === this.#homeParticipant ? this.#homeScore : this.#awayScore
  }

  /**
   * @param {Participant} participant - The home or the away participant.
   * @returns {number} The score made by the participant's opponent.
   * @throws {Error} If the match has not been played or the participant does not take part in it.
   */
  getScoreAgainst(participant) {
    this.#assertTakesPart(participant)
    const opponent = participant === this.#homeParticipant ? this.#awayParticipant : this.#homeParticipant
    return this.getScoreFor(opponent)
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

  #assertValidScore(score) {
    if (!Number.isInteger(score) || score < 0) {
      throw new RangeError('Score must be a non-negative integer')
    }
  }

  #assertPlayed() {
    if (!this.isPlayed()) {
      throw new Error('Match has not been played yet')
    }
  }

  #assertTakesPart(participant) {
    if (participant !== this.#homeParticipant && participant !== this.#awayParticipant) {
      throw new Error('The participant does not take part in this match')
    }
  }
}
