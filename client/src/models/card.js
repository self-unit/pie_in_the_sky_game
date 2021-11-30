import { get } from '../helpers/request.js';
import { subscribe, publish } from '../helpers/pubSub.js';
import randomizeArray from '../helpers/randomizeArray.js';

/**
 * A question Card with url, difficulty, and currentQuestion object
 * which contains the category, question, correctAnswer and allAnswers
 */
export default class Card {
  /**
   * @param {string} difficulty
   */
  constructor(difficulty) {
    this.baseUrl = 'https://opentdb.com/api.php?amount=20&category=';
    this.difficulty = difficulty;
    /** @type {import('../../../params').CurrentQuestion} */
    this.currentQuestion = {
      category: '',
      question: '',
      correctAnswer: '',
      allAnswers: [],
    };

    /**
     * @type {import('../../../params').Category[]}
     */
    this.categories = [
      {
        name: 'movies',
        categoryId: 11,
        currentCard: 0,
        cards: [],
      },
      {
        name: 'science',
        categoryId: 17,
        currentCard: 0,
        cards: [],
      },
      {
        name: 'sports',
        categoryId: 21,
        currentCard: 0,
        cards: [],
      },
      {
        name: 'history',
        categoryId: 23,
        currentCard: 0,
        cards: [],
      },
      {
        name: 'music',
        categoryId: 12,
        currentCard: 0,
        cards: [],
      },
      {
        name: 'books',
        categoryId: 10,
        currentCard: 0,
        cards: [],
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

  /**
   * @param {import('../../../params').Category} category
   */
  sortQuestion(category) {
    const cardQuestion = category.cards.pop();
    if (cardQuestion) {
      const allAnswers = cardQuestion.incorrect_answers;
      allAnswers.push(cardQuestion.correct_answer);
      this.currentQuestion = {
        category: cardQuestion.category,
        question: cardQuestion.question,
        correctAnswer: cardQuestion.correct_answer,
        allAnswers: randomizeArray(allAnswers),
      };
    }
    publish('Card:question-data', this.currentQuestion);
  }

  /**
   * @param {import('../../../params').Category} category
   * @returns {Promise<void>}
   */
  async loadCategoryQuestions(category) {
    const quizUrl = `${this.baseUrl}${category.categoryId}&difficulty=${this.difficulty}&type=multiple`;
    /** @type {import('../../../params').Results[]} */
    const response = await get(quizUrl);
    response.forEach((cards) => {
      const currentCategory = { ...category, cards: cards.results.splice(0, 25) };
      this.sortQuestion(currentCategory);
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
        await this.loadCategoryQuestions(currentCategory[0]);
      } else {
        this.sortQuestion(currentCategory[0]);
      }
    });
  }

  /**
   * @param {number} selectedIndex
   */
  answerSelected(selectedIndex) {
    const { correctAnswer } = this.currentQuestion;
    const selectedAnswer = this.currentQuestion.allAnswers[selectedIndex];
    publish('Card:is-correct', {
      isCorrect: selectedAnswer === correctAnswer,
      category: this.currentQuestion.category,
    });
  }
}
