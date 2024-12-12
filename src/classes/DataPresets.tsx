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
    new ShapeType(1, [[0, 0]], 0, 1), // 1x1
    new ShapeType(2, [[0, 0], [1, 0], [0, 1]], 0, 4), // tromino
    new ShapeType(3, [[0, 0], [1, 0], [0, 1], [0, -1]], 0, 4), // t
    new ShapeType(4, [[0, 0], [1, 0], [0, 1], [1, 1]], 0, 1), // 2x2
    new ShapeType(5, [[0, 0], [1, 0], [0, 1], [0, 2]], 0, 4), // L
    new ShapeType(6, [[0, 0], [0, -1], [0, -2], [1, 0]], 0, 4), // J
    new ShapeType(7, [[0, 0], [0, 1], [1, 0], [1, -1]], 0, 2), // S
    new ShapeType(8, [[0, 0], [0, -1], [1, 0], [1, 1]], 0, 2), // Z
    new ShapeType(9, [[0, 0], [0, -1], [0, 1], [0, 2]], 0, 2), // 4x1

]
export const GridPresets = [
    new GridPreset(0, 0, 1, 1, 0), // 1x1
    new GridPreset(0, 0, 2, 2, 1), // tromino piece 
    new GridPreset(0, 1, 2, 3, 2), // t-piece piece 
    new GridPreset(0, 0, 2, 2, 3), // 2x2 piece 
    new GridPreset(0, 0, 2, 3, 4), // L piece 
    new GridPreset(0, 2, 2, 3, 5), // J piece 
    new GridPreset(0, 1, 2, 3, 6), // S piece 
    new GridPreset(0, 1, 2, 3, 7), // Z piece 
    new GridPreset(0, 1, 1, 4, 8), // 4x1 piece 


]
export const colors = [
    "#FFFFFF",
    "#000000",
    "#EB5757",
    "#F2994A",
    "#F2C94C",
    "#27AE60",
    "#2F80ED",
    //"#7F00FF",
    "#9B51E0",
    "#4B0082",
    "#964B00", 
    //"#00FF00",
    //"#FF0000"
]
/*export const altColors = [
    "#F0E9E9",
    "#594C4C",
    "#EDBEBE",
    "#F0CFB1",
    "#F0DFAD",
    "#ADD9C0",
    "#C0D2EB",
    "#CAB4DE",
    "#826D91",
    "#C2AC95",
]*/
export const altColors = [
    '#F0E9E9', 
    '#7F7F7F', 
    '#F5ABAB', 
    '#F8CCA4', 
    '#F8E4A5', 
    '#93D6AF', 
    '#97BFF6', 
    '#CDA8EF', 
    '#A57FC0', 
    '#CAA57F'
]