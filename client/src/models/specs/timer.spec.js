import Timer from '../timer.js';

/** @type {Timer} */
let timer;

describe('Timer', () => {
  describe('correct initialisation', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      timer = new Timer(10);
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should have seconds', () => {
      timer.countdown();
      const actual = timer.timeLeft;
      expect(actual).toBe(10);
    });

    it('should count down over time', () => {
      timer.countdown();
      const { tick } = timer;
      expect(tick).not.toBe(undefined);
      jest.advanceTimersByTime(5000);
      const { timeLeft } = timer;
      expect(timeLeft).toBe(5);
    });
  });

  describe('incorrect instantiation', () => {
    it('should throw an error if no time is provided', () => {
      // @ts-ignore intentional bad type
      expect(() => new Timer(null)).toThrow(Error);
    });
  });
});
