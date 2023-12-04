import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { parseLine, PointTeller, CardTeller } from "./card.ts"

Deno.test("Card toString() outputs its own input", () => {
    const input = "Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53";

    assertEquals(parseLine(input).toString(), input);
});

Deno.test("Card 1 has specific winning numbers", () => {
    const input = "Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53";

    assertEquals(parseLine(input).getWinningNumbers(), [83, 86, 17, 48]);
});

Deno.test("Card 1 is worth 8 points", () => {
    const input = "Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53";
    
    assertEquals(PointTeller.tallyCard(parseLine(input)), 8);
});

Deno.test("Card 2 is worth 2 points", () => {
    const input = "Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19";
    
    assertEquals(PointTeller.tallyCard(parseLine(input)), 2);
});

Deno.test("Card 5 is worth no points", () => {
    const input = "Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36";
    
    assertEquals(PointTeller.tallyCard(parseLine(input)), 0);
});

const cardInput = `
Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
`;

Deno.test("Example pile of scratchcards is 30", () => {    
    assertEquals(new CardTeller(cardInput).tallyScartchCards(), 30);
});

Deno.test("Example pile of scratchcards has specific tally", () => {    
    const teller = new CardTeller(cardInput);
    teller.tallyScartchCards();
    const cardCopysDictionary = teller.cardCopys.dictionary;
    const cardIdCountMapping = Object.keys(cardCopysDictionary).map(cardId => {
        return {cardId, count: cardCopysDictionary[Number.parseInt(cardId)].count}
    }).reduce((obj, {cardId, count}) => {
        return {
            ...obj,
            [cardId]: count
        }
    }, {} as {[id: string]: number})

    assertEquals(cardIdCountMapping, {
        1: 1,
        2: 2,
        3: 4,
        4: 8,
        5: 14,
        6: 1
    });
});
