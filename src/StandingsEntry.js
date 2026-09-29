import { Participant } from './Participant.js'

/**
 * One participant's row in the standings table.
 */
export class StandingsEntry {
  #participant
  #wins = 0
  #draws = 0
  #losses = 0
  #scored = 0
  #conceded = 0
  #points = 0

  /**
   * @param {Participant} participant - The participant this entry belongs to.
   */
  constructor(participant) {
    this.#participant = participant
  }

  /**
   * @returns {Participant} The participant this entry belongs to.
   */
  getParticipant() {
    return this.#participant
  }

  /**
   * @returns {number} The number of matches played.
   */
  getPlayed() {
    return this.#wins + this.#draws + this.#losses
  }

  /**
   * @returns {number} The number of matches won.
   */
  getWins() {
    return this.#wins
  }

  /**
   * @returns {number} The number of matches ending in a draw.
   */
  getDraws() {
    return this.#draws
  }

  /**
   * @returns {number} The number of matches lost.
   */
  getLosses() {
    return this.#losses
  }

  /**
   * @returns {number} The total score made by this participant.
   */
  getScored() {
    return this.#scored
  }

  /**
   * @returns {number} The total score made against this participant.
   */
  getConceded() {
    return this.#conceded
  }

  /**
   * @returns {number} Scored minus conceded.
   */
  getScoreDifference() {
    return this.#scored - this.#conceded
  }

  /**
   * @returns {number} The total table points.
   */
  getPoints() {
    return this.#points
  }

  /**
   * Adds the outcome of one played match, seen from this participant's side.
   *
   * @param {number} scored - Score made by this participant in the match.
   * @param {number} conceded - Score made by the opponent in the match.
   * @param {number} earnedPoints - Table points awarded for the match.
   */
  recordMatch(scored, conceded, earnedPoints) {
    this.#scored += scored
    this.#conceded += conceded
    this.#points += earnedPoints
    this.#countOutcome(scored, conceded)
  }

  #countOutcome(scored, conceded) {
    if (scored > conceded) {
      this.#wins++
    } else if (scored < conceded) {
      this.#losses++
    } else {
      this.#draws++
    }
  }
}
