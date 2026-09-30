import { Match } from './Match.js'
import { Participant } from './Participant.js'
import { Round } from './Round.js'

/**
 * Creates a knockout bracket where the loser of each match is eliminated.
 */
export class SingleEliminationScheduler {
  /**
   * @param {Participant[]} participants - At least two participants, listed from highest to lowest seed.
   * @returns {Round} The first round of the bracket.
   * @throws {RangeError} If there are fewer than two participants.
   */
  createFirstRound(participants) {
    this.#assertEnoughParticipants(participants)
    const seedOrder = this.#createSeedOrder(participants.length)
    const matches = []

    for (let index = 0; index < seedOrder.length; index += 2) {
      const home = participants[seedOrder[index] - 1]
      const away = participants[seedOrder[index + 1] - 1]
      matches.push(new Match(home, away))
    }
    return new Round(1, matches)
  }

  #createSeedOrder(bracketSize) {
    let seedOrder = [1]
    while (seedOrder.length < bracketSize) {
      const seedSum = seedOrder.length * 2 + 1
      seedOrder = seedOrder.flatMap(seed => [seed, seedSum - seed])
    }
    return seedOrder
  }

  #assertEnoughParticipants(participants) {
    if (participants.length < 2) {
      throw new RangeError('A single-elimination bracket needs at least two participants')
    }
  }
}
