import { publish } from '../helpers/pubSub.js';

/**
 * A timer that has timeLeft and second ticks
 */
export default class Timer {
  /**
   * @param {number} time
   */
  constructor(time) {
    if (!time) throw new Error('Timer:time must be provided');
    this.timeLeft = time;
    this.tick = undefined;
  }

  endTimer() {
    if (this.tick) clearInterval(this.tick);
  }

  motion() {
    if (this.timeLeft === 0) {
      this.endTimer();
    } else {
      this.timeLeft -= 1;
    }
    publish('Timer:currentTime', this.timeLeft);
  }

  countdown() {
    this.tick = setInterval(() => {
      this.motion();
    }, 1000);
  }
}
