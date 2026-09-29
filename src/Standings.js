import { Match } from './Match.js'
import { Participant } from './Participant.js'
import { StandingsEntry } from './StandingsEntry.js'

/**
 * A league table built from played matches.
 */
export class Standings {
  #entries = new Map()
  #pointsForWin
  #pointsForDraw
  #pointsForLoss

  /**
   * @param {Participant[]} participants - The participants included in the table.
   * @param {object} [pointSystem] - Table points awarded per match outcome.
   * @param {number} [pointSystem.win=3] - Points for a win.
   * @param {number} [pointSystem.draw=1] - Points for a draw.
   * @param {number} [pointSystem.loss=0] - Points for a loss.
   */
  constructor(participants, { win = 3, draw = 1, loss = 0 } = {}) {
    this.#pointsForWin = win
    this.#pointsForDraw = draw
    this.#pointsForLoss = loss
    for (const participant of participants) {
      this.#entries.set(participant, new StandingsEntry(participant))
    }
  }

  /**
   * Adds a played match to the table.
   *
   * @param {Match} match - A match that has been played.
   * @throws {Error} If the match is not played or involves an unknown participant.
   */
  recordMatch(match) {
    this.#assertRecordable(match)
    this.#recordForParticipant(match, match.getHomeParticipant(), match.getHomeScore(), match.getAwayScore())
    this.#recordForParticipant(match, match.getAwayParticipant(), match.getAwayScore(), match.getHomeScore())
  }

  /**
   * Entries are ordered by points, then score difference, then total scored
   * and finally by name so the order is always predictable.
   *
   * @returns {StandingsEntry[]} One entry per participant, best placed first.
   */
  getEntries() {
    return [...this.#entries.values()].sort((first, second) => this.#compareEntries(first, second))
  }

  #assertRecordable(match) {
    if (!match.isPlayed()) {
      throw new Error('Only played matches can be added to the standings')
    }
    for (const participant of [match.getHomeParticipant(), match.getAwayParticipant()]) {
      if (!this.#entries.has(participant)) {
        throw new Error(`${participant.getName()} is not part of these standings`)
      }
    }
  }

  #recordForParticipant(match, participant, scored, conceded) {
    const entry = this.#entries.get(participant)
    entry.recordMatch(scored, conceded, this.#pointsFor(match, participant))
  }

  #pointsFor(match, participant) {
    if (match.isDraw()) {
      return this.#pointsForDraw
    }
    if (match.getWinner() === participant) {
      return this.#pointsForWin
    }
    return this.#pointsForLoss
  }

  #compareEntries(first, second) {
    return second.getPoints() - first.getPoints() ||
      second.getScoreDifference() - first.getScoreDifference() ||
      second.getScored() - first.getScored() ||
      first.getParticipant().getName().localeCompare(second.getParticipant().getName())
  }
}
