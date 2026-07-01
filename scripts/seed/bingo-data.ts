import type { BingoChallenge, PersonalityTypeKey } from "./schema";

// =============================================================================
// bingoChallenges - from the spreadsheet. 9 per type, Challenge N -> position
// N-1, so each type's Challenge 5 ("Emoot Savings Goal") lands at the centre
// (position 4). title = "Bingo Card", whatToDo = "What to Do", whyItMatters =
// "Why it Matters".
// =============================================================================
function board(
  type: PersonalityTypeKey,
  items: ReadonlyArray<{ title: string; whatToDo: string; whyItMatters: string }>,
): BingoChallenge[] {
  if (items.length !== 9) {
    throw new Error(`${type}: expected 9 challenges, got ${items.length}`);
  }
  const slug = type.toLowerCase();
  return items.map((it, i) => ({
    challengeId: `${slug}-${i}`,
    position: i,
    title: it.title,
    whatToDo: it.whatToDo,
    whyItMatters: it.whyItMatters,
  }));
}

export const bingoChallenges: Record<PersonalityTypeKey, BingoChallenge[]> = {
  FREE_SPIRIT: board("FREE_SPIRIT", [
    {
      title: "separate account",
      whatToDo: "Keep your savings in a separate, dedicated high interest savings account.",
      whyItMatters: "Hide your money so you aren't tempted to spend it.",
    },
    {
      title: "1 month budget",
      whatToDo:
        'Think about next month and list your "money in" and "money out" expectations. Congrats! You\'ve just created a budget.',
      whyItMatters:
        'It\'s easy to spend more than we have with credit cards, lines of credit and loans. Being aware when more money is "going out" than "coming in" is a good first step towards better budgeting.',
    },
    {
      title: "automate savings",
      whatToDo:
        "Set up direct deposits that automatically route a percentage of your pay into high-interest savings accounts before you ever see it.",
      whyItMatters:
        "Automate the Boring Stuff: Set up Auto transfers right after payday so your savings are handled before you have a chance to feel the pinch.",
    },
    {
      title: "fun fund",
      whatToDo: "Allocate a small budget each month for spontaneous and fun expenses.",
      whyItMatters:
        'If you give yourself guilt-free "fun money" allowance you can say "yes" to smaller treats without derailing your big goals.',
    },
    {
      title: "Emoot Savings Goal",
      whatToDo:
        "Instead of saving for a generic rainy day, create a dedicated fund for what you love most: travel, spontaneous road trips, concerts, or hobbies.",
      whyItMatters:
        "Turn saving into a reward rather than a restriction. You are actively funding your next great memory.",
    },
    {
      title: "share your Goal-link",
      whatToDo:
        "Pick 3 people to share your Emoot Savings Goal-link by sending them the URL or letting them scan your QR code.",
      whyItMatters:
        "Creating savings challenges with friends keeps it social so you can share progress and celebrate wins together.",
    },
    {
      title: "last month's expenses",
      whatToDo:
        "Take a look at your bank account or credit card statement from last month. Do you understand what all the money out items were?",
      whyItMatters:
        "A periodic review of your expenses helps identify any recurring charges you could reduce or drop.",
    },
    {
      title: "treat yourself",
      whatToDo:
        "Plan a small, low-cost social event (like a potluck or game night) every time you reach a savings milestone.",
      whyItMatters:
        "Celebrate the milestones along the way to reward yourself for trying some new ways and means to reach your savings goal.",
    },
    {
      title: "automate a bill",
      whatToDo:
        "Automate at least one of your bills so you never miss a payment, leaving the rest of your money guilt-free for spending or short-term goals.",
      whyItMatters:
        "Free spirits often dislike the daily or weekly maintenance of budgeting. The best strategy for you is automating your bill payments so you aren't left scrambling.",
    },
  ]),

  OVERWHELMED_STARTER: board("OVERWHELMED_STARTER", [
    {
      title: "separate account",
      whatToDo: "Keep your savings in a separate, dedicated high interest savings account.",
      whyItMatters: "Hide your money so you aren't tempted to spend it.",
    },
    {
      title: "smallest debt first",
      whatToDo:
        "Pay off your smallest debt balance first; this could be the min monthly payment on a credit card.",
      whyItMatters: 'Build some early wins with smaller steps first aka "the snowball method".',
    },
    {
      title: "buy nothing day",
      whatToDo:
        'Pick a day to say "no" to a new purchase or expense. Consider adding that amount to your savings goal instead.',
      whyItMatters:
        "Resist the impulse to purchase something you can do without or can put off for a while. It will feel good adding this amount to your savings goal instead.",
    },
    {
      title: "$5 x 7 days",
      whatToDo: "Take a micro-step by putting aside $5 everyday for a week.",
      whyItMatters: "The habit is more important than the amount.",
    },
    {
      title: "Emoot Savings Goal",
      whatToDo:
        "From your Emoot account, select Emoot Saving and create your Savings Goal. Add a title and description, select the type of goal, enter a $ amount to save and by-when. Add a photo to make it yours!",
      whyItMatters:
        "For an overwhelmed starter, the best approach is to build a micro-savings goal of $500 to $1,000 to handle minor emergencies. This immediately removes financial anxiety without the pressure of long-term math.",
    },
    {
      title: "share your Goal-link",
      whatToDo:
        "Pick 3 people to share your Emoot Savings Goal-link by sending them the URL or letting them scan your QR code.",
      whyItMatters:
        "Declaring your goal is another important step to making it happen. Your friends and family can cheer you on, will see your goal, your progress and may even help you out by sending you an Emoot Gift.",
    },
    {
      title: "last month's expenses",
      whatToDo:
        'Take a look at your bank account or credit card statement from last month. Do you understand what all the "money out" items were?',
      whyItMatters:
        "A periodic review of your expenses helps identify any recurring charges you could reduce or drop.",
    },
    {
      title: "1 month budget",
      whatToDo:
        'Think about next month and list your "money in" and "money out" expectations. Congrats! You\'ve just created a budget.',
      whyItMatters:
        'It\'s easy to spend more than we have with credit cards, lines of credit and loans. Being aware when more money is "going out" than "coming in" is a good first step towards better budgeting.',
    },
    {
      title: "mini investment",
      whatToDo: "Get started with a small amount, $50, to put towards a longer term investment.",
      whyItMatters: "A small step to build longer term savings.",
    },
  ]),

  PLANNER: board("PLANNER", [
    {
      title: "separate account",
      whatToDo: "Keep your savings in a separate, dedicated high interest savings account",
      whyItMatters: "Hide your money so you aren't tempted to spend it.",
    },
    {
      title: "review subscriptions",
      whatToDo: "List out all your paid subscriptions and check if you still need / want them?",
      whyItMatters:
        "Subscription payments are easy and automated but they can be easily forgotten. You may be paying for something you do not need or want anymore. Consider downgrading if you do not want to cancel.",
    },
    {
      title: "automate a bill",
      whatToDo: "Automate your bill payments or recurring expenses.",
      whyItMatters:
        "Keeping your payments timely will help boost your credit rating and get you ready for that loan or mortgage in your future.",
    },
    {
      title: "last month's expenses",
      whatToDo:
        "Take a look at your bank account or credit card statement from last month. Do you understand what all the money out items were?",
      whyItMatters:
        "A periodic review of your expenses helps identify any recurring charges you could reduce or drop.",
    },
    {
      title: "Emoot Savings Goal",
      whatToDo:
        "From your Emoot account, select Emoot Saving and create your Savings Goal. Add a title and description, select the type of goal, enter a $ amount to save and by-when. Add a photo to make it yours!",
      whyItMatters:
        "As a planner you may already have goals for yourself for the short, mid and longer term. Your Emoot Savings Goal can help you pay-off debt faster, or save for your vacation, wishlist, or major purchase.",
    },
    {
      title: "skip one impulse buy",
      whatToDo:
        "Next time you feel the urge to buy something unplanned, pause for 24 hours. If you still want it tomorrow, that's okay, but often the urge passes. Mark this complete once you've successfully skipped one impulse purchase.",
      whyItMatters:
        "Planners often stick to budgets well but can still fall into occasional impulse traps. Building this habit strengthens your financial discipline and frees up more for your goal.",
    },
    {
      title: "share your Goal-link",
      whatToDo:
        "Pick 3 people to share your Emoot Savings Goal-link by sending them the URL or letting them scan your QR code.",
      whyItMatters:
        "Declaring your goal is another important step to making it happen. Your friends and family can cheer you on, will see your goal, your progress and may even help you out by sending you an Emoot Gift.",
    },
    {
      title: "1 month budget",
      whatToDo:
        'Think about next month and list your "money in" and "money out" expectations. Congrats! You\'ve just created a budget.',
      whyItMatters:
        'It\'s easy to spend more than we have with credit cards, lines of credit and loans. Being aware when more money is "going out" than "coming in" is a good first step towards better budgeting.',
    },
    {
      title: "Reach 25% of your goal",
      whatToDo: "Plan a way to celebrate reaching this milestone.",
      whyItMatters:
        "You are on your way! The first and most difficult part of your savings journey is behind you.",
    },
  ]),

  WORRIER: board("WORRIER", [
    {
      title: "separate account",
      whatToDo: "Keep your savings in a separate, dedicated high interest savings account.",
      whyItMatters: "Hide your money so you aren't tempted to spend it.",
    },
    {
      title: "$5 x 7 days",
      whatToDo: "Take a micro-step by putting aside $5 everyday for a week.",
      whyItMatters: "The habit is more important than the amount.",
    },
    {
      title: "the safety net",
      whatToDo:
        "Figure out what you need to cover 3 months of essential living expenses (home, utility, food).",
      whyItMatters: "Relieve some anxiety by protecting yourself against an unexpected expense.",
    },
    {
      title: "last month's expenses",
      whatToDo:
        "Take a look at your bank account or credit card statement from last month. Do you understand what all the money out items were?",
      whyItMatters:
        "A periodic review of your expenses helps identify any recurring charges you could reduce or drop.",
    },
    {
      title: "Emoot Savings Goal",
      whatToDo:
        "From your Emoot account, select Emoot Saving and create your Savings Goal. Add a title and description, select the type of goal, enter a $ amount to save and by-when. Add a photo to make it yours!",
      whyItMatters:
        "A worrier should focus on security-driven, anxiety-reducing goals. The most effective targets include a micro-emergency fund (like $1000) to stop immediate panic over sudden bills, followed by a robust 3-to-6 month living expense fund, and debt payoff to eliminate the stress of monthly obligations.",
    },
    {
      title: "share your Goal-link",
      whatToDo:
        "Pick 3 people to share your Emoot Savings Goal-link by sending them the URL or letting them scan your QR code.",
      whyItMatters:
        "Declaring your goal is another important step to making it happen. Your friends and family can cheer you on, will see your goal, your progress and may even help you out by sending you an Emoot Gift.",
    },
    {
      title: "1 month budget",
      whatToDo:
        'Think about next month and list your "money in" and "money out" expectations. Congrats! You\'ve just created a budget.',
      whyItMatters:
        'It\'s easy to spend more than we have with credit cards, lines of credit and loans. Being aware when more money is "going out" than "coming in" is a good first step towards better budgeting.',
    },
    {
      title: 'say "no" this week',
      whatToDo:
        'Say "no" to a new purchase or expense this week. Consider adding that amount to your savings goal instead.',
      whyItMatters:
        "Resist the impulse to purchase something you can do without or can put off for a while. It will feel good adding this amount to your savings goal instead.",
    },
    {
      title: "automate savings",
      whatToDo: "Set up automatic transfers to move money to a savings account.",
      whyItMatters:
        "Setting this up will be one less thing to worry about. Check your, so it won't sit on your mind.",
    },
  ]),
};
