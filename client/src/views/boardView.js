import { subscribe, publish } from '../helpers/pubSub.js';
import BoardMap from '../helpers/boardMap.js';

/**
 * A view of the board which has a game and number for the die roll
 */
export default class BoardView {
  /**
   * @param {import('../models/game').default} game
   */
  constructor(game) {
    this.game = game;
    this.number = null;
  }

  bindEvents() {
    /** @type {HTMLButtonElement | null} */
    const dieButton = document.querySelector('#dieButton');
    dieButton?.addEventListener('click', () => {
      if (this.game?.currentPlayer) {
        this.game.currentPlayer.rollDie();
        dieButton.disabled = true;
      } else {
        console.error('Game has not been instantiated yet or currentPlayer is undefined');
      }
    });

    /** @type {HTMLCanvasElement | null} */
    this.player1Piece = document.querySelector('#p1-piece');
    if (this.player1Piece)
      this.player1Piece.style.backgroundColor = this.game.player1.colour || 'white';
    /** @type {HTMLCanvasElement | null} */
    this.player2Piece = document.querySelector('#p2-piece');
    if (this.player2Piece)
      this.player2Piece.style.backgroundColor = this.game.player2.colour || 'white';
    /** @type {HTMLCanvasElement | null} */
    this.player3Piece = document.querySelector('#p3-piece');
    if (this.game.player3 && this.player3Piece)
      this.player3Piece.style.backgroundColor = this.game.player3.colour || 'white';
    /** @type {HTMLCanvasElement | null} */
    this.player4Piece = document.querySelector('#p4-piece');
    if (this.game.player4 && this.player4Piece)
      this.player4Piece.style.backgroundColor = this.game.player4.colour || 'white';

    this.printNumber();

    subscribe('Board:player-move', (event) => {
      if (this.game?.currentPlayer) this.game.currentPlayer.position = event.detail;
      if (this.game?.currentPlayer === this.game.player1 && this.player1Piece) {
        this.player1Piece.style.left = `${
          BoardMap[/** @type {keyof typeof BoardMap} */ (event.detail)].left + 4
        }px`;
        this.player1Piece.style.top = `${
          BoardMap[/** @type {keyof typeof BoardMap} */ (event.detail)].top + 4
        }px`;
      } else if (this.game.currentPlayer === this.game.player2 && this.player2Piece) {
        this.player2Piece.style.left = `${
          BoardMap[/** @type {keyof typeof BoardMap} */ (event.detail)].left + 42
        }px`;
        this.player2Piece.style.top = `${
          BoardMap[/** @type {keyof typeof BoardMap} */ (event.detail)].top + 42
        }px`;
      } else if (this.game.currentPlayer === this.game.player3 && this.player3Piece) {
        this.player3Piece.style.left = `${
          BoardMap[/** @type {keyof typeof BoardMap} */ (event.detail)].left + 42
        }px`;
        this.player3Piece.style.top = `${
          BoardMap[/** @type {keyof typeof BoardMap} */ (event.detail)].top + 4
        }px`;
      } else if (this.player4Piece) {
        this.player4Piece.style.left = `${
          BoardMap[/** @type {keyof typeof BoardMap} */ (event.detail)].left + 4
        }px`;
        this.player4Piece.style.top = `${
          BoardMap[/** @type {keyof typeof BoardMap} */ (event.detail)].top + 42
        }px`;
      }
      const category = document.querySelector(`#${event.detail}`);
      if (category) publish('BoardView:category', category.classList.value);
    });
  }

  printNumber() {
    subscribe('Player:rollnumber', (event) => {
      this.number = event.detail;
      const roller = document.querySelector('#diePlace');
      if (roller) roller.innerHTML = this.number;
    });
  }
}
