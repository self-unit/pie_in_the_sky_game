import { subscribe } from '../helpers/pubSub.js';

const setTimer = () => {
  subscribe('Timer:currentTime', (event) => {
    const timerPlace = document.querySelector('#timer');
    const mins = Math.floor(event.detail / 60);
    const seconds = event.detail % 60;
    if (timerPlace) timerPlace.innerHTML = `You have ${mins} minutes and ${seconds} seconds left`;
  });
};

export default class PlayerView {
  /**
   * @param {import("../models/game.js").default} game
   */
  constructor(game) {
    this.game = game;
  }

  bindEvents() {
    const currentPlayerDisplay = document.querySelector('#current-player');
    if (currentPlayerDisplay) {
      currentPlayerDisplay.textContent = `It's your turn ${this.game.player1.name}!`;
      subscribe('Game:current-player-change', (event) => {
        currentPlayerDisplay.textContent = `It's your turn ${event.detail.name}!`;
      });
      setTimer();
    }
  }
}
