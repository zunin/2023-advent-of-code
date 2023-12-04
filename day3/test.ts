import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { parseSchematic, CoordinateObject, ObjectMap, getPartsAdjacentToGears } from "./parseSchematic.ts";

Deno.test("Test neighboring objects diagonal", () => {
    assertEquals(
        new CoordinateObject({x: 0, y: 0}, "467", "digit").neighbouringXY(),
        [{x: -1, y: -1}, {x: 0, y: -1}, {x: 1, y: -1}, {x: 2, y: -1}, {x: 3, y: -1}].concat(
        [{x: -1, y:  0}, /*                 467                    */ {x: 3, y:  0}]).concat(
        [{x: -1, y:  1}, {x: 0, y:  1}, {x: 1, y:  1}, {x: 2, y:  1}, {x: 3, y:  1}])
    );
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

Deno.test("can replicate input from object map", () => {
    const map = new ObjectMap(engineSchematic).toString();
    assertEquals(map, engineSchematic.trim())
});

Deno.test("can retrieve the correct part numbers for gear", () => {

    const partNumbers = getPartsAdjacentToGears(engineSchematic);

    assertEquals(partNumbers, [
        [new CoordinateObject({x: 0, y: 0}, "467", "digit"), new CoordinateObject({x: 2, y: 2}, "35", "digit")],
        [new CoordinateObject({x: 6, y: 7}, "755", "digit"), new CoordinateObject({x: 5, y: 9}, "598", "digit")],
    ]);
    
});
