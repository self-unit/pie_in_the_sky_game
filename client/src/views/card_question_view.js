const he = require('he');
const createAndAppend = require('../helpers/create_append.js');
const PubSub = require('../helpers/pub_sub.js');

const QuestionView = function() {
  this.element = document.querySelector('#question-card');
};

QuestionView.prototype.bindEvents = function() {
  PubSub.subscribe('Card:question-data', (event) => {
    const questionData = event.detail;
    this.render(questionData);
  });
};

QuestionView.prototype.render = function(questionData) {
  this.element.innerHTML = '';
  const questionText = he.decode(questionData.question);
  const question = createAndAppend('div', null, null, questionText, this.element);
  const answers = createAndAppend('ul', null, null, null, this.element);
  questionData.allAnswers.forEach((answer, index) => {
    const answerText = he.decode(answer);
    const item = createAndAppend('li', null, null, null, answers);
    const radio = createAndAppend('input', null, null, null, item);
    radio.id = `answer-${index}`;
    radio.type = 'radio';
    radio.name = 'answerText';
    radio.value = index;

    const label = createAndAppend('label', null, null, null, item);
    label.htmlFor = radio.id;
    label.innerHTML = answer;

    radio.addEventListener('change', (event) => {
      PubSub.publish('QuestionView:answer-selected', event.target.value);
      const radioButtons = document.querySelectorAll('input[type=radio]');
      for (i = 0; i < radioButtons.length; i++) {
        radioButtons[i].disabled = true;
      }
      const correctAnswerText = he.decode(questionData.correctAnswer);
      const showResult = createAndAppend('p', null, null, `The correct answer is ${correctAnswerText}`, this.element);
      document.querySelector('#dieButton').disabled = false;
    });
  });
};

module.exports = QuestionView;
