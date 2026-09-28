/**
 * Represents a team or player taking part in a tournament.
 */
export class Participant {
  #name

  /**
   * @param {string} name - The participant's display name.
   * @throws {TypeError} If the name is not a non-empty string.
   */
  constructor(name) {
    this.#assertValidName(name)
    this.#name = name.trim()
  }

  /**
   * @returns {string} The participant's display name.
   */
  getName() {
    return this.#name
  }

  #assertValidName(name) {
    if (typeof name !== 'string' || name.trim() === '') {
      throw new TypeError('Participant name must be a non-empty string')
    }
  }
}
