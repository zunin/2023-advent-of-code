function parseCoordinates(input: string): CoordinateMap {
  const lines = input.split("\n").filter(x => x !== "");
  const map = lines.reduce((_map, line, y) => {
    return {
      ..._map,
      [y]: line.split("").reduce((_line, character, x) => {
        return {
          ..._line,
          [x]: character
        }
      }, {})
    }
  }, {} as CoordinateMap);
  return map;
}

interface CoordinateMap {
  [y: string]: {
    [x: string]: string
  }
}


class Range {
  numbers: number[]
  constructor(start: number, length: number) {
    this.numbers = [...new Array(length).keys()].map(index => index + start);
  }

  get() {
    return this.numbers;
  }
}


export class CoordinateObject{
  constructor(private anchor: {x: number, y: number}, public value: string, private characterType: "empty"|"digit"|"symbol") {
  }

  public x() {
    return this.anchor.x;
  }

  public y() {
    return this.anchor.y;
  }

  private isSelf(x: number, y: number) {
    const selfX = new Range(this.x(), this.value.length).get();
    return this.y() === y && selfX.includes(x)
  }

  public neighbouringXY() {
    return this.neighBouringY().flatMap(y => {
      return this.neighBouringX().map(x => {
        return {y, x};
      })
    }).filter(({y, x}) => {
      return !this.isSelf(x, y);
    })
  }

  private neighBouringY() {
    return new Range(this.y() - 1, 3).get();
  }

  private neighBouringX() {
    return new Range(this.x() - 1, this.value.length + 2).get();
  }

  public isDigit() {
    return this.characterType === "digit";
  }

  public isSymbol() {
    return this.characterType === "symbol";
  }

  private isRowAbove(other: CoordinateObject): boolean {
    return this.y() - 1 === other.y();
  }

  private isRowBelow(other: CoordinateObject): boolean {
    return this.y() + 1 === other.y();
  }

  private isSameRow(other: CoordinateObject): boolean {
    return this.y() === other.y();
  }

  private isRightColumn(other: CoordinateObject): boolean {
    const thisX = {min: this.x(), max: this.x() + this.value.length - 1};
    const otherX = {min: other.x(), max: other.x() + other.value.length - 1};
    return thisX.max + 1 === otherX.min;
  }

  private isLeftCoulmn(other: CoordinateObject): boolean {
    const thisX = {min: this.x(), max: this.x() + this.value.length - 1};
    const otherX = {min: other.x(), max: other.x() + other.value.length - 1};
    return thisX.min - 1 === otherX.max;
  }

  private isXWithin(other: CoordinateObject): boolean {
    const thisValues = [...new Array(this.value.length ).keys()].map(value => value + this.x());
    const otherValues = [...new Array(other.value.length).keys()].map(value => value + other.x());

    return thisValues.some(thisValue => otherValues.some(otherValue => thisValue === otherValue))
  }

  public isNeighbour(other: CoordinateObject): boolean {
    const isNeighbouringRow = this.isRowAbove(other) || this.isRowBelow(other);

    const isNeighbouringColumn = this.isLeftCoulmn(other) || this.isRightColumn(other);

    if (isNeighbouringColumn && isNeighbouringRow) {
      return true;
    }

    if (isNeighbouringRow && this.isXWithin(other)) {
      return true;
    }


    if (this.isSameRow(other) && isNeighbouringColumn) {
      return true;
    }

    return false;
  }
}

interface CoordinateObjectMap {
  [y: string]: {
    [x: string]: CoordinateObject
  }
}


class ObjectMap {
  objectMap: CoordinateObjectMap = {};
  objectList: Array<CoordinateObject>;

  constructor(private input: string) {
   this.objectList = this.getObjectList(parseCoordinates(this.input));
   this.populateObjectMap();
  }

  private set(x: number, y: number, object: CoordinateObject) {
    if(!(y in this.objectMap)) {
      this.objectMap[y] = {};
    }
    this.objectMap[y][x] = object;
  }

  public getNeighbouringObjects(object: CoordinateObject): Array<CoordinateObject> {
    return [...this.getNeighbouringObjectsGenerator(object)];
  }
  
  private *getNeighbouringObjectsGenerator(object: CoordinateObject): Generator<CoordinateObject> {
    for(const {x, y} of object.neighbouringXY()) {
      if (y in this.objectMap) {
        const row = this.objectMap[y];
        if (x in row) {
          yield row[x];
        }
      }
    }
  
  }

  populateObjectMap() {
    for (const obj of this.objectList) {
      const y = obj.y();
      for (let x = obj.x(); x < obj.value.length + obj.x(); x++) {
        this.set(x, y, obj);
      }
    }
  }


  getObjectList(map: CoordinateMap): Array<CoordinateObject> {
    const objectList: Array<CoordinateObject> = []

    for(const y of this.iterY(map)) { 

      let lastCharacterType: "empty"|"digit"|"symbol"|null = null;
      let currentValue = "";
      let anchor: {x: number, y: number}|null = {x: 0, y};
      for(const x of this.iterX(map, y)) {

        const character = map[y][x];
        const characterType: "empty"|"digit"|"symbol" = character === "." ? "empty" : 
          !Number.isNaN(Number.parseInt(character)) ? "digit" :
          "symbol";
        

        if (lastCharacterType === characterType) {
          currentValue += character;
        } else {
            // save
            objectList.push(new CoordinateObject(anchor, currentValue, lastCharacterType!))
          
          //reset
          currentValue = character;
          anchor = {x, y};
        }
        lastCharacterType = characterType;
      };
      objectList.push(new CoordinateObject(anchor, currentValue, lastCharacterType!))
    };

    return objectList.filter(x => !!x.value);
  }

  private iterY(map: CoordinateMap) {
    return Object.keys(map).map(y => Number.parseInt(y))
  }

  private iterX(map: CoordinateMap, y: number) {
    return Object.keys(map[y]).map(x => Number.parseInt(x))
  }
}

class EngineSchematic {
  objectMap: ObjectMap;

  constructor(private input: string) {
    this.objectMap = new ObjectMap(this.input);
  }

  public getEngineParts(): Array<number> {
    const digits = this.objectMap.objectList.filter((object) => object.isDigit());
    const otherN = digits.filter(digit => [...this.objectMap.getNeighbouringObjects(digit)].filter(obj => !!obj).some(obj => obj.isSymbol()))


    digits.forEach(digit => {
      this.objectMap.getNeighbouringObjects(digit)
    });

    const symbols = this.objectMap.objectList.filter((object) => object.isSymbol());
    const neighbouring = digits.filter(digit => symbols.some(symbol => symbol.isNeighbour(digit)));
    const notneighbouring = digits.filter(digit => symbols.every(symbol => !symbol.isNeighbour(digit)));
    
    return otherN.map(digit => Number.parseInt(digit.value))
  }
}

export function parseSchematic(engineSchematic: string): Array<number> {
  const schematic = new EngineSchematic(engineSchematic);

  return schematic.getEngineParts();
}
