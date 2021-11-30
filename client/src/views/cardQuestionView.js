import * as he from 'he';
import createAndAppend from '../helpers/createAndAppend.js';
import { subscribe, publish } from '../helpers/pubSub.js';

const { decode } = he;

/**
 * @param {Element} element
 * @returns {element is HTMLButtonElement}
 */
const isButtonElement = (element) => {
  return /** @type {HTMLButtonElement} */ (element).disabled !== undefined;
};

/**
 * A view of the card question
 */
export default class QuestionView {
  constructor() {
    this.element = document.querySelector('#question-card');
  }

  bindEvents() {
    subscribe('Card:question-data', (event) => {
      const questionData = event.detail;
      this.render(questionData);
    });
  }

  /**
   * @param {import('../../../params').CurrentQuestion} questionData
   */
  render(questionData) {
    if (this.element) {
      this.element.innerHTML = '';
      const questionText = decode(questionData.question);
      /** @type {HTMLElementTagNameMap['div']} */
      // @ts-ignore
      const div = createAndAppend('div', this.element, questionText, null, null);
      /** @type {HTMLElementTagNameMap['ul']} */
      // @ts-ignore
      const answers = createAndAppend('ul', div, null, null, null);

      questionData.allAnswers.forEach((answer, index) => {
        const answerText = decode(answer);
        /** @type {HTMLElementTagNameMap['li']} */
        // @ts-ignore
        const item = createAndAppend('li', answers, null, null, null);
        /** @type {HTMLElementTagNameMap['input']} */
        // @ts-ignore
        const radio = createAndAppend('input', item, null, null, null);
        radio.id = `answer-${index}`;
        radio.type = 'radio';
        radio.name = `${answerText}`;
        radio.value = index.toString(10);
        /** @type {HTMLElementTagNameMap['label']} */
        // @ts-ignore
        const label = createAndAppend('label', item, null, null, null);
        label.htmlFor = radio.id;
        label.innerHTML = answer;

        radio.addEventListener('change', (event) => {
          if (event.target) publish('QuestionView:answer-selected', event.target.value);
          const radioButtons = document.querySelectorAll('input[type=radio]');
          for (let i = 0; i < radioButtons.length; i += 1) {
            const buttonElement = radioButtons[i];
            if (isButtonElement(buttonElement)) buttonElement.disabled = true;
          }
          const correctAnswerText = decode(questionData.correctAnswer);
          createAndAppend(
            'p',
            /** @type {Node} */ (this.element),
            `The correct answer is ${correctAnswerText}`,
            null,
            null
          );
          /** @type {HTMLButtonElement | null} */
          const dieButton = document.querySelector('#dieButton');
          if (dieButton) dieButton.disabled = false;
        });
      });
    }
  }
}
