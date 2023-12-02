export function getCalibrationValue(input: string): number {
  const digits = input.split("").filter(character => !Number.isNaN(Number.parseInt(character)))
  const firstDigit = digits[0];
  const lastDigit = digits.pop();

  const combinedDigits = `${!firstDigit ? '' : firstDigit}${!lastDigit ? '' : lastDigit}`;
  const result = Number.parseInt(!combinedDigits ? '0' : combinedDigits);

  return result;
}

export function getCalibrationValueWithSpelledDigits(input: string): number {
  const allowedValues = [
    "one", "1",
    "two", "2",
    "three", "3",
    "four", "4",
    "five", "5",
    "six", "6",
    "seven", "7",
    "eight", "8",
    "nine", "9",
  ];

  const isNumber = (value: string) => !Number.isNaN(Number.parseInt(value));
  const getNextAllowedValue = (value: string) => allowedValues[allowedValues.indexOf(value) + 1];
  const translateNumberToDigit = (value: string) => isNumber(value) ? value : getNextAllowedValue(value);


  const indexmap = allowedValues.map((value) => {
    return {
      hit: translateNumberToDigit(value),
      firstIndex: input.indexOf(value),
      lastIndex: input.lastIndexOf(value)
    }
  }).filter(index => index.firstIndex !== -1);

  const firstDigit = indexmap.sort((a, b) => a.firstIndex - b.firstIndex)[0];
  const lastDigit  = indexmap.sort((a, b) => b.lastIndex - a.lastIndex)[0];

  const result = (firstDigit?.hit ?? "")+(lastDigit?.hit ?? "");

  return Number.parseInt(!result ? "0" : result);
}
