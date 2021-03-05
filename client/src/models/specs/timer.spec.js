// eslint-disable-next-line import/no-extraneous-dependencies
import mocha from 'mocha';
import { strictEqual } from 'assert';
import Timer from '../timer.js';

const { describe, it, beforeEach } = mocha;

describe('Timer', function () {
  let timer;
  beforeEach(function () {
    timer = new Timer(10);
  });

  it('should have seconds', function () {
    timer.countdown();
    const actual = timer.timeLeft;
    strictEqual(actual, 10);
  });
});
