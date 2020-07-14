import pubSub from '../helpers/pubSub';

export default class Timer {
  constructor(time) {
    this.timeLeft = time;
    this.tick = null;
  }

  countdown(section) {
    this.tick = setInterval(() => {
      this.motion(section);
    }, 1000);
  }

  motion() {
    if (this.timeLeft === 0) {
      this.endTimer();
    } else {
      this.timeLeft -= 1;
    }
    pubSub.publish('Timer:currentTime', this.timeLeft);
  }

  endTimer() {
    clearInterval(this.tick);
  }
}
