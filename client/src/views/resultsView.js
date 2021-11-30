import { chart } from 'highcharts';
import createAndAppend from '../helpers/createAndAppend.js';
import { subscribe } from '../helpers/pubSub.js';

/**
 * A view of the results & high scores after finishing the game
 */
export default class ResultsView {
  bindEvent() {
    subscribe('Game:end-game', (event) => {
      /** @type {HTMLCanvasElement | null} */
      const container = document.querySelector('#end-screen');
      if (container) container.style.display = 'flex';
      const messageContainer = document.querySelector('#end-message');
      const winner = event.detail.currentPlayer.name;
      if (messageContainer) createAndAppend('h2', messageContainer, `${winner} won!`, null, null);
    });
    subscribe('HighScore:allscores', (event) => {
      const allScores = event.detail;
      /** @type {HTMLCanvasElement | null} */
      const highScoresContainer = document.querySelector('#highscores');
      if (highScoresContainer) this.render(highScoresContainer, allScores);
    });
  }

  /**
   *
   * @param {HTMLElement} section
   * @param {import('../../../params').Entry[]} scores
   */
  render(section, scores) {
    chart(section, {
      chart: {
        type: 'bar',
      },
      title: {
        text: 'High Score',
      },
      subtitle: {
        text: 'Source: Pie In the Sky',
      },
      xAxis: {
        categories: scores.map((score) => score.name),
        crosshair: true,
      },
      yAxis: {
        min: 0,
        max: 10,
        title: {
          text: 'Score Out Of 10',
        },
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat:
          '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true,
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
        },
      },
      series: [
        {
          type: 'bar',
          data: scores.map((score) => score.wins),
        },
      ],
    });
  }
}
