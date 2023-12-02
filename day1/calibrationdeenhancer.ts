export function getCalibrationValue(input: string): number {
  const digits = input.split("").filter(character => !Number.isNaN(Number.parseInt(character)))
  const firstDigit = digits[0];
  const lastDigit = digits.pop();

  const combinedDigits = `${!firstDigit ? '' : firstDigit}${!lastDigit ? '' : lastDigit}`;
  const result = Number.parseInt(!combinedDigits ? '0' : combinedDigits);
  
  return result;
}
