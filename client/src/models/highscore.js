import { get, post, put } from '../helpers/request.js';
import { publish, subscribe } from '../helpers/pubSub.js';

/**
 * A highscore which contains a url and currentEntries of previous winners
 */
export default class HighScore {
  /**
   * @param {URL} url
   */
  constructor(url) {
    if (!url) throw new Error('Highscore:url must be provided');
    this.url = url;
    /** @type {import('../../../params').Entry[]} */
    this.currentEntries = [];
  }

  /**
   * @param {string} player
   */
  async updatePlayer(player) {
    this.currentEntries
      .filter((entry) => entry.name === player)
      .forEach(async (winner) => {
        winner.wins += 1;
        await put(this.url, winner.dbId, { wins: winner.wins + 1 });
      });
    await this.getNames();
  }

  getWinner() {
    subscribe('Game:end-game', (event) => {
      const winner = event.detail.currentPlayer.name;
      if (this.currentEntries.some((entry) => entry.name === winner)) {
        this.updatePlayer(winner);
      } else {
        this.postPlayer(winner);
      }
    });
  }

  async bindEvents() {
    await this.getNames();
    this.getWinner();
  }

  async getNames() {
    this.currentEntries = await get(this.url);
    publish('HighScore:allscores', this.currentEntries);
  }

  /**
   * @param {string} player
   */
  async postPlayer(player) {
    const entry = {
      name: player,
      wins: 1,
    };
    try {
      await post(this.url, entry);
      await this.getNames();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }
}
