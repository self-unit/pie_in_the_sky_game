import { subscribe, publish } from '../helpers/pubSub.js';
import BoardMap from '../helpers/boardMap.js';
import Timer from './timer.js';

const categories = ['science', 'sports', 'movies', 'history', 'music', 'books'];
class Game {
  constructor(player1, player2, player3, player4, board) {
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
  }

  startGame() {
    const numberOfPlayers = Object.keys(this.players).length;
    this.board.setBoardPieces(numberOfPlayers);
    this.currentPlayer = this.player1;
    this.timer = new Timer(50);
    this.timer.countdown();
    this.playTurn();
    subscribe(`Card:is-correct`, (event) => {
      const result = event.detail;
      this.checkResult(result);
    });
    this.timerFinish();
  }

  playTurn() {
    subscribe('Player:rollnumber', (evt) => {
      const numberRolled = `r${evt.detail}`;
      const moveOptions = BoardMap[this.currentPlayer.position][numberRolled];
      publish('Game:player-choose-move', [moveOptions, this.currentPlayer]);
      // this.board.movesPlayer(this.currentPlayer, moves);
    });
  }

  checkResult(result) {
    if (result.isCorrect === false) {
      this.endTurn();
    } else {
      const categoryIndex = categories.indexOf(result.category);
      this.currentPlayer.score.splice(categoryIndex, 1, 1);
      publish('Game:score-change', this.currentPlayer.score);
    }
    const playerScore = this.currentPlayer.score.reduce((a, b) => a + b, 0);
    if (playerScore === 6) {
      this.endGame();
    }
  }

  endTurn() {
    this.currentPlayer = this.players[this.currentPlayer.id];
    this.timer.endTimer();
    this.timer = new Timer(50);
    this.timer.countdown();
    publish('Game:current-player-change', this.currentPlayer);
  }

  timerFinish() {
    subscribe('Timer:currentTime', (evt) => {
      const time = evt.detail;
      if (time === 0) {
        this.endTurn();
      }
    });
  }

  endGame() {
    publish('Game:end-game', this);
    this.timer.endTimer();
    const win = document.querySelector('#winSound');
    win.play();
  }
}

export default Game;
