import Request from '../helpers/request.js';
import { subscribe, publish } from '../helpers/pubSub.js';
import randomizeArray from '../helpers/randomizeArray.js';

class Card {
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
  }

  bindEvents() {
    this.showQuestion();
    subscribe('QuestionView:answer-selected', (event) => {
      const selectedIndex = event.detail;
      this.answerSelected(selectedIndex);
    });
  }

  async loadCategoryQuestions(category) {
    const quizUrl = `${this.baseUrl}${category[0].categoryId}&difficulty=${this.difficulty}&type=multiple`;
    const request = new Request(quizUrl);
    const response = await request.get();
    response.forEach((cards) => {
      this.category[0].cards = cards.results.splice(0, 25);
      this.sortQuestion(category[0]);
    });
  }

  showQuestion() {
    subscribe('BoardView:category', async (event) => {
      const categoryName = event.detail;
      const currentCategory = this.categories.filter((category) =>
        category.name.match(categoryName)
      );
      const question = currentCategory[0].cards;

      if (!question) {
        await this.loadCategoryQuestions(currentCategory);
      } else {
        this.sortQuestion(currentCategory[0]);
      }
    });
  }

  sortQuestion(category) {
    const cardQuestion = category.cards.pop();
    const allAnswers = cardQuestion.incorrect_answers;
    allAnswers.push(cardQuestion.correct_answer);
    this.currentQuestion = {
      category,
      question: cardQuestion.question,
      correctAnswer: cardQuestion.correct_answer,
      allAnswers: randomizeArray(allAnswers),
    };
    publish('Card:question-data', this.currentQuestion);
  }

  answerSelected(selectedIndex) {
    const { correctAnswer } = this.currentQuestion;
    const selectedAnswer = this.currentQuestion.allAnswers[selectedIndex];
    publish('Card:is-correct', {
      isCorrect: selectedAnswer === correctAnswer,
      category: this.currentQuestion.category.name,
    });
  }
}

export default Card;
