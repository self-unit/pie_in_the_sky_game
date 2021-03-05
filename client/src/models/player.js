import { publish } from '../helpers/pubSub.js';

class Player {
  constructor(name, id, player) {
    this.icon = null;
    this.name = name;
    this.id = id;
    this.score = [0, 0, 0, 0, 0, 0];
    this.position = 'a1';
    this.player = player;
    this.colour = null;
    this.randomNumber = null;
  }

  rollDie() {
    this.randomNumber = Math.floor(Math.random() * 6 + 1);
    publish('Player:rollnumber', this.randomNumber);
  }
}

export default Player;
