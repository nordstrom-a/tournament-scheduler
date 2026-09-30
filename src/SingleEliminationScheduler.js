import { Match } from './Match.js'
import { Participant } from './Participant.js'
import { Round } from './Round.js'

/**
 * Creates a knockout bracket where the loser of each match is eliminated.
 */
export class SingleEliminationScheduler {
  #slots = []
  #roundNumber = 0

  /**
   * @param {Participant[]} participants - At least two participants. Seeded participants are placed by seed,
   * unseeded ones fill the remaining positions in the given order.
   * @returns {Round} The first round of the bracket.
   * @throws {RangeError} If there are fewer than two participants.
   */
  createFirstRound(participants) {
    this.#assertEnoughParticipants(participants)
    const orderedParticipants = this.#orderBySeed(participants)
    const seedOrder = this.#createSeedOrder(this.#calculateBracketSize(participants.length))
    this.#slots = []

    for (let index = 0; index < seedOrder.length; index += 2) {
      const home = orderedParticipants[seedOrder[index] - 1]
      const away = orderedParticipants[seedOrder[index + 1] - 1]
      this.#slots.push(away === undefined ? home : new Match(home, away))
    }
    this.#roundNumber = 1
    return this.#createRoundFromSlots()
  }

  #orderBySeed(participants) {
    const seeded = participants
      .filter(participant => participant.isSeeded())
      .sort((first, second) => first.getSeed() - second.getSeed())
    const unseeded = participants.filter(participant => !participant.isSeeded())
    return [...seeded, ...unseeded]
  }

  #calculateBracketSize(participantCount) {
    let bracketSize = 2
    while (bracketSize < participantCount) {
      bracketSize *= 2
    }
    return bracketSize
  }

  #createSeedOrder(bracketSize) {
    let seedOrder = [1]
    while (seedOrder.length < bracketSize) {
      const seedSum = seedOrder.length * 2 + 1
      seedOrder = seedOrder.flatMap(seed => [seed, seedSum - seed])
    }
    return seedOrder
  }

  #createRoundFromSlots() {
    const matches = this.#slots.filter(slot => slot instanceof Match)
    const participantsWithBye = this.#slots.filter(slot => slot instanceof Participant)
    return new Round(this.#roundNumber, matches, participantsWithBye)
  }

  #assertEnoughParticipants(participants) {
    if (participants.length < 2) {
      throw new RangeError('A single-elimination bracket needs at least two participants')
    }
  }
}
