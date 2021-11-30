import { subscribe, publish } from '../helpers/pubSub.js';
import BoardMap from '../helpers/boardMap.js';
import Timer from './timer.js';
import * as Board from './board.js';

const categories = ['science', 'sports', 'movies', 'history', 'music', 'books'];

/**
 * A game which has players, a board, a timer and a currentPlayer
 */
export default class Game {
  /**
   * @param {import('./player').default} player1
   * @param {import('./player').default} player2
   * @param {import('./player').default | null} player3
   * @param {import('./player').default | null} player4
   */
  constructor(player1, player2, player3, player4) {
    this.player1 = player1;
    this.player2 = player2;
    this.player3 = player3;
    this.player4 = player4;
    /** @type {import('./player').default[] | []} */
    this.players = [];
    this.players[this.player1.id] = this.player2;
    if (this.player4 && this.player3) {
      this.players[this.player4.id] = this.player1;
      this.players[this.player3.id] = this.player4;
      this.players[this.player2.id] = this.player3;
    } else if (this.player3) {
      this.players[this.player3.id] = this.player1;
      this.players[this.player2.id] = this.player3;
    } else {
      this.players[this.player2.id] = this.player1;
    }
    /** @type {import('./player').default | undefined} */
    this.currentPlayer = undefined;
    /** @type {import('./timer').default | undefined} */
    this.timer = undefined;
  }

  startGame() {
    const numberOfPlayers = Object.keys(this.players).length;
    Board.setBoardPieces(numberOfPlayers);
    this.currentPlayer = this.player1;
    this.timer = new Timer(50);
    this.timer.countdown();
    this.playTurn();
    subscribe('Card:is-correct', (event) => {
      const result = event.detail;
      this.checkResult(result);
    });
    this.timerFinish();
  }

  playTurn() {
    subscribe('Player:rollnumber', (event) => {
      /** @type {import('../../../params').Rows} */
      const numberRolled = event.detail;
      if (this.currentPlayer) {
        const moveOptions = BoardMap[this.currentPlayer.position][numberRolled];
        publish('Game:player-choose-move', [moveOptions, this.currentPlayer.position]);
      }
    });
  }

  /**
   * @param {{isCorrect: boolean, category: string}} result
   */
  checkResult(result) {
    if (result.isCorrect === false) {
      this.endTurn();
    } else {
      const categoryIndex = categories.indexOf(result.category);
      if (this.currentPlayer) {
        this.currentPlayer.score.splice(categoryIndex, 1, 1);
        publish('Game:score-change', this.currentPlayer.score);
      }
    }
    if (this.currentPlayer) {
      const playerScore = this.currentPlayer.score.reduce((a, b) => a + b, 0);
      if (playerScore === 6) {
        this.endGame();
      }
    }
  }

  endTurn() {
    if (this.currentPlayer) this.currentPlayer = this.players[this.currentPlayer.id];
    if (this.timer) {
      this.timer.endTimer();
      this.timer = new Timer(50);
      this.timer.countdown();
    }
    publish('Game:current-player-change', this.currentPlayer);
  }

  timerFinish() {
    subscribe('Timer:currentTime', (event) => {
      const time = event.detail;
      if (time === 0) {
        this.endTurn();
      }
    });
  }

  endGame() {
    publish('Game:end-game', this);
    if (this.timer) this.timer.endTimer();
    /** @type {HTMLAudioElement | null} */
    const win = document.querySelector('#winSound');
    if (win) win.play();
  }
}
