import Request from '../helpers/request';
import pubSub from '../helpers/pubSub';

export default class HighScore {
  constructor(url) {
    this.url = url;
    this.currentEntries = null;
    this.winner = null;
  }

  bindEvents() {
    this.getNames();
    this.getWinner();
  }

  getNames() {
    const request = new Request(this.url);
    try {
      this.currentEntries = await request.get();
      pubSub.publish('HighScore:allscores', this.currentEntries);
    } catch (err) {
      throw new Error('Invalid request to getNames');
    }
  }

  getWinner() {
    pubSub.subscribe('Game:end-game', (event) => {
      const winner = event.detail.currentPlayer.name;
      if (this.currentEntries.find((entry) => entry.name === winner)) {
        this.updatePlayer(winner);
      } else {
        this.postPlayer(winner);
      }
    });
  }

  postPlayer(player) {
    const request = new Request(this.url);
    const entry = {
      name: `${player}`,
      wins: 1,
    };
    try {
      await request.post(entry)
      this.getNames();
    } catch (err) {
      throw new Error('Invalid request to postPlayer');
    }
  }

  updatePlayer(player) {
    this.winner = this.currentEntries.filter((entry) => entry.name === player);
    this.winner[0].wins += 1;
    const updatedWins = this.winner[0].wins;
    const request = new Request(this.url);
    const payload = {
      wins: updatedWins,
    };
    try {
      // eslint-disable-next-line no-underscore-dangle
      await request.put(this.winner[0]._id, payload)
      this.getNames();
    } catch (err) {
      throw new Error('Invalid request to updatePlayer')
    }
  }
}
