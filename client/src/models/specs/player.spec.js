// eslint-disable-next-line import/no-extraneous-dependencies
import mocha from 'mocha';
import { strictEqual, deepStrictEqual } from 'assert';
import Player from '../player.js';

const { describe, it, beforeEach } = mocha;

describe('Player', function () {
  let player;
  beforeEach(function () {
    player = new Player('Mike', 'p2', 'player2');
  });

  it('should have a position', function () {
    const actual = player.position;
    strictEqual(actual, 'a1');
  });

  it('should have a score', function () {
    const actual = player.score;
    deepStrictEqual(actual, [0, 0, 0, 0, 0, 0]);
  });
});
