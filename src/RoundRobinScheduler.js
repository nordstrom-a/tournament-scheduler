import { Match } from './Match.js'
import { Participant } from './Participant.js'
import { Round } from './Round.js'

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
    const rotation = this.#createRotation(participants)
    const roundCount = rotation.length - 1
    const rounds = []

    for (let roundIndex = 0; roundIndex < roundCount; roundIndex++) {
      rounds.push(this.#createRound(roundIndex + 1, rotation))
      this.#rotate(rotation)
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
    const matches = []
    const participantsWithBye = []
    const lastIndex = rotation.length - 1

    for (let index = 0; index < rotation.length / 2; index++) {
      const home = rotation[index]
      const away = rotation[lastIndex - index]

      if (home === null) {
        participantsWithBye.push(away)
      } else if (away === null) {
        participantsWithBye.push(home)
      } else {
        matches.push(new Match(home, away))
      }
    }
    return new Round(roundNumber, matches, participantsWithBye)
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
