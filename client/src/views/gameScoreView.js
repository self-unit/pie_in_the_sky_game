import createAndAppend from '../helpers/createAndAppend';
import pubSub from '../helpers/pubSub';

export default class GameScoreView {
  constructor(game) {
    this.game = game;
  }

  bindEvents() {
    this.updateScores();
    pubSub.subscribe('Game:score-change', () => {
      this.updateScores();
    });
  }

  updateScores() {
    const players = Object.keys(this.game.players);
    for (let i = 0; i < players.length; i += 1) {
      const scoreDisplay = document.querySelector(`#${this.game.players[i].player}-score-display`);
      scoreDisplay.textContent = this.game.players[i].name;
      if (this.game.players[i] === this.game.currentPlayer) {
        scoreDisplay.classList.add('blinkPlayer');
      } else {
        scoreDisplay.classList.remove('blinkPlayer');
      }
      this.renderScore(this.game.players[i].score, this.game.players[i].colour, scoreDisplay);
      this.changeBlinkingPlayer();
    }
  }

  changeBlinkingPlayer() {
    pubSub.subscribe('Game:current-player-change', (event) => {
      const players = Object.keys(this.game.players);
      for (let i = 0; i < players.length; i += 1) {
        const scoreDisplay = document.querySelector(
          `#${this.game.players[i].player}-score-display`,
        );
        scoreDisplay.textContent = this.game.players[i].name;
        if (this.game.players[i] === event.detail) {
          scoreDisplay.classList.add('blinkPlayer');
        } else {
          scoreDisplay.classList.remove('blinkPlayer');
        }
        this.renderScore(this.game.players[i].score, this.game.players[i].colour, scoreDisplay);
      }
    });
  }

  renderScore(scores, colour, container) {
    this.scalerContainer = createAndAppend('div', 'scaler-container', null, null, container);
    this.scalerContainer.style.backgroundColor = colour;
    const scaler = createAndAppend('div', 'scaler', null, null, this.scalerContainer);
    const list = createAndAppend('ul', 'segments', null, null, scaler);

    scores.forEach((value, index) => {
      const segment = createAndAppend('li', 'segment', null, null, list);
      segment.style.webkitTransform = `rotate(${index * 60}deg) skewY(-30deg)`;
      if (value === 0) {
        segment.style.visibility = 'hidden';
      }
    });
  }
}
