export class Card {
  constructor(
    private id: number,
    private winningNumbers: Array<number>,
    private ownNumbers: Array<number>,
  ) {}
  getWinningNumbers(): Array<number> {
    return this.ownNumbers.filter(ownNumber => this.winningNumbers.some(winningNumber => winningNumber === ownNumber));
  }

  toString = () => {
    return `Card ${this.id}: ${this.winningNumbers.map(number => number.toString().padStart(2, " ")).join(" ")} | ${
      this.ownNumbers.map(number => number.toString().padStart(2, " ")).join(" ")
    }`;
  };
}

export function parse(input: string): Array<Card> {
  return input.trim().split("\n").map(parseLine);
}


export function parseLine(input: string): Card {
  const [cardString, numberString] = input.split(": ");
  const [_, idText] = cardString.trim().split(" ");
  const id = Number.parseInt(idText.trim());
  const [winningNumbersText, ownNumbersText] = numberString.split(" | ");
  const winningNumbers = winningNumbersText.trim().split(" ").map(text => Number.parseInt(text.trim())).filter(input => !Number.isNaN(input))
  const ownNumbers = ownNumbersText.trim().split(" ").map(text => Number.parseInt(text.trim())).filter(input => !Number.isNaN(input))


  return new Card(id, winningNumbers, ownNumbers);
}

class PointTeller {
    public tallyCard(card: Card): number {
        return Math.floor(Math.pow(2, card.getWinningNumbers().length - 1))
    }
}

export const Teller = new PointTeller();
