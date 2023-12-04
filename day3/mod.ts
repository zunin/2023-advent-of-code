import { parseSchematic, getPartsAdjacentToGears } from "./parseSchematic.ts";

const rawInput = await Deno.readTextFile("day3/input.txt");

const partNumbers  = parseSchematic(rawInput.trim());
const sumOfPartNumbers = partNumbers.reduce((sum, number) => sum + number);

console.log(`The sum of all of the part numbers in the engine schematic is ${sumOfPartNumbers}`);

const partsAdjacentToGears = getPartsAdjacentToGears(rawInput.trim());
const sumOfGearRadios = partsAdjacentToGears
    .map(([a, b]) => Number.parseInt(a.value) * Number.parseInt(b.value))
    .reduce((sum, product) => sum + product, 0);

console.log(`The sum of all of the gear ratios in your engine schematic is ${sumOfGearRadios}`) // less than 93205141
