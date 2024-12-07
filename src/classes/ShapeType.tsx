export class ShapeType {
    id: number;
    pieces: number[][];
    rotations: number;
  
    constructor(id: number = 0, pieces: number[][] = [[]], rotations: number = 0) {
        this.id = id;
        this.pieces = pieces;
        this.rotations = rotations;
    }
}