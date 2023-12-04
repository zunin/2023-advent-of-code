import { parse, PointTeller, CardTeller } from "./card.ts";

const rawInput = await Deno.readTextFile("day4/input.txt");

const cards = parse(rawInput);
const pointSum = cards.map(PointTeller.tallyCard).reduce((sum, points) => sum + points, 0);

console.log(`The colorful cards are worth ${pointSum} points in total`);

const cardCount = new CardTeller(rawInput).tallyScartchCards();

console.log(`you end up with ${cardCount} total scratchcards`); //  8033370  -- That's not the right answer; your answer is too low
