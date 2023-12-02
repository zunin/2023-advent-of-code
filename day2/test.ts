import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { MinimumCubeCondition, parseGameRecord } from "./mod.ts"

Deno.test("parse reproduces input with tostring()", () => {
  const gameInput = "Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green";
  assertEquals(parseGameRecord(gameInput).toString(), gameInput);
});

const cubeQuery: MinimumCubeCondition = {
    red: 12,
    green: 13,
    blue: 14
};

Deno.test("game 1 is possible", () => {
    assertEquals(parseGameRecord("Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green").isPossibleWithCondition(cubeQuery), true)
});

Deno.test("game 2 is possible", () => {
    assertEquals(parseGameRecord("Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue").isPossibleWithCondition(cubeQuery), true)
});

Deno.test("game 3 is not possible", () => {
    assertEquals(parseGameRecord("Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red").isPossibleWithCondition(cubeQuery), false)
});

Deno.test("game 4 is not possible", () => {
    assertEquals(parseGameRecord("Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red").isPossibleWithCondition(cubeQuery), false)
});

Deno.test("game 5 is possible", () => {
    assertEquals(parseGameRecord("Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green").isPossibleWithCondition(cubeQuery), true)
});
