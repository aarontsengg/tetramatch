import { ShapeType } from "./ShapeType.js"
// this takes the form [anchorX, anchorY, rows, cols, shape]
class GridPreset {
    anchorX: number;
    anchorY: number;
    rows: number;
    cols: number;
    shapeID: number;
    constructor(anchorX: number = 0, anchorY: number = 0, rows: number = 0, cols: number = 0, shapeID: number = 0) {
        this.anchorX = anchorX;
        this.anchorY = anchorY;
        this.rows = rows;
        this.cols = cols;
        this.shapeID = shapeID;

    }
}
export const shapes = [
    new ShapeType(1, [[0, 0]], 0),
    new ShapeType(2, [[0, 0], [1, 0], [0, 1]], 0),
    new ShapeType(3, [[0, 0], [1, 0], [0, 1], [0, -1]], 0),
    new ShapeType(4, [[0, 0], [1, 0], [0, 1], [1, 1]], 0),
    new ShapeType(5, [[0, 0], [1, 0], [0, 1], [0, 2]], 0)

]
export const GridPresets = [
    new GridPreset(0, 0, 1, 1, 0), // 1x1
    new GridPreset(0, 0, 2, 2, 1), // tri-L piece 
    new GridPreset(0, 1, 2, 3, 2), // tri-L piece 
    new GridPreset(0, 0, 2, 2, 3), // 2x2 piece 
    new GridPreset(0, 0, 2, 3, 4), // L piece 


]