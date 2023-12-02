import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { getCalibrationValue, getCalibrationValueWithSpelledDigits } from "./calibrationdeenhancer.ts"

Deno.test("example #1", () => {
  const result = getCalibrationValue("1abc2")
  assertEquals(result, 12);
});

Deno.test("example #2", () => {
  const result = getCalibrationValue("pqr3stu8vwx")
  assertEquals(result, 38);
});

Deno.test("example #3", () => {
  const result = getCalibrationValue("a1b2c3d4e5f")
  assertEquals(result, 15);
});

Deno.test("example #4", () => {
  const result = getCalibrationValue("treb7uchet")
  assertEquals(result, 77);
});

Deno.test("example part 2 #1", () => {
  const result = getCalibrationValueWithSpelledDigits("two1nine")
  assertEquals(result, 29);
});

Deno.test("example part 2 #2", () => {
  const result = getCalibrationValueWithSpelledDigits("eightwothree")
  assertEquals(result, 83);
});

Deno.test("example part 2 #3", () => {
  const result = getCalibrationValueWithSpelledDigits("abcone2threexyz")
  assertEquals(result, 13);
});

Deno.test("example part 2 #4", () => {
  const result = getCalibrationValueWithSpelledDigits("xtwone3four")
  assertEquals(result, 24);
});

Deno.test("example part 2 #5", () => {
  const result = getCalibrationValueWithSpelledDigits("4nineeightseven2")
  assertEquals(result, 42);
});

Deno.test("example part 2 #6", () => {
  const result = getCalibrationValueWithSpelledDigits("zoneight234")
  assertEquals(result, 14);
});

Deno.test("example part 2 #7", () => {
  const result = getCalibrationValueWithSpelledDigits("7pqrstsixteen")
  assertEquals(result, 76);
});

Deno.test("part 2 multiple occurances", () => {
  const result = getCalibrationValueWithSpelledDigits("9ninehbsgkcthree1nineeightsix9")
  assertEquals(result, 99);
});
