import Request from '../helpers/request';
import pubSub from '../helpers/pubSub';
import randomizeArray from '../helpers/randomizeArray';

export default class Card {
  constructor(difficulty) {
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
    this.currentCategory = null;
  }

  bindEvents() {
    this.showQuestion();
    pubSub.subscribe('QuestionView:answer-selected', (event) => {
      const selectedIndex = event.detail;
      this.answerSelected(selectedIndex);
    });
  }

  loadCategoryQuestions() {
    const quizUrl = `${this.baseUrl}${this.currentCategory[0].categoryId}&difficulty=${this.difficulty}&type=multiple`;
    const request = new Request(quizUrl);

    const cards = request.get();
    this.currentCategory[0].cards = cards.results.splice(0, 25);
    this.sortQuestion(this.currentCategory[0]);
  }

  showQuestion() {
    pubSub.subscribe('BoardView:category', (event) => {
      const categoryName = event.detail;
      this.currentCategory = this.categories.filter((category) =>
        category.name.match(categoryName),
      );
      const question = this.currentCategory[0].cards;

      if (!question) {
        this.loadCategoryQuestions();
      } else {
        this.sortQuestion();
      }
    });
  }

  sortQuestion() {
    const cardQuestion = this.currentCategory.cards.pop();
    const allAnswers = cardQuestion.incorrect_answers;
    allAnswers.push(cardQuestion.correct_answer);
    this.currentQuestion = {
      category: this.currentCategory,
      question: cardQuestion.question,
      correctAnswer: cardQuestion.correct_answer,
      allAnswers: randomizeArray(allAnswers),
    };
    pubSub.publish('Card:question-data', this.currentQuestion);
  }

  answerSelected(selectedIndex) {
    const { correctAnswer } = this.currentQuestion;
    const selectedAnswer = this.currentQuestion.allAnswers[selectedIndex];
    pubSub.publish('Card:is-correct', {
      isCorrect: selectedAnswer === correctAnswer,
      category: this.currentQuestion.category.name,
    });
  }
}
