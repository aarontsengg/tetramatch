import {Devvit, useState} from '@devvit/public-api'
import { ShapeType } from './classes/ShapeType.js';
import { Pixel } from './classes/PixelClass.js';
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

const resolution = 8;
const size = 16;
//const { useState } = context;
// must define these hooks in the exported function... 
// grid get and set 
function getPixel<T>(array: T[], resolution:number, x: number, y:number): T{
    return array[x * resolution + y];
}
function setPixel<T>(array: T[], resolution:number, x: number, y:number, value: T): void{
    array[x * resolution + y] = value;
}

type shapeCanvasProps = {
  shape: ShapeType;
  resolution: number;
  numRow: number;
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
export const shapeCanvas = ({shape, resolution, numRow}: shapeCanvasProps) => {

    //BUG: This doesn't work unless we write the following code not in a method
    var blankCanvas = new Array(resolution * resolution);
    for (let i = 0; i < numRow; i++) {
        for (let j = 0; j < resolution; j++) {
            blankCanvas[i * resolution + j] = new Pixel({x: i, y: j});
        }
    }
    const [data, setData] = useState(blankCanvas);
    
    /*const pixels = data.map((pixel, index) => (
        <hstack
        onPress={() => {
            const newData = data;
            var pix = newData[index];
            console.log("Helloe " + pix.x + " " + pix.y + " lol");
            pix.color = activeColor;
            //newData[index] = activeColor;
            console.log("Hello2", gridSize);
            setData(newData);
        }}
        height={`${size}px`}
        width={`${size}px`}
        backgroundColor={colors[pixel.color]}
        />
    ));*/
    
    const gridSize = `${resolution * size}px`;
    // this builds it such that the true gridSize pixels wise is found after the resolution and size per pixel is specified 
    // what would be nice is if the size per pixel could be found from a specified resolution and gridSize. 
    function getGridSize(resolution: number, size: number): Devvit.Blocks.SizeString | undefined {
        return `${resolution * size}px`;
    }
    
    function splitArray<T>(array: T[], segmentLength: number): T[][] {
        const result: T[][] = [];
        for (let i = 0; i < array.length; i += segmentLength) {
            result.push(array.slice(i, i + segmentLength));
        }
        return result;
    }
    // we need gridSize, resolution and pixels to be passed?
    /*const Canvas = () => (
        <vstack
        cornerRadius="small"
        border="thin"
        height={getGridSize(resolution, size)}
        width={getGridSize(resolution, size)}
        >
        {splitArray(pixels, resolution).map((row) => (
            <hstack>{row}</hstack>
        ))}
        </vstack>
    );*/
    const pixels = data.map((pixel, index) => (
        <hstack
        onPress={() => { console.log("This shouldn't be pressable lol"); }}
        height={`${size}px`}
        width={`${size}px`}
        backgroundColor={colors[pixel.color]}
        />
    ));
    /*const Canvas2 = (pixels2: JSX.Element[]) => (
        <vstack
        cornerRadius="small"
        border="thin"
        height={getGridSize(3, size)}
        width={getGridSize(3, size)}
        >
        {splitArray(pixels2, 3).map((row) => (
            <hstack>{row}</hstack>
        ))}
        </vstack>
    );*/
   return (
        <vstack gap="small" width="100%" height="100%" alignment="center middle">
            <vstack
            cornerRadius="small"
            border="thin"
            height={getGridSize(resolution, size)}
            width={getGridSize(resolution, size)}
            >
            {splitArray(pixels, resolution).map((row) => (
                <hstack>{row}</hstack>
            ))}
            </vstack>

        </vstack>
   )
}