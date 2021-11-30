import createAndAppend from '../helpers/createAndAppend.js';
import { subscribe } from '../helpers/pubSub.js';

/**
 * @param {number[]} scores
 * @param {string} colour
 * @param {Node} container
 */
const renderScore = (scores, colour, container) => {
  const scalerContainer = createAndAppend('div', container, null, 'scaler-container', null);
  scalerContainer.style.backgroundColor = colour;
  const scaler = createAndAppend('div', scalerContainer, null, 'scaler', null);
  const list = createAndAppend('ul', scaler, null, 'segments', null);

  scores.forEach((value, index) => {
    const segment = createAndAppend('li', list, null, 'segment', null);
    segment.style.transform = `rotate(${index * 60}deg) skewY(-30deg)`;
    if (value === 0) {
      segment.style.visibility = 'hidden';
    }
  });
};

export default class GameScoreView {
  /**
   * @param {import("../models/game.js").default} game
   */
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
    const players = Object.values(this.game.players);
    players.forEach((player) => {
      const scoreDisplay = document.querySelector(
        `#${this.game.players[player.id].player}-score-display`
      );
      if (scoreDisplay) {
        scoreDisplay.textContent = this.game.players[player.id].name;
        if (this.game.players[player.id] === this.game.currentPlayer) {
          scoreDisplay.classList.add('blinkPlayer');
        } else {
          scoreDisplay.classList.remove('blinkPlayer');
        }
        renderScore(
          this.game.players[player.id].score,
          this.game.players[player.id].colour || 'yellow',
          scoreDisplay
        );
        this.changeBlinkingPlayer();
      }
    });
  }

  changeBlinkingPlayer() {
    subscribe('Game:current-player-change', (event) => {
      const players = Object.values(this.game.players);
      players.forEach((player) => {
        const scoreDisplay = document.querySelector(
          `#${this.game.players[player.id].player}-score-display`
        );
        if (scoreDisplay) {
          scoreDisplay.textContent = this.game.players[player.id].name;
          if (this.game.players[player.id] === event.detail) {
            scoreDisplay.classList.add('blinkPlayer');
          } else {
            scoreDisplay.classList.remove('blinkPlayer');
          }
          renderScore(
            this.game.players[player.id].score,
            this.game.players[player.id].colour || 'yellow',
            scoreDisplay
          );
        }
      });
    });
  }
}
