import { subscribe, publish } from '../helpers/pubSub.js';
import BoardMap from '../helpers/boardMap.js';

class BoardView {
  constructor(game) {
    this.game = game;
    this.number = null;
  }

  bindEvents() {
    const dieButton = document.querySelector('#dieButton');

    dieButton.addEventListener('click', () => {
      this.game.currentPlayer.rollDie();
      dieButton.disabled = true;
    });

    this.player1Piece = document.querySelector('#p1-piece');
    this.player1Piece.style.backgroundColor = this.game.player1.colour;
    this.player2Piece = document.querySelector('#p2-piece');
    this.player2Piece.style.backgroundColor = this.game.player2.colour;
    this.player3Piece = document.querySelector('#p3-piece');
    if (this.game.player3) this.player3Piece.style.backgroundColor = this.game.player3.colour;
    this.player4Piece = document.querySelector('#p4-piece');
    if (this.game.player4) this.player4Piece.style.backgroundColor = this.game.player4.colour;

    this.printNumber();

    subscribe('Board:player-move', (evt) => {
      this.game.currentPlayer.position = evt.detail;
      if (this.game.currentPlayer === this.game.player1) {
        this.player1Piece.style.left = `${BoardMap[evt.detail].left + 4}px`;
        this.player1Piece.style.top = `${BoardMap[evt.detail].top + 4}px`;
      } else if (this.game.currentPlayer === this.game.player2) {
        this.player2Piece.style.left = `${BoardMap[evt.detail].left + 42}px`;
        this.player2Piece.style.top = `${BoardMap[evt.detail].top + 42}px`;
      } else if (this.game.currentPlayer === this.game.player3) {
        this.player3Piece.style.left = `${BoardMap[evt.detail].left + 42}px`;
        this.player3Piece.style.top = `${BoardMap[evt.detail].top + 4}px`;
      } else {
        this.player4Piece.style.left = `${BoardMap[evt.detail].left + 4}px`;
        this.player4Piece.style.top = `${BoardMap[evt.detail].top + 42}px`;
      }
      const category = document.querySelector(`#${evt.detail}`).classList.value;
      publish('BoardView:category', category);
    });
  }

  // die in board view
  printNumber() {
    subscribe('Player:rollnumber', (event) => {
      this.number = event.detail;
      const roller = document.querySelector('#diePlace');
      roller.innerHTML = this.number;
    });
  }
}

export default BoardView;
