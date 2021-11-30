import { subscribe, publish } from '../helpers/pubSub.js';
import createAndAppend from '../helpers/createAndAppend.js';

export const clearHighlightedSquares = () => {
  /** @type {NodeListOf<HTMLCanvasElement>} */
  const highlightedSquare = document.querySelectorAll('.highlighted-move');
  highlightedSquare.forEach((square) => {
    square.classList.remove('highlighted-move');
    // eslint-disable-next-line no-param-reassign
    square.style.border = 'none';
    // eslint-disable-next-line no-param-reassign
    square.style.color = 'black';
    // eslint-disable-next-line no-param-reassign
    square.onclick = null;
  });
};

/**
 * @param {string[]} squares
 * @param {string} playerPosition
 */
export const highlightSquares = (squares, playerPosition) => {
  squares.forEach((square) => {
    /** @type {HTMLDivElement | null} */
    const highlightedSquare = document.querySelector(`#${square}`);
    if (!highlightedSquare) {
      // eslint-disable-next-line no-console
      console.error(`Could not find square ${square} to highlight`);
      return;
    }

    highlightedSquare.classList.add('highlighted-move');
    highlightedSquare.style.border = '3px white';
    highlightedSquare.style.borderStyle = 'dashed solid';
    highlightedSquare.style.color = 'white';
    highlightedSquare.onclick = () => {
      clearHighlightedSquares();
      publish('Board:player-move', playerPosition);
    };
  });
};

export const bindEvents = () => {
  subscribe('Game:player-choose-move', (event) => {
    highlightSquares(event.detail[0], event.detail[1]);
  });
};

/**
 * @param {number} numberOfPlayers
 */
export const setBoardPieces = (numberOfPlayers) => {
  /** @type {HTMLDivElement | null} */
  const boardGrid = document.querySelector('#board-grid');
  switch (numberOfPlayers) {
    case 3:
      if (boardGrid) createAndAppend('div', boardGrid, null, 'board-piece', 'p3-piece');
      break;
    case 4:
      if (boardGrid) createAndAppend('div', boardGrid, null, 'board-piece', 'p4-piece');
      break;
    default: {
      if (boardGrid) {
        createAndAppend('div', boardGrid, null, 'board-piece', 'p1-piece');
        createAndAppend('div', boardGrid, null, 'board-piece', 'p2-piece');
      }
      break;
    }
  }
};
