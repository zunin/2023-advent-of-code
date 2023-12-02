import { getCalibrationValue } from "./calibrationdeenhancer.ts"

const rawInput = await Deno.readTextFile("day1/input.txt");
const calibrationLines = rawInput.split("\n");
const deenhancedLines = calibrationLines.map(input => getCalibrationValue(input));
console.log(deenhancedLines)
const sum = deenhancedLines
    .reduce((sum, value) => {
        return sum + value;
    }, 0);
console.log(`The sum of the deenhanced lines is ${sum}`);
