import Game from './models/game';
import Board from './models/board';
import Player from './models/player';
import Card from './models/card';
import HighScore from './models/highscore';
import BoardView from './views/boardView';
import PlayerView from './views/playerView';
import QuestionView from './views/cardQuestionView';
import GameScoreView from './views/gameScoreView';
import ResultsView from './views/resultsView';

document.addEventListener('DOMContentLoaded', () => {
  const startGameForm = document.querySelector('#start-screen-form');
  const startScreenDiv = document.querySelector('#start-screen');

  document.querySelector('#instructions-drop-btn').addEventListener('click', () => {
    document.querySelector('#instructions-dropdown').classList.toggle('hidden');
  });

  startGameForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (event.target.player4.value && !event.target.player3.value) {
      document.querySelector('#form-error').textContent = 'Please enter a name for Player 3.';
    } else {
      const player1 = new Player(event.target.player1.value, 'p1', 'player1');
      player1.colour = 'darkblue';
      const player2 = new Player(event.target.player2.value, 'p2', 'player2');
      player2.colour = 'black';
      let player3 = null;
      let player4 = null;
      if (event.target.player3.value) {
        player3 = new Player(event.target.player3.value, 'p3', 'player3');
        player3.colour = 'darkgreen';
      }
      if (event.target.player4.value) {
        player4 = new Player(event.target.player4.value, 'p4', 'player4');
        player4.colour = 'darkred';
      }

      startScreenDiv.classList.add('end');

      const board = new Board();
      board.bindEvents();

      const game = new Game(player1, player2, player3, player4, board);
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

      const card = new Card(event.target[0].value);
      card.bindEvents();

      const highScoreUrl = 'https://pieintheskie.herokuapp.com/api/games';
      const highScore = new HighScore(highScoreUrl);
      highScore.bindEvents();
    }
  });
});
