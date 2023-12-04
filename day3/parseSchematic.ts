function parseCoordinates(input: string): CoordinateMap {
  const lines = input.split("\n").filter((x) => x !== "");
  const map = lines.reduce((_map, line, y) => {
    return {
      ..._map,
      [y]: line.split("").reduce((_line, character, x) => {
        return {
          ..._line,
          [x]: character,
        };
      }, {}),
    };
  }, {} as CoordinateMap);
  return map;
}

interface CoordinateMap {
  [y: string]: {
    [x: string]: string;
  };
}

class Range {
  numbers: number[];
  constructor(start: number, length: number) {
    this.numbers = [...new Array(length).keys()].map((index) => index + start);
  }

  get() {
    return this.numbers;
  }
}

export class CoordinateObject {
  constructor(
    private anchor: { x: number; y: number },
    public value: string,
    private characterType: "empty" | "digit" | "symbol",
  ) {
  }

  public x() {
    return this.anchor.x;
  }

  public y() {
    return this.anchor.y;
  }

  private isSelf(x: number, y: number) {
    const selfX = new Range(this.x(), this.value.length).get();
    const selfRow = this.y() === y;
    return selfRow && selfX.includes(x);
  }

  public neighbouringXY() {
    return this.neighBouringY().flatMap((y) => {
      return this.neighBouringX().map((x) => {
        return { y, x };
      });
    }).filter(({ y, x }) => {
      return !this.isSelf(x, y);
    });
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
}

interface CoordinateObjectMap {
  [y: string]: {
    [x: string]: CoordinateObject;
  };
}

export class ObjectMap {
  objectMap: CoordinateObjectMap = {};
  objectList: Array<CoordinateObject>;

  constructor(private input: string) {
    this.objectList = this.getObjectList(parseCoordinates(this.input));
    this.populateObjectMap();
  }

  public toString = (): string => {
    return Object.keys(this.objectMap).map((y) => {
      return Object.keys(this.objectMap[y]).map((x) => {
        const object = this.objectMap[y][x];
        return object.value.split("")[Number.parseInt(x) - object.x()];
      }).join("");
    }).join("\n");
  };

  private set(x: number, y: number, object: CoordinateObject) {
    if (!(y in this.objectMap)) {
      this.objectMap[y] = {};
    }
    this.objectMap[y][x] = object;
  }

  public getNeighbouringObjects(
    object: CoordinateObject,
  ): Array<CoordinateObject> {
    return [...this.getNeighbouringObjectsGenerator(object)];
  }

  private *getNeighbouringObjectsGenerator(
    object: CoordinateObject,
  ): Generator<CoordinateObject> {
    for (const { x, y } of object.neighbouringXY()) {
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
    const objectList: Array<CoordinateObject> = [];

    for (const y of this.iterY(map)) {
      let lastCharacterType: "empty" | "digit" | "symbol" | null = null;
      let currentValue = "";
      let anchor: { x: number; y: number } | null = { x: 0, y };
      for (const x of this.iterX(map, y)) {
        const character = map[y][x];
        const characterType: "empty" | "digit" | "symbol" = character === "."
          ? "empty"
          : !Number.isNaN(Number.parseInt(character))
          ? "digit"
          : "symbol";

        if (lastCharacterType === characterType) {
          currentValue += character;
        } else {
          // save
          objectList.push(
            new CoordinateObject(anchor, currentValue, lastCharacterType!),
          );

          //reset
          currentValue = character;
          anchor = { x, y };
        }
        lastCharacterType = characterType;
      }
      objectList.push(
        new CoordinateObject(anchor, currentValue, lastCharacterType!),
      );
    }

    return objectList.filter((x) => !!x.value);
  }

  private iterY(map: CoordinateMap) {
    return Object.keys(map).map((y) => Number.parseInt(y));
  }

  private iterX(map: CoordinateMap, y: number) {
    return Object.keys(map[y]).map((x) => Number.parseInt(x));
  }
}

class EngineSchematic {
  objectMap: ObjectMap;

  constructor(private input: string) {
    this.objectMap = new ObjectMap(this.input);
  }

  public getEngineParts(): Array<number> {
    const digits = this.objectMap.objectList.filter((object) =>
      object.isDigit()
    );
    const digitsWithSymbolNeighbours = digits.filter((digit) =>
      this.objectMap.getNeighbouringObjects(digit).some((obj) => obj.isSymbol())
    );

    return digitsWithSymbolNeighbours.map((digit) =>
      Number.parseInt(digit.value)
    );
  }

  getPartsAdjacentToGears(): Array<[CoordinateObject, CoordinateObject]> {
    const gears = this.objectMap.objectList.filter((object) =>
      object.value === "*"
      && deduplicateArray(
        this.objectMap.getNeighbouringObjects(object).filter((o) => o.isDigit()),
        (a, b) => a.value === b.value
      ).length == 2
    );
    
    return gears.map((gear) => {
      const [a, b] = this.objectMap.getNeighbouringObjects(gear).filter((o) =>
        o.isDigit()
      );
      return [a, b];
    });
  }
}

function deduplicateArray<T>(array: Array<T>, comparator: (a: T, b: T) => boolean): Array<T> {
  return array.filter((value, index, self) =>
    index === self.findIndex((t) => comparator(t, value)));
}

export function parseSchematic(engineSchematic: string): Array<number> {
  const schematic = new EngineSchematic(engineSchematic);

  return schematic.getEngineParts();
}

export function getPartsAdjacentToGears(
  engineSchematic: string,
): Array<[CoordinateObject, CoordinateObject]> {
  return new EngineSchematic(engineSchematic).getPartsAdjacentToGears();
}
