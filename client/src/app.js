import createAndAppend from './helpers/createAndAppend.js';
import Game from './models/game.js';
import * as Board from './models/board.js';
import Player from './models/player.js';
import Card from './models/card.js';
import HighScore from './models/highscore.js';
import BoardView from './views/boardView.js';
import PlayerView from './views/playerView.js';
import QuestionView from './views/cardQuestionView.js';
import GameScoreView from './views/gameScoreView.js';
import ResultsView from './views/resultsView.js';

document.addEventListener('DOMContentLoaded', () => {
  /** @type {HTMLDivElement | null} */
  let startScreenDiv = document.querySelector('#start-screen');
  if (!startScreenDiv)
    startScreenDiv = createAndAppend('div', document.body, null, '#start-screen', 'start-screen');
  /** @type {HTMLFormElement | null} */
  let startGameForm = document.querySelector('#start-screen-form');
  if (!startGameForm)
    startGameForm = createAndAppend(
      'form',
      document.body,
      null,
      '#start-screen-form',
      'start-form'
    );
  /** @type {HTMLButtonElement | null} */
  let button = document.querySelector('#instructions-drop-btn');
  if (!button)
    button = createAndAppend(
      'button',
      startGameForm,
      null,
      '#instructions-drop-btn',
      'instructions-btn'
    );

  button.addEventListener('click', () => {
    document.querySelector('#instructions-dropdown')?.classList.toggle('hidden');
  });

  startGameForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (event.target?.player4.value && !event.target.player3.value) {
      const formError = document.querySelector('#form-error');
      if (formError) formError.textContent = 'Please enter a name for Player 3.';
    } else {
      const player1 = new Player(event.target?.player1.value, 1, 'player1');
      player1.colour = 'darkblue';
      const player2 = new Player(event.target?.player2.value, 2, 'player2');
      player2.colour = 'black';
      let player3 = null;
      let player4 = null;
      if (event.target?.player3.value) {
        player3 = new Player(event.target.player3.value, 3, 'player3');
        player3.colour = 'darkgreen';
      }
      if (event.target?.player4.value) {
        player4 = new Player(event.target.player4.value, 4, 'player4');
        player4.colour = 'darkred';
      }

      startScreenDiv?.classList.add('end');

      Board.bindEvents();

      const game = new Game(player1, player2, player3, player4);
      game.startGame();

      const playerView = new PlayerView(game);
      playerView.bindEvents();

      const gameScoreView = new GameScoreView(game);
      gameScoreView.bindEvents();

      const boardView = new BoardView(game);
      boardView.bindEvents();

      const questionView = new QuestionView();
      questionView.bindEvents();

      const resultsView = new ResultsView();
      resultsView.bindEvent();

      const card = new Card(event.target && event.target[0].value);
      card.bindEvents();

      const highScoreUrl = 'https://pieintheskie.herokuapp.com/api/games';
      const highScore = new HighScore(highScoreUrl);
      highScore.bindEvents();
    }
  });
});
