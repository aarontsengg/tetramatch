import {Devvit, useState} from '@devvit/public-api'
import { Pixel } from './classes/PixelClass.js';
import { shapes, GridPresets, colors } from './classes/DataPresets.js';
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
    setCurrShapeRotation: (arg: number) => void;
}
export const ShapeCanvas = ({presetID, currShapeID, setCurrShapeID, setCurrShapeRotation}: shapeCanvasProps) => {
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
    var [anchorX, anchorY, numRow, resolution, shapeID, allowRotate] = [preset.anchorX, preset.anchorY, preset.rows, preset.cols, preset.shapeID, preset.allowRotate];
    
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
        }
    }

    var shape = shapes[shapeID];
    var pieces = shape.pieces;

    for (let i = 0; i < pieces.length; i++) {
        let [x, y] = pieces[i]; // array destructuring, yay... 
        blankCanvas[(x + anchorX) * resolution + (y + anchorY)] = new Pixel({x: x, y: y, color:1});
        // we need to do this add anchorX and anchorY thing
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
                    // BUG OR INTENDED? numRotations doesn't actually update using setNumRotations until the whole onPress has executed
                    // thus, if you do setNumRotations(numRotations + 1) and then print(numRotations), it'll print the old value
                    if (currShapeID === shapeID) { // we have previously selected this shape 
                        let mat = rotateImage(resolution, numRow, data);
                        setNumRotations((numRotations + 1) % shapes[shapeID].period); // increment numRotations by 1 
                        setCurrShapeRotation((numRotations + 1) % shapes[shapeID].period); // always modulo by rotation period
                        // increment currShapeRotation manually as well because of BUG mentioned above 

                        setData(mat);
                        
                    }
                    else {
                        setCurrShapeID(shapeID);
                        setCurrShapeRotation(numRotations); // at the end, set the number of rotations
                        // note, we need this setCurrShapeRotations in the else statement, because of BUG mentioned above 
                    }
                }}

                >
                {splitArray(pixels, resolution).map((row) => (
                    <hstack>{row}</hstack>
                ))}
                </vstack>
            </vstack>

   )
}