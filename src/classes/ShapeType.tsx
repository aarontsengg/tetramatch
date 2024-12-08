export class ShapeType {
    id: number;
    pieces: number[][];
    rotations: number;
    period: number;
    constructor(id: number = 0, pieces: number[][] = [[]], rotations: number = 0, period: number = 4) {
        this.id = id;
        this.pieces = pieces;
        this.rotations = rotations;
        this.period = period;
    }
}