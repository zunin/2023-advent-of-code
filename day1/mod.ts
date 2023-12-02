import { getCalibrationValue, getCalibrationValueWithSpelledDigits } from "./calibrationdeenhancer.ts"

const rawInput = await Deno.readTextFile("day1/input.txt");
const calibrationLines = rawInput.split("\n");

const sum = calibrationLines.map(input => getCalibrationValue(input))
    .reduce((sum, value) => {
        return sum + value;
    }, 0);
console.log(`The sum of the deenhanced lines is ${sum}`);

const sumPart2 = calibrationLines.map(input => getCalibrationValueWithSpelledDigits(input))
    .reduce((sum, value) => {
        return sum + value;
    }, 0);
console.log(`The sum of the deenhanced lines with letters allowed is ${sumPart2}`);