import { parseSchematic } from "./parseSchematic.ts";

const rawInput = await Deno.readTextFile("day3/input.txt");

const partNumbers  = parseSchematic(rawInput.trim());
const sumOfPartNumbers = partNumbers.reduce((sum, number) => sum + number);

console.log(`The sum of all of the part numbers in the engine schematic is ${sumOfPartNumbers}`);
