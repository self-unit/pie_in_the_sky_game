const assert = require('assert');
const Timer = require('../timer.js');

describe('Timer', function() {
  beforeEach(function() {
    timer = new Timer(10);
  });

  it('should have seconds', function() {
    timer.countdown();
    const actual = timer.timeLeft;
    assert.strictEqual(actual, 10);
  });
});
