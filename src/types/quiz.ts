/** Provisional domain types — reconcile with KAN-17 when it closes. */

export type QuizOption = {
  id: string;
  text: string;
};

export type Question = {
  id: string;
  text: string;
  options: QuizOption[];
};
