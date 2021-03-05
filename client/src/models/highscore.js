import Request from '../helpers/request.js';
import { publish, subscribe } from '../helpers/pubSub.js';

class HighScore {
  constructor(url) {
    this.url = url;
    this.currentEntries = null;
  }

  bindEvents() {
    this.getNames();
    this.getWinner();
  }

  getNames() {
    const request = new Request(this.url);
    request.get().then((entries) => {
      this.currentEntries = entries;
      publish('HighScore:allscores', this.currentEntries);
    });
  }

  getWinner() {
    subscribe('Game:end-game', (event) => {
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
    request
      .post(entry)
      .then(() => {
        this.getNames();
      })
      .catch(console.error);
  }

  updatePlayer(player) {
    const winner = this.currentEntries.filter((entry) => entry.name === player);
    const updatedWins = winner[0].wins + 1;
    const body = {
      wins: updatedWins,
    };
    const request = new Request(this.url);
    request.put(winner[0]._id, body).then(() => {
      this.getNames();
    });
  }
}

export default HighScore;
