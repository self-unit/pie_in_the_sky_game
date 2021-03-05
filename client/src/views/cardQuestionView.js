import he from 'he';
import createAndAppend from '../helpers/createAndAppend.js';
import { subscribe, publish } from '../helpers/pubSub.js';

const { decode } = he;

class QuestionView {
  constructor() {
    this.element = document.querySelector('#question-card');
  }

  bindEvents() {
    subscribe('Card:question-data', (event) => {
      const questionData = event.detail;
      this.render(questionData);
    });
  }

  render(questionData) {
    this.element.innerHTML = '';
    const questionText = decode(questionData.question);
    createAndAppend('div', null, null, questionText, this.element);
    const answers = createAndAppend('ul', null, null, null, this.element);
    questionData.allAnswers.forEach((answer, index) => {
      const answerText = decode(answer);
      const item = createAndAppend('li', null, null, null, answers);
      const radio = createAndAppend('input', null, null, null, item);
      radio.id = `answer-${index}`;
      radio.type = 'radio';
      radio.name = `${answerText}`;
      radio.value = index;

      const label = createAndAppend('label', null, null, null, item);
      label.htmlFor = radio.id;
      label.innerHTML = answer;

      radio.addEventListener('change', (event) => {
        publish('QuestionView:answer-selected', event.target.value);
        const radioButtons = document.querySelectorAll('input[type=radio]');
        for (let i = 0; i < radioButtons.length; i += 1) {
          radioButtons[i].disabled = true;
        }
        const correctAnswerText = decode(questionData.correctAnswer);
        createAndAppend(
          'p',
          null,
          null,
          `The correct answer is ${correctAnswerText}`,
          this.element
        );
        document.querySelector('#dieButton').disabled = false;
      });
    });
  }
}

export default QuestionView;
