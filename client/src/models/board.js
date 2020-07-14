import pubSub from '../helpers/pubSub';

export default class Board {
  constructor(document) {
    this.document = document;
    this.highlightedSquare = null;
  }

  bindEvents() {
    pubSub.subscribe('Game:player-choose-move', (evt) => {
      this.highlightSquares(evt.detail[0]);
    });
  }

  setBoardPieces(numberOfPlayers) {
    this.document.querySelector('#p1-piece').style.display = 'block';
    this.document.querySelector('#p2-piece').style.display = 'block';
    if (numberOfPlayers > 3) this.document.querySelector('#p4-piece').style.display = 'block';
    if (numberOfPlayers > 2) this.document.querySelector('#p3-piece').style.display = 'block';
  }

  highlightSquares(squares) {
    const moveOptions = Object.keys(squares);
    for (let i = 0; i < moveOptions; i += 1) {
      this.highlightedSquare = document.querySelector(`#${i}`);
      this.highlightedSquare.classList.add('highlighted-move');
      this.highlightedSquare.style.border = '3px white';
      this.highlightedSquare.style.borderStyle = 'dashed solid';
      this.highlightedSquare.style.color = 'white';
      this.highlightedSquare.onclick = () => {
        this.clearHighlightedSquares();
        pubSub.publish('Board:player-move', this.id);
      };
    }
  }

  clearHighlightedSquares() {
    const squares = Object.keys(this.document.querySelectorAll('.highlighted-move'));
    for (let i = 0; i < squares; i += 1) {
      i.classList.remove('highlighted-move');
      i.style.border = 'none';
      i.style.color = 'black';
      i.onclick = null;
    }
  }
}
