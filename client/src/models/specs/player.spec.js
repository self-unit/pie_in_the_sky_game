import Player from '../player';

describe('Player', () => {
  test('should have a position', () => {
    const player = new Player('Mike', 'p2', 'player2');
    const actual = player.position;
    expect(actual).toStrictEqual('a1');
  });

  test('should have a score', () => {
    const player = new Player('Mike', 'p2', 'player2');
    const actual = player.score;
    expect(actual).toStrictEqual([0, 0, 0, 0, 0, 0]);
  });

  test('should have a name', () => {
    const player = new Player('Mike', 'p2', 'player2');
    const actual = player.name;
    expect(actual).toStrictEqual('Mike');
  });
});
