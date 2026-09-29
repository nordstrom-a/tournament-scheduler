import { Match } from './Match.js'
import { Participant } from './Participant.js'
import { Round } from './Round.js'

/**
 * Creates a schedule where every participant meets every other participant once, using the circle method.
 */
export class RoundRobinScheduler {
  /**
   * @param {Participant[]} participants - At least two participants.
   * @returns {Round[]} The rounds in the order they should be played.
   * @throws {RangeError} If there are fewer than two participants.
   */
  createRounds(participants) {
    this.#assertEnoughParticipants(participants)
    const rotation = [...participants]
    const roundCount = rotation.length - 1
    const rounds = []

    for (let roundIndex = 0; roundIndex < roundCount; roundIndex++) {
      rounds.push(this.#createRound(roundIndex + 1, rotation))
      this.#rotate(rotation)
    }
    return rounds
  }

  #createRound(roundNumber, rotation) {
    const matches = []
    const lastIndex = rotation.length - 1

    for (let index = 0; index < rotation.length / 2; index++) {
      matches.push(new Match(rotation[index], rotation[lastIndex - index]))
    }
    return new Round(roundNumber, matches)
  }

  #rotate(rotation) {
    const last = rotation.pop()
    rotation.splice(1, 0, last)
  }

  #assertEnoughParticipants(participants) {
    if (participants.length < 2) {
      throw new RangeError('A round-robin schedule needs at least two participants')
    }
  }
}
