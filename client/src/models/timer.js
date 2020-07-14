import pubSub from '../helpers/pubSub';

/** Class representing a timer */
export default class Timer {
  /**
   * Create a timer
   * @param {number} time - Starting value in seconds
   */
  constructor(time) {
    this.timeLeft = time;
    this.tick = null;
  }

  /**
   * Start the countdown
   * @method
   */
  countdown() {
    this.tick = setInterval(() => {
      this.motion();
    }, 1000);
  }

  /**
   * @returns {number} Seconds left via pubSub
   */
  motion() {
    if (this.timeLeft === 0) {
      this.endTimer();
    } else {
      this.timeLeft -= 1;
    }
    pubSub.publish('Timer:currentTime', this.timeLeft);
  }

  /**
   * End the countdown
   * @method
   */
  endTimer() {
    clearInterval(this.tick);
  }
}
