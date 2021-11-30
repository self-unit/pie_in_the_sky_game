import Player from '../player.js';

/** @type {Player} */
let player;

describe('Player', () => {
  describe('correct initialisation', () => {
    beforeEach(() => {
      player = new Player('Mike', 2, 'player2');
    });

    it('should have a position', () => {
      const actual = player.position;
      expect(actual).toBe('a1');
    });

    it('should have a score', () => {
      const actual = player.score;
      expect(actual).toStrictEqual([0, 0, 0, 0, 0, 0]);
    });
  });

  describe('incorrect initialisation', () => {
    it('should throw an error if no name is provided', () => {
      // @ts-ignore intentional bad type
      expect(() => new Player(null, 2, 'player2')).toThrow(Error);
    });
  });
});
