export type Channels =
  | 'Board:player-move'
  | 'BoardView:category'
  | 'Card:question-data'
  | 'Card:is-correct'
  | 'Game:current-player-change'
  | 'Game:player-choose-move'
  | 'Game:score-change'
  | 'Game:end-game'
  | 'HighScore:allscores'
  | 'Player:rollnumber'
  | 'QuestionView:answer-selected'
  | 'Timer:currentTime';

export function CreateAndAppend<T extends keyof HTMLElementTagNameMap>(tag: T, parent: Node, text: string | null, htmlclass: string | null, id: string | null): HTMLElementTagNameMap[T];

export type Entry = {
  name: string;
  wins: number;
  dbId: string;
}

export type Rows = 'r1' | 'r2' | 'r3' | 'r4' | 'r5' | 'r6';

export type RetrievedCard = {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export type Results = {
  results: RetrievedCard[];
}

export type Category = {
  name: string;
  categoryId: number;
  currentCard: number;
  cards: RetrievedCard[] | [];
}

export type CurrentQuestion = {
  category: string;
  question: string;
  correctAnswer: string;
  allAnswers: string[];
}
