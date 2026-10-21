import { Match } from './Match.js'
import { Round } from './Round.js'

/** @typedef {import('./Participant.js').Participant} Participant */

/**
 * Creates a schedule where every participant meets every other participant once, using the circle method.
 */
export class RoundRobinScheduler {
  /**
   * With an odd number of participants, one participant has a bye in each round.
   *
   * @param {Participant[]} participants - At least two participants.
   * @returns {Round[]} The rounds in the order they should be played.
   * @throws {RangeError} If there are fewer than two participants.
   */
  createRounds(participants) {
    this.#assertEnoughParticipants(participants)
    let rotation = this.#createRotation(participants)
    const roundCount = rotation.length - 1
    const rounds = []

    for (let roundNumber = 1; roundNumber <= roundCount; roundNumber++) {
      rounds.push(this.#createRound(roundNumber, rotation))
      rotation = this.#rotate(rotation)
    }
    return rounds
  }

  #createRotation(participants) {
    const rotation = [...participants]
    if (rotation.length % 2 !== 0) {
      rotation.push(null)
    }
    return rotation
  }

  #createRound(roundNumber, rotation) {
    const pairings = this.#pairUp(rotation)
    const matches = pairings
      .filter(pairing => !this.#isBye(pairing))
      .map(([home, away]) => new Match(home, away))
    const participantsWithBye = pairings
      .filter(pairing => this.#isBye(pairing))
      .map(pairing => pairing.find(participant => participant !== null))
    return new Round(roundNumber, matches, participantsWithBye)
  }

  #pairUp(rotation) {
    const lastIndex = rotation.length - 1
    return rotation
      .slice(0, rotation.length / 2)
      .map((home, index) => [home, rotation[lastIndex - index]])
  }

  #isBye(pairing) {
    return pairing.includes(null)
  }

  #rotate(rotation) {
    const [fixed, ...others] = rotation
    return [fixed, others.at(-1), ...others.slice(0, -1)]
  }

  #assertEnoughParticipants(participants) {
    if (participants.length < 2) {
      throw new RangeError('A round-robin schedule needs at least two participants')
    }
  }
}
