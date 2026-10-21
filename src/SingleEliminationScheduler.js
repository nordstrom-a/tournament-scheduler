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
    this.#slots = this.#createFirstRoundSlots(this.#orderBySeed(participants))
    this.#roundNumber = 1
    return this.#createRoundFromSlots()
  }

  /**
   * Creates the next round by pairing the winners and bye participants of the current round.
   *
   * @returns {Round} The next round.
   * @throws {Error} If no first round exists, the final is already created,
   * or a match in the current round is unplayed or drawn.
   */
  createNextRound() {
    this.#assertCanCreateNextRound()
    const advancing = this.#slots.map(slot => this.#getAdvancingParticipant(slot))
    this.#slots = []

    for (let index = 0; index < advancing.length; index += 2) {
      this.#slots.push(new Match(advancing[index], advancing[index + 1]))
    }
    this.#roundNumber++
    return this.#createRoundFromSlots()
  }

  /**
   * @returns {boolean} True if the final has been played and has a winner.
   */
  isComplete() {
    if (!this.#isFinalCreated()) {
      return false
    }
    const [final] = this.#slots
    return final.isPlayed() && !final.isDraw()
  }

  /**
   * @returns {Participant|null} The winner of the final, or null if the bracket is not complete.
   */
  getChampion() {
    if (!this.isComplete()) {
      return null
    }
    const [final] = this.#slots
    return final.getWinner()
  }

  #createFirstRoundSlots(orderedParticipants) {
    const seedOrder = this.#createSeedOrder(this.#calculateBracketSize(orderedParticipants.length))
    const slots = []
    for (let index = 0; index < seedOrder.length; index += 2) {
      const home = this.#participantWithSeed(orderedParticipants, seedOrder[index])
      const away = this.#participantWithSeed(orderedParticipants, seedOrder[index + 1])
      slots.push(this.#createSlot(home, away))
    }
    return slots
  }

  #participantWithSeed(orderedParticipants, seed) {
    const index = seed - 1
    return orderedParticipants[index]
  }

  #createSlot(home, away) {
    const awayIsMissing = away === undefined
    return awayIsMissing ? home : new Match(home, away)
  }

  #isFinalCreated() {
    return this.#roundNumber > 0 && this.#slots.length === 1
  }

  #assertCanCreateNextRound() {
    if (this.#roundNumber === 0) {
      throw new Error('The first round must be created before the next one')
    }
    if (this.#isFinalCreated()) {
      throw new Error('The final has already been created')
    }
  }

  #getAdvancingParticipant(slot) {
    if (slot instanceof Participant) {
      return slot
    }
    if (!slot.isPlayed()) {
      throw new Error('All matches must be played before the next round is created')
    }
    if (slot.isDraw()) {
      throw new Error('An elimination match cannot end in a draw')
    }
    return slot.getWinner()
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
