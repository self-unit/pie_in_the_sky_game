import assert from 'assert';
import Timer from '../timer';

describe('Timer', () => {
  beforeEach(() => {
    const timer = new Timer(10);
  });

  it('should have seconds', () => {
    timer.countdown();
    const actual = timer.timeLeft;
    assert.strictEqual(actual, 10);
  });
});
