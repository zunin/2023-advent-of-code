export class Card {
  constructor(
    public id: number,
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

export const PointTeller = new class PointTeller {
    public tallyCard(card: Card): number {
        return Math.floor(Math.pow(2, card.getWinningNumbers().length - 1))
    }
}();

class CardDictionary {
    dictionary: {[id: number]: {
        card: Card,
        count: number
    }} = {}

    getCount(card: Card) {
        return this.get(card).count;
    }

    get(card: Card) {
        if (!(card.id in this.dictionary)) {
            this.dictionary[card.id] = {
                card,
                count: 0
            };
        }
        return this.dictionary[card.id];
    }

    insert(card: Card) {
        const cardGet = this.get(card);
        cardGet.count += 1;
        this.dictionary[card.id] = cardGet;
    }

    length(): number {
        return Object.values(this.dictionary).map(x => x.count).reduce((sum, count) => sum + count, 0);
    }
}

export const CardTeller = class CardTeller {
    private cards: Array<Card>;
    private cardCopys: CardDictionary
    constructor(input: string) {
        this.cards = parse(input);
        this.cardCopys = new CardDictionary();
    }

    public tallyScartchCards(): number {
        this.cards.forEach(originalCard => {
            this.cardCopys.insert(originalCard);

            for(let count = 0; count < this.cardCopys.getCount(originalCard); count ++) {
                this.cards.slice(originalCard.id, originalCard.id + originalCard.getWinningNumbers().length).forEach(card => {
                    this.cardCopys.insert(card);
                })
            }
            
        });
        return this.cardCopys.length();
    }
};
