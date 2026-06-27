import type { BingoChallenge } from "@/types/bingo";

/** Full 9-challenge PLANNER board — mirrors seed data for UI/tests until KAN-33 loads Firestore. */
export const testPlannerBingoChallenges: BingoChallenge[] = [
  {
    challengeId: "planner-0",
    position: 0,
    title: "separate account",
    whatToDo: "Keep your savings in a separate, dedicated high interest savings account",
    whyItMatters: "Hide your money so you aren't tempted to spend it.",
  },
  {
    challengeId: "planner-1",
    position: 1,
    title: "review subscriptions",
    whatToDo: "List out all your paid subscriptions and check if you still need / want them?",
    whyItMatters:
      "Subscription payments are easy and automated but they can be easily forgotten. You may be paying for something you do not need or want anymore. Consider downgrading if you do not want to cancel.",
  },
  {
    challengeId: "planner-2",
    position: 2,
    title: "automate a bill",
    whatToDo:
      "Automate at least one of your bills so you never miss a payment, leaving the rest of your money guilt-free for spending or short-term goals.",
    whyItMatters:
      "Free spirits often dislike the daily or weekly maintenance of budgeting. The best strategy is automation:",
  },
  {
    challengeId: "planner-3",
    position: 3,
    title: "last month's expenses",
    whatToDo:
      "Take a look at your bank account or credit card statement from last month. Do you understand what all the money out items were?",
    whyItMatters:
      "A periodic review of your expenses helps identify any recurring charges you could reduce or drop.",
  },
  {
    challengeId: "planner-4",
    position: 4,
    title: "Emoot Savings Goal",
    whatToDo:
      "From your Emoot account, select Emoot Saving and create your Savings Goal. Add a title and description, select the type of goal, enter a $ amount to save and by-when. Add a photo to make it yours!",
    whyItMatters:
      "As a planner you may already have goals for yourself for the short, mid and longer term. Your Emoot Savings Goal can help you pay-off debt faster, or save for your vacation, wishlist, or major purchase.",
  },
  {
    challengeId: "planner-5",
    position: 5,
    title: "skip one impulse buy",
    whatToDo:
      "Next time you feel the urge to buy something unplanned, pause for 24 hours. If you still want it tomorrow, that's okay, but often the urge passes. Mark this complete once you've successfully skipped one impulse purchase.",
    whyItMatters:
      "Planners often stick to budgets well but can still fall into occasional impulse traps. Building this habit strengthens your financial discipline and frees up more for your goal.",
  },
  {
    challengeId: "planner-6",
    position: 6,
    title: "share your Goal-link",
    whatToDo:
      "Pick 3 people to share your Emoot Savings Goal-link by sending them the URL or letting them scan your QR code.",
    whyItMatters:
      "Declaring your goal is another important step to making it happen. Your friends and family can cheer you on, will see your goal, your progress and may even help you out by sending you an Emoot Gift.",
  },
  {
    challengeId: "planner-7",
    position: 7,
    title: "1 month budget",
    whatToDo:
      'Think about next month and list your "money in" and "money out" expectations. Congrats! you\'ve just created a budget.',
    whyItMatters:
      'It\'s easy to spend more than we have with credit cards, lines of credit and loans. Being aware when more money is "going out" than "coming in" is a good first step towards better budgetting.',
  },
  {
    challengeId: "planner-8",
    position: 8,
    title: "Reach 25% of your goal",
    whatToDo: "FLAG: paste What-to-Do from the sheet",
    whyItMatters: "FLAG: paste Why-it-Matters from the sheet",
  },
];

/** Stub fixture map — only PLANNER populated until KAN-33 loads all types. */
export const testBingoChallengesByType = {
  PLANNER: testPlannerBingoChallenges,
} as const;

export const testCompletedEmpty: string[] = [];

export const testCompletedPartial: string[] = ["planner-0", "planner-2", "planner-5"];

/** Top row complete — one bingo line. */
export const testCompletedOneLine: string[] = ["planner-0", "planner-1", "planner-2"];

export const testCompletedAll: string[] = testPlannerBingoChallenges.map(
  (challenge) => challenge.challengeId,
);
