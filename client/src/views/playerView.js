import pubSub from '../helpers/pubSub';

export default class PlayerView {
  constructor(game) {
    this.game = game;
  }

  bindEvents() {
    const currentPlayerDisplay = document.querySelector('#current-player');
    currentPlayerDisplay.textContent = `It's your turn ${this.game.player1.name}!`;
    pubSub.subscribe('Game:current-player-change', (evt) => {
      currentPlayerDisplay.textContent = `It's your turn ${evt.detail.name}!`;
    });
    this.setTimer();
  }

  setTimer() {
    pubSub.subscribe('Timer:currentTime', (evt) => {
      this.timerPlace = document.querySelector('#timer');
      const mins = Math.floor(evt.detail / 60);
      const seconds = evt.detail % 60;
      this.timerPlace.innerHTML = `You have ${mins} minutes and ${seconds} seconds left`;
    });
  }
}
