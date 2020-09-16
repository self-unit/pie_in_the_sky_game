const assert = require('assert');
const Player = require('../player.js');

describe('Player', function() {
  beforeEach(function() {
    player = new Player('Mike', 'p2', 'player2');
  });

  it('should have a position', function() {
    const actual = player.position;
    assert.strictEqual(actual, 'a1');
  });

  it('should have a score', function() {
    const actual = player.score;
    assert.deepStrictEqual(actual, [0, 0, 0, 0, 0, 0]);
  });
});
