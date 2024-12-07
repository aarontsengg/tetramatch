import {Devvit, useState} from '@devvit/public-api'
import { Pixel } from './classes/PixelClass.js';
import { shapes, GridPresets } from './classes/DataPresets.js';

const colors = [
  "#FFFFFF",
  "#000000",
  "#EB5757",
  "#F2994A",
  "#F2C94C",
  "#27AE60",
  "#2F80ED",
  "#9B51E0"
];
const size = 16;
// must define these hooks in the exported function... 
// grid get and set 
function getPixel<T>(array: T[], resolution:number, x: number, y:number): T{
    return array[x * resolution + y];
}
function setPixel<T>(array: T[], resolution:number, x: number, y:number, value: T): void{
    array[x * resolution + y] = value;
}

// We cannot use this function with React hooks
function getBlankCanvas(resolution: number, numRow: number): Pixel[]{
    var tmp = new Array(resolution * resolution);
    for (let i = 0; i < numRow; i++) {
        for (let j = 0; j < resolution; j++) {
            tmp[i * resolution + j] = new Pixel({x: i, y: j});
        }
    }
    return tmp;
}
type shapeCanvasProps = {
    presetID: number;
    currShapeID: number;
    setCurrShapeID: (arg: number) => void;
}
export const ShapeCanvas = ({presetID, currShapeID, setCurrShapeID}: shapeCanvasProps) => {
    const [numRotations, setNumRotations] = useState(0); // this is numRotations

    function rotateImage(resolution: number, rows: number, data: Pixel[]): Pixel[]{
        let n = rows;
        let m = resolution;
        let nxt = new Array(resolution * rows).fill(null);
        let n2 = (n % 2 == 0) ? ((n / 2) | 0) : ((n / 2) | 0) + 1  
        let m2 = (m % 2 == 0) ? ((m / 2) | 0) : ((m / 2) | 0) + 1  
        for (let i = 0; i < n2; i++) {
            for (let j = 0; j < m2; j++) {
                setPixel(nxt, rows, i, j, getPixel(data, resolution, n - j - 1, i));
                setPixel(nxt, rows, m - j - 1, i, getPixel(data, resolution, n - i - 1, m - j - 1));
                setPixel(nxt, rows, m - i - 1, n - j - 1, getPixel(data, resolution, j, m - i - 1));
                setPixel(nxt, rows, j, n - i - 1, getPixel(data, resolution, i, j));
            }
        }
        return nxt;
    }
    // setup shapes and grid 
    var preset = GridPresets[presetID];
    var [anchorX, anchorY, numRow, resolution, shapeID] = [preset.anchorX, preset.anchorY, preset.rows, preset.cols, preset.shapeID];
    
    if (numRotations % 2 == 1) {
        var tmp = resolution;
        resolution = numRow;
        numRow = tmp;
    }
    //BUG: This doesn't work unless we write the following code not in a method
    var blankCanvas = new Array(resolution * numRow); // I'm a little bit dull 
    for (let i = 0; i < numRow; i++) {
        for (let j = 0; j < resolution; j++) {
            blankCanvas[i * resolution + j] = new Pixel({x: i, y: j});
            //console.log("colour",i,j, blankCanvas[i * resolution + j].color);
        }
    }

    var shape = shapes[shapeID];
    var pieces = shape.pieces;

    for (let i = 0; i < pieces.length; i++) {
        let [x, y] = pieces[i]; // array destructuring, yay... 
        blankCanvas[(x + anchorX) * resolution + (y + anchorY)] = new Pixel({x: x, y: y, color:1});
        // we need to do this add anchorX and anchorY thing
        //setPixel(blankCanvas, resolution, x, y, new Pixel({x:x, y:y, color:parseInt(colors[2].slice(1), 16)}));
    }
    // shape canvas properties 
    const [data, setData] = useState(blankCanvas);

    // this builds it such that the true gridSize pixels wise is found after the resolution and size per pixel is specified 
    // what would be nice is if the size per pixel could be found from a specified resolution and gridSize. 
    function getGridSide(resolution: number, size: number): Devvit.Blocks.SizeString | undefined {
        return `${resolution * size}px`;
    }
    
    function splitArray<T>(array: T[], segmentLength: number): T[][] {
        const result: T[][] = [];
        for (let i = 0; i < array.length; i += segmentLength) {
            result.push(array.slice(i, i + segmentLength));
        }
        return result;
    }
    const pixels = data.map((pixel, index) => (
        <hstack
        // no on press here
        height={`${size}px`}
        width={`${size}px`}
        backgroundColor={colors[pixel.color]}
        />
    ));
   return (
            <vstack border={currShapeID === shapeID ? "thick" : "none"}
            borderColor='green'
            padding={"xsmall"} >
                <vstack
                height={getGridSide(numRow, size)}
                width={getGridSide(resolution, size)}
                onPress={() => {
                    if (currShapeID === shapeID) {console.log("Already Selected: Rotate Time!");
                        let mat = rotateImage(resolution, numRow, data);
                        setNumRotations((numRotations + 1) % 4); // increment numRotations by 1 
                        setData(mat);
                        
                    }
                    else setCurrShapeID(shapeID);
                }}

                >
                {splitArray(pixels, resolution).map((row) => (
                    <hstack>{row}</hstack>
                ))}
                </vstack>
            </vstack>

   )
}