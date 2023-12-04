import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { parseSchematic, CoordinateObject } from "./parseSchematic.ts";

Deno.test("Test neighboring objects diagonal", () => {
    assertEquals(
        new CoordinateObject({x: 0, y: 0}, "467", "digit").isNeighbour(
        new CoordinateObject({x: 3, y: 1}, "*", "symbol")),
    true);
});

Deno.test("Test neighboring objects above", () => {
    assertEquals(
        new CoordinateObject({x: 2, y: 2}, "35", "digit").isNeighbour(
        new CoordinateObject({x: 3, y: 1}, "*", "symbol")),
    true);
});

const engineSchematic = `
467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..
`;


Deno.test("can retrieve the correct part numbers", () => {

    const partNumbers  = parseSchematic(engineSchematic);

    assertEquals(partNumbers, [
        467,
        35,
        633,
        617,
        592,
        755,
        664,
        598
    ]);
});

