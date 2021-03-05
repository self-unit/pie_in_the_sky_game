/* eslint-disable class-methods-use-this */
import { subscribe, publish } from '../helpers/pubSub.js';

export default class Board {
  constructor() {}

  bindEvents() {
    subscribe('Game:player-choose-move', (evt) => {
      this.highlightSquares(evt.detail[0], evt.detail[1]);
    });
  }

  setBoardPieces(numberOfPlayers) {
    document.querySelector('#p1-piece').style.display = 'block';
    document.querySelector('#p2-piece').style.display = 'block';
    if (numberOfPlayers > 3) document.querySelector('#p4-piece').style.display = 'block';
    if (numberOfPlayers > 2) document.querySelector('#p3-piece').style.display = 'block';
  }

  highlightSquares(squares ,player) {
    squares.forEach((moveOption) => {
      const highlightedSquare = document.querySelector(`#${moveOption}`);
      highlightedSquare.classList.add('highlighted-move');
      highlightedSquare.style.border = '3px white';
      highlightedSquare.style.borderStyle = 'dashed solid';
      highlightedSquare.style.color = 'white';
      highlightedSquare.onclick = function () {
        this.clearHighlightedSquares();
        publish('Board:player-move', this.id);
      };
    });
  }

  clearHighlightedSquares() {
    document.querySelectorAll('.highlighted-move').forEach((square) => {
      square.classList.remove('highlighted-move');
      square.style.border = 'none';
      square.style.color = 'black';
      square.onclick = null;
    });
  }
}
