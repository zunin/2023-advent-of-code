export class Cube {
    constructor(public color: string, public count: number) {}

    public toString = () : string => {
        return `${this.count} ${this.color}`
    }
}

export class CubeGrab {
    constructor(private cubes: Array<Cube>) {
    }

    public toString = () : string => {
        return this.cubes.join(", ")
    }

    private sumByColor(color: string) {
        return this.cubes.filter(cube => cube.color === color).reduce((sum, cube) => {
            return sum + cube.count;
        }, 0);
    }

    private maxByColor(color: string) {
        let localMax = 0;
        this.cubes.filter(cube => cube.color === color).forEach((cube) => {
            if (cube.count > localMax) {
                localMax = cube.count;
            }
        });

        return localMax
    }

    public getMaxByColor() {
        return {
            red: this.maxByColor("red"),
            green: this.maxByColor("green"),
            blue: this.maxByColor("blue"),
        }
    }

    public sumColors() {
        return {
            red: this.sumByColor("red"),
            green: this.sumByColor("green"),
            blue: this.sumByColor("blue"),
        }
    }
}

export class Game {
    constructor(public id: number, private cubegrabs: Array<CubeGrab>) {

    }

    public toString = () : string => {
        return `Game ${this.id}: ${this.cubegrabs.join("; ")}`;
    }

    public getMinimumCubes() {
        let localMax = {
            red: 0,
            green: 0,
            blue: 0,
        };
        this.cubegrabs.map(cube => cube.getMaxByColor()).forEach(cubeMax => {
            if (cubeMax.blue > localMax.blue) {
                localMax.blue = cubeMax.blue;
            }
            if (cubeMax.green > localMax.green) {
                localMax.green = cubeMax.green;
            }
            if (cubeMax.red > localMax.red) {
                localMax.red = cubeMax.red;
            }
        });
        return localMax;
    }

    public isPossibleWithCondition(condition: MinimumCubeCondition): boolean {
        let result = true;

        this.cubegrabs.forEach(cubeGrab => {
            if (cubeGrab.sumColors().blue > condition.blue) {
                result = false;
            }
            if (cubeGrab.sumColors().green > condition.green) {
                result = false;
            }
            if (cubeGrab.sumColors().red > condition.red) {
                result =  false;
            }
        });       
        return result;
    }
}

export interface MinimumCubeCondition {
    red: number;
    green: number;
    blue: number;
}

// Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
export function parseGameRecord(input: string): Game {
    const [gameString, cubeGrabString] = input.split(": ");
    const [_, id] = gameString.split(" ");

    const cubegrabs = cubeGrabString.split("; ").map(grabString => {
        const cubes = grabString.split(", ").map(grab => {
            const [cubeCount, color] = grab.split(" ");
            return new Cube(color, Number.parseInt(cubeCount))
        })
        return new CubeGrab(cubes)
    })

    return new Game(Number.parseInt(id), cubegrabs);
}


const rawInput = await Deno.readTextFile("day2/input.txt");
const nonEmptyLines = rawInput.split("\n").filter(line => line !== "");
const games = nonEmptyLines.map(line => parseGameRecord(line));
const validGames = games.filter(game => game.isPossibleWithCondition({
    blue: 14,
    green: 13,
    red: 12
}));
const idSumOfValidGames = validGames.reduce((sum, game) => {
    return sum + game.id;
}, 0);

console.log(`The sum of valid game ids is ${idSumOfValidGames}`);

const sumOfPower = games
    .map(game => game.getMinimumCubes())
    .reduce((sum, game) => {
        return sum + (game.blue * game.green * game.red)
    }, 0);

console.log(`The sum of the power of the sets is ${sumOfPower}`)