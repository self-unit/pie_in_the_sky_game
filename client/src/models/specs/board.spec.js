import * as Board from '../board.js';
import createAndAppend from '../../helpers/createAndAppend.js';
import boardMap from '../../helpers/boardMap.js';
import Card from '../card.js';

/** @type {HTMLDivElement} */
let wrapper;
/** @type {HTMLDivElement} */
let boardContainer;
/** @type {HTMLDivElement} */
let boardGrid;

describe('Board', () => {
  beforeAll(() => {
    // Prepare the DOM to simulate the index.html file
    const card = new Card('easy');
    wrapper = createAndAppend('div', document.body, null, 'wrapper', null);
    boardContainer = createAndAppend('div', wrapper, null, null, 'board-container');
    boardGrid = createAndAppend('div', boardContainer, null, null, 'board-grid');
    Object.keys(boardMap).forEach((key) => {
      createAndAppend(
        'div',
        boardGrid,
        card.categories[Math.floor(Math.random() * card.categories.length)].name,
        null,
        key
      );
    });
  });

  describe('higlightSquares', () => {
    it('should highlight squares', () => {
      const squares = ['a5', 'b4', 'd2', 'e1'];
      const playerPosition = 'a1';
      Board.highlightSquares(squares, playerPosition);
      const highlightedSquares = document.querySelectorAll('.highlighted-move');
      expect(highlightedSquares.length).toBe(4);
    });
  });

  describe('clearHighlightedSquares', () => {
    it('should clear highlighted squares', () => {
      const squares = ['a1', 'a2', 'a3'];
      const playerPosition = 'a1';
      Board.highlightSquares(squares, playerPosition);
      Board.clearHighlightedSquares();
      const highlightedSquare = document.querySelectorAll('.highlighted-move');
      expect(highlightedSquare.length).toBe(0);
    });
  });

  describe('setBoardPieces', () => {
    it.each([2, 3, 4])(`should set board pieces for %i players`, (numberOfPlayers) => {
      Board.setBoardPieces(numberOfPlayers);
      const boardPieces = document.querySelectorAll('.board-piece');
      expect(boardPieces.length).toBe(numberOfPlayers);
    });
  });
});
