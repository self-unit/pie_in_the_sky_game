import createAndAppend from '../helpers/createAndAppend.js';
import { subscribe } from '../helpers/pubSub.js';

class GameScoreView {
  constructor(game) {
    this.game = game;
  }

  bindEvents() {
    this.updateScores();
    subscribe('Game:score-change', () => {
      this.updateScores();
    });
  }

  updateScores() {
    for (player in this.game.players) {
      const scoreDisplay = document.querySelector(
        `#${this.game.players[player].player}-score-display`
      );
      scoreDisplay.textContent = this.game.players[player].name;
      if (this.game.players[player] === this.game.currentPlayer) {
        scoreDisplay.classList.add('blinkPlayer');
      } else {
        scoreDisplay.classList.remove('blinkPlayer');
      }
      this.renderScore(
        this.game.players[player].score,
        this.game.players[player].colour,
        scoreDisplay
      );
      this.changeBlinkingPlayer();
    }
  }

  changeBlinkingPlayer() {
    subscribe('Game:current-player-change', (event) => {
      for (player in this.game.players) {
        const scoreDisplay = document.querySelector(
          `#${this.game.players[player].player}-score-display`
        );
        scoreDisplay.textContent = this.game.players[player].name;
        if (this.game.players[player] === event.detail) {
          scoreDisplay.classList.add('blinkPlayer');
        } else {
          scoreDisplay.classList.remove('blinkPlayer');
        }
        this.renderScore(
          this.game.players[player].score,
          this.game.players[player].colour,
          scoreDisplay
        );
      }
    });
  }

  renderScore(scores, colour, container) {
    const scalerContainer = createAndAppend('div', 'scaler-container', null, null, container);
    scalerContainer.style.backgroundColor = colour;
    const scaler = createAndAppend('div', 'scaler', null, null, scalerContainer);
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

export default GameScoreView;
