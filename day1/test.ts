import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { getCalibrationValue } from "./calibrationdeenhancer.ts"

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
