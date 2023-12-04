import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { parseLine, Teller } from "./card.ts"

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
    
    assertEquals(Teller.tallyCard(parseLine(input)), 8);
});

Deno.test("Card 2 is worth 2 points", () => {
    const input = "Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19";
    
    assertEquals(Teller.tallyCard(parseLine(input)), 2);
});

Deno.test("Card 5 is worth no points", () => {
    const input = "Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36";
    
    assertEquals(Teller.tallyCard(parseLine(input)), 0);
});
