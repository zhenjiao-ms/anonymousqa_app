/**
 * Adaptive Card data model. Properties can be referenced in an adaptive card via the `${var}`
 * Adaptive Card syntax.
 */
export interface CardData {
  title: string;
  body: string;
}

export interface QuestionCardData {
  title: string;
  body: string;
  questionId: number;
  questionText: string;
}
