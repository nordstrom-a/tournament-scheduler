/**
 * Represents a team or player taking part in a tournament.
 */
export class Participant {
  #name
  #seed

  /**
   * @param {string} name - The participant's display name.
   * @param {number|null} [seed=null] - Ranking before the tournament, where 1 is the highest. 
   * @throws {TypeError} If the name is not a non-empty string.
   * @throws {RangeError} If the seed is not a positive integer or null.
   */
  constructor(name, seed = null) {
    this.#assertValidName(name)
    this.#assertValidSeed(seed)
    this.#name = name.trim()
    this.#seed = seed
  }

  /**
   * @returns {string} The participant's display name.
   */
  getName() {
    return this.#name
  }

  /**
   * @returns {number|null} The seed, or null if the participant is unseeded.
   */
  getSeed() {
    return this.#seed
  }

  /**
   * @returns {boolean} True if the participant has a seed.
   */
  isSeeded() {
    return this.#seed !== null
  }

  #assertValidName(name) {
    if (typeof name !== 'string' || name.trim() === '') {
      throw new TypeError('Participant name must be a non-empty string')
    }
  }

  #assertValidSeed(seed) {
    if (seed !== null && (!Number.isInteger(seed) || seed < 1)) {
      throw new RangeError('Seed must be a positive integer or null')
    }
  }
}
