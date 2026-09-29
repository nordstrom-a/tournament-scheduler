import { Match } from './Match.js'
import { Participant } from './Participant.js'
import { StandingsEntry } from './StandingsEntry.js'

/**
 * A league table built from played matches.
 */
export class Standings {
  #entries = new Map()
  #pointsForWin = 3
  #pointsForDraw = 1
  #pointsForLoss = 0

  /**
   * @param {Participant[]} participants - The participants included in the table.
   */
  constructor(participants) {
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
   * @returns {StandingsEntry[]} One entry per participant.
   */
  getEntries() {
    return [...this.#entries.values()]
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
}
