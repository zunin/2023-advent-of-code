import { parse, Teller } from "./card.ts";

const rawInput = await Deno.readTextFile("day4/input.txt");

const cards = parse(rawInput);
const pointSum = cards.map(Teller.tallyCard).reduce((sum, points) => sum + points);

console.log(`The colorful cards are worth ${pointSum} points in total`)
