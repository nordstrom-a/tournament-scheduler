import { Match } from './Match.js'
import { Participant } from './Participant.js'
import { Round } from './Round.js'

/**
 * Creates a knockout bracket where the loser of each match is eliminated.
 */
export class SingleEliminationScheduler {
  /**
   * @param {Participant[]} participants - At least two participants. Seeded participants are placed by seed,
   * unseeded ones fill the remaining positions in the given order.
   * @returns {Round} The first round of the bracket.
   * @throws {RangeError} If there are fewer than two participants.
   */
  createFirstRound(participants) {
    this.#assertEnoughParticipants(participants)
    const orderedParticipants = this.#orderBySeed(participants)
    const seedOrder = this.#createSeedOrder(participants.length)
    const matches = []

    for (let index = 0; index < seedOrder.length; index += 2) {
      const home = orderedParticipants[seedOrder[index] - 1]
      const away = orderedParticipants[seedOrder[index + 1] - 1]
      matches.push(new Match(home, away))
    }
    return new Round(1, matches)
  }

  #orderBySeed(participants) {
    const seeded = participants
      .filter(participant => participant.isSeeded())
      .sort((first, second) => first.getSeed() - second.getSeed())
    const unseeded = participants.filter(participant => !participant.isSeeded())
    return [...seeded, ...unseeded]
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
