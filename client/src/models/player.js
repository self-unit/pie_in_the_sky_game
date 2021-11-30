import { publish } from '../helpers/pubSub.js';

/**
 * A player that has a name, icon, id, score, position, colour and die roll
 */
export default class Player {
  /**
   * @param {string} name
   * @param {number} id
   * @param {string} player
   */
  constructor(name, id, player) {
    if (!name || !id || !player) {
      throw new Error('Player:name, id & player must be provided');
    }
    this.name = name;
    this.id = id;
    this.score = [0, 0, 0, 0, 0, 0];
    /** @type {keyof typeof import('../helpers/boardMap').default} */
    this.position = 'a1';
    this.player = player;
    /** @type {string | null} */
    this.colour = null;
    this.randomNumber = null;
  }

  rollDie() {
    this.randomNumber = Math.floor(Math.random() * 6 + 1);
    publish('Player:rollnumber', `r${this.randomNumber}`);
  }
}
