import assert from 'assert';
import Player from '../player';

describe('Player', () => {
  beforeEach(() => {
    const player = new Player('Mike', 'p2', 'player2');
  });

  it('should have a position', () => {
    const actual = player.position;
    assert.strictEqual(actual, 'a1');
  });

  it('should have a score', () => {
    const actual = player.score;
    assert.deepStrictEqual(actual, [0, 0, 0, 0, 0, 0]);
  });
});
