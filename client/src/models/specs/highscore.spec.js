import { URL } from 'url';
import HighScore from '../highscore.js';

const apiUrl = new URL('http://localhost:3000/api/highscore');
const currentEntries = [
  { name: 'test', wins: 1, dbId: '1' },
  { name: 'test2', wins: 2, dbId: '2' },
  { name: 'test3', wins: 3, dbId: '3' },
];
/** @type {HighScore} */
let highscore;

globalThis.fetch = jest
  .fn()
  .mockImplementation(
    (
      /** @type {URL} */ url,
      /** @type {{ method: string, body: BodyInit, headers: HeadersInit } | undefined} */ options
    ) => {
      if (options?.method === 'PUT') {
        return Promise.resolve({
          json: () => {
            const body = JSON.parse(`${options.body}`);
            let winner = currentEntries.find(
              (entry) => entry.dbId === url.toString().split('/').pop()
            );
            if (winner) winner = { ...winner, ...body };
            return Promise.resolve(currentEntries[0]);
          },
        });
      }
      if (options?.method === 'POST') {
        return Promise.resolve({
          json: () => {
            const body = JSON.parse(`${options.body}`);
            const entry = { ...body, dbId: url.toString().split('/').pop() };
            currentEntries.push(entry);
            return Promise.resolve(currentEntries);
          },
        });
      }
      return Promise.resolve({
        json: () => Promise.resolve(currentEntries),
      });
    }
  );

describe('HighScore', () => {
  describe('correct initialization', () => {
    it('should initialize with a url', () => {
      highscore = new HighScore(apiUrl);
      expect(highscore.url).toBe(apiUrl);
    });

    describe('getNames', () => {
      it('should get all the names from the highscore', async () => {
        highscore = new HighScore(apiUrl);
        await highscore.getNames();
        expect(highscore.currentEntries).toEqual(currentEntries);
      });
    });

    describe('updatePlayer', () => {
      it('should update the player if found in the highscore', async () => {
        highscore = new HighScore(apiUrl);
        await highscore.getNames();
        await highscore.updatePlayer('test');
        expect(highscore.currentEntries && highscore.currentEntries[0].wins).toEqual(2);
      });
    });

    describe('postPlayer', () => {
      it('should add the player if not found in the highscore', async () => {
        highscore = new HighScore(apiUrl);
        await highscore.getNames();
        await highscore.postPlayer('test4');
        expect(highscore.currentEntries && highscore.currentEntries[3].name).toEqual('test4');
      });
    });
  });

  describe('incorrect initialization', () => {
    it('should throw an error if no url is provided', () => {
      expect(() => {
        // @ts-ignore intentional error
        highscore = new HighScore();
      }).toThrowError('Highscore:url must be provided');
    });
  });
});
