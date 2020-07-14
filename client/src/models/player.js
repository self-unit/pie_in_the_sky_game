import pubSub from '../helpers/pubSub';

/** Class representing a player */
export default class Player {
  /**
   * Create a new player
   * @param {string} name - Name of the player
   * @param {string} id - CSS id for player icon
   * @param {string} player - Player id for turn
   */
  constructor(name, id, player) {
    this.icon = null;
    this.name = name;
    this.id = id;
    this.score = [0, 0, 0, 0, 0, 0];
    this.position = 'a1';
    this.player = player;
    this.colour = null;
    this.randomNumber = null;
  }

  /**
   * @returns {number} Random die number via pubSub
   */
  rollDie() {
    this.randomNumber = Math.floor(Math.random() * 6 + 1);
    pubSub.publish('Player:rollnumber', this.randomNumber);
  }
}
