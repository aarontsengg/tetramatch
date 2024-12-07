export class ShapeType {
    id: number;
    pieces: number[][];
    rotations: number;
  
    constructor(id: number = 0, pieces: number[][], rotations: number) {
        this.id = id;
        this.pieces = pieces;
        this.rotations = rotations;
    }
}