import Timer from '../timer';

jest.mock('../../helpers/pubSub');
jest.useFakeTimers();

describe('Timer', () => {
  test('should have seconds when initialised', () => {
    const timer = new Timer(10);
    const actual = timer.timeLeft;
    expect(actual).toBe(10);
  });

  test('should have no seconds after countdown', () => {
    const timer = new Timer(10);
    timer.countdown();
    jest.advanceTimersByTime(7000);
    const actual = timer.timeLeft;
    expect(actual).toBe(3);
  });

  test('should reset time after endTimer', () => {
    const timer = new Timer(10);
    timer.countdown();
    jest.advanceTimersByTime(5000);
    timer.endTimer();
    expect(clearInterval).toBeCalled();
  });
});
