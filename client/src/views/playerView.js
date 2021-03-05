import { subscribe } from '../helpers/pubSub.js';

class PlayerView {
  constructor(game) {
    this.game = game;
  }

  bindEvents() {
    const currentPlayerDisplay = document.querySelector('#current-player');
    currentPlayerDisplay.textContent = `It's your turn ${this.game.player1.name}!`;
    subscribe('Game:current-player-change', (evt) => {
      currentPlayerDisplay.textContent = `It's your turn ${evt.detail.name}!`;
    });
    this.setTimer();
  }

  setTimer() {
    subscribe('Timer:currentTime', (evt) => {
      const timerPlace = document.querySelector('#timer');
      const time = evt.detail;
      const mins = Math.floor(evt.detail / 60);
      const seconds = evt.detail % 60;
      timerPlace.innerHTML = `You have ${mins} minutes and ${seconds} seconds left`;
    });
  }
}

export default PlayerView;
