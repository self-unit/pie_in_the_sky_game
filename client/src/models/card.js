const Request = require('../helpers/request.js');
const PubSub = require('../helpers/pub_sub.js');
const randomizeArray = require('../helpers/randomize_array.js');

const Card = function(difficulty) {
  this.baseUrl = 'https://opentdb.com/api.php?amount=20&category=';
  this.currentQuestion = 0;
  this.difficulty = difficulty;

  this.categories = [
    {
      name: 'movies',
      categoryId: 11,
      currentCard: 0,
      cards: null,
    },
    {
      name: 'science',
      categoryId: 17,
      currentCard: 0,
      cards: null,
    },
    {
      name: 'sports',
      categoryId: 21,
      currentCard: 0,
      cards: null,
    },
    {
      name: 'history',
      categoryId: 23,
      currentCard: 0,
      cards: null,
    },
    {
      name: 'music',
      categoryId: 12,
      currentCard: 0,
      cards: null,
    },
    {
      name: 'books',
      categoryId: 10,
      currentCard: 0,
      cards: null,
    },
  ];
};

Card.prototype.bindEvents = function() {
  this.showQuestion();
  PubSub.subscribe('QuestionView:answer-selected', (event) => {
    const selectedIndex = event.detail;
    this.answerSelected(selectedIndex);
  });
};

Card.prototype.loadCategoryQuestions = function(category) {
  const quizUrl = `${this.baseUrl}${category[0].categoryId}&difficulty=${this.difficulty}&type=multiple`;
  const request = new Request(quizUrl);

  request.get().then((cards) => {
    category[0].cards = cards.results.splice(0, 25);
    this.sortQuestion(category[0]);
  });
};

Card.prototype.showQuestion = function() {
  PubSub.subscribe('BoardView:category', (event) => {
    const categoryName = event.detail;
    const currentCategory = this.categories.filter((category) => category.name.match(categoryName));
    const question = currentCategory[0].cards;

    if (!question) {
      this.loadCategoryQuestions(currentCategory);
    } else {
      this.sortQuestion(currentCategory[0]);
    }
  });
};

Card.prototype.sortQuestion = function(category) {
  const cardQuestion = category.cards.pop();
  const allAnswers = cardQuestion.incorrect_answers;
  allAnswers.push(cardQuestion.correct_answer);
  this.currentQuestion = {
    category,
    question: cardQuestion.question,
    correctAnswer: cardQuestion.correct_answer,
    allAnswers: randomizeArray(allAnswers),
  };
  PubSub.publish('Card:question-data', this.currentQuestion);
};

Card.prototype.answerSelected = function(selectedIndex) {
  const {correctAnswer} = this.currentQuestion;
  const selectedAnswer = this.currentQuestion.allAnswers[selectedIndex];
  PubSub.publish('Card:is-correct', {
    isCorrect: selectedAnswer === correctAnswer,
    category: this.currentQuestion.category.name,
  });
};

module.exports = Card;
