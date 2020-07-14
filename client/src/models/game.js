const PubSub = require('../helpers/pub_sub.js');
const BoardMap = require('../helpers/board_map.js');
const Board = require('./board.js');
const HighScore = require('./highscore.js');
const Player = require('./player.js');
const Card = require('./card.js');
const Timer = require('./timer.js');

const categories = ['science', 'sports', 'movies', 'history', 'music', 'books'];
const Game = function(player1, player2, player3, player4, board) {
  this.player1 = player1;
  this.player2 = player2;
  this.player3 = player3;
  this.player4 = player4;
  this.players = {};
  this.players[this.player1.id] = this.player2;
  if (this.player4) {
    this.players[this.player4.id] = this.player1;
    this.players[this.player3.id] = this.player4;
    this.players[this.player2.id] = this.player3;
  } else if (this.player3) {
    this.players[this.player3.id] = this.player1;
    this.players[this.player2.id] = this.player3;
  } else {
    this.players[this.player2.id] = this.player1;
  }
  this.board = board;
  this.currentPlayer = null;
  this.currentCategory = null;
  this.timer = null;
};

Game.prototype.startGame = function() {
  const number_of_players = Object.keys(this.players).length;
  this.board.setBoardPieces(number_of_players);
  this.currentPlayer = this.player1;
  this.timer = new Timer(50);
  this.timer.countdown();
  this.playTurn();
  PubSub.subscribe(`Card:is-correct`, (event) => {
    const result = event.detail;
    this.checkResult(result);
  });
  this.timerFinish();
};

Game.prototype.playTurn = function() {
  PubSub.subscribe('Player:rollnumber', (evt) => {
    const numberRolled = `r${  evt.detail}`;
    const move_options = BoardMap[this.currentPlayer.position][numberRolled];
    PubSub.publish('Game:player-choose-move', [move_options, this.currentPlayer]);
    // this.board.movesPlayer(this.currentPlayer, moves);
  });
};

Game.prototype.checkResult = function(result) {
  if (result.isCorrect === false) {
    this.endTurn();
  } else {
    const categoryIndex = categories.indexOf(result.category);
    this.currentPlayer.score.splice(categoryIndex, 1, 1);
    PubSub.publish('Game:score-change', this.currentPlayer.score);
  }
  const playerScore = this.currentPlayer.score.reduce((a, b) => a + b, 0);
  if (playerScore === 6) {
    this.endGame();
  }
};

Game.prototype.endTurn = function() {
  this.currentPlayer = this.players[this.currentPlayer.id];
  this.timer.endTimer();
  this.timer = new Timer(50);
  this.timer.countdown();
  PubSub.publish('Game:current-player-change', this.currentPlayer);
};

Game.prototype.timerFinish = function() {
  PubSub.subscribe('Timer:currentTime', (evt) => {
    const time = evt.detail;
    if (time === 0) {
      this.endTurn();
    }
  });
};

Game.prototype.endGame = function() {
  PubSub.publish('Game:end-game', this);
  this.timer.endTimer();
  const win = document.querySelector('#winSound');
  win.play();
};

module.exports = Game;
