import {Devvit, useState} from '@devvit/public-api'
import { ShapeCanvas } from './Canvas.js';
import { ShapeType } from './classes/ShapeType.js';
import { Pixel } from './classes/PixelClass.js';
import { shapes, colors, GridPresets} from './classes/DataPresets.js';
import { Service } from './service/Service.js';

const resolution = 8;
const size = 32;
const blankCanvas = new Array(resolution * resolution).fill(new Pixel());
for (let i = 0; i < resolution; i++) {
    for (let j = 0; j < resolution; j++) {
        blankCanvas[i * 8 + j] = new Pixel({x: i, y: j});
    }
}
const defaultColor = 1;
//const { useState } = context;
// must define these hooks in the exported function... 
// grid get and set 
function getPixel<T>(array: T[], resolution:number, x: number, y:number): T{
    return array[x * resolution + y];
}
function setPixel<T>(array: T[], resolution:number, x: number, y:number, value: T): void{
    array[x * resolution + y] = value;
}

    // we need to know if global variables exist... 
// like if I define currShape = "square", does DrawScreen know that? 
// we can use a react hook! 
// with react hooks, they really don't work great with complex objects... 
// like the pixel canvas. We have to update the entire canvas when we only want to update one pixel 
// Basically, you must update the top level component to achieve what you mean to. 
// is there a way to only update each pixel individually? 
// I don't think so, because then you'd need a separate react hook for each one! 
// best course of action is to just have a hook for the canvas, modify it, then to push changes use setCanvas 
// does anything even need to happen for this btw? 

type DrawScreenProps = {
  setPage: (page: string) => void;
}
export const DrawScreen = ({setPage}: DrawScreenProps) => {
    var defBackColor = "#FCFAE8";
    const [activeColor, setActiveColor] = useState(defaultColor);
    const [data, setData] = useState(blankCanvas);

    const [currShapeID, setCurrShapeID] = useState(0); // placeholder lol, we'll use an object
    const [idCTR, setIdCTR] = useState(1);
    const [currShapeRotation, setCurrShapeRotation] = useState(0); // only set by shape selection
    // also this is shapeID  
    
    const ColorSelector = () => (
        <hstack width="100%" alignment="center">
        {/* nested hstack to negate grow */}
        <hstack border="thin" grow={false} cornerRadius="small">
            {colors.map((color, index) => (
            <hstack
                height={`${size}px`}
                width={`${size}px`}
                backgroundColor={color}
                onPress={() => setActiveColor(index)}
                alignment="middle center"
            >
                {activeColor === index && (
                <text
                    color={index === 1 ? "white" : "black"}
                    weight="bold"
                    size="xxlarge"
                >
                    ✓
                </text>
                )}
            </hstack>
            ))}
        </hstack>
        </hstack>
    );
    function checkInBounds(data: Pixel[], x: number, y: number, pieces: number[][]): Boolean {
        // check if all pieces in bounds and doesn't overlap any other pieces 
        for (let i = 0; i < pieces.length; i++) {
            let [dx, dy] = pieces[i]; // array destructuring, yay... 
            if (x + dx >= resolution ||
                x + dx < 0 || 
                y + dy >= resolution ||
                y + dy < 0 ||
                data[(x + dx) * resolution + y + dy].id != 0) return false; // not in bounds, return False 
        }
        return true;
    }
    function applyRotations(pieces: number[][], numRotations:number): number[][]{
        // we need to deepcopy pieces first 
        var ln = pieces.length;
        var ret = Array.from({ length: ln }, () => new Array(2).fill(0));
        for (let i = 0; i < ln; i++) {
            let [x, y] = pieces[i]; // copies, not references 
            for (let j = 0; j < numRotations; j++) {
                let tmp = x;
                x = y;
                y = -tmp; // rotation, yay... 
            }
            ret[i][0] = x;
            ret[i][1] = y;
        }
        return ret;

    }
    function drawShape(data: Pixel[], x: number, y: number, shapeID: number): number {
        // this edits the canvas in place. Is this a good idea? 
        var shape = shapes[shapeID];
        var pieces = shape.pieces;
        pieces = applyRotations(pieces, currShapeRotation);
        if (!checkInBounds(data, x, y, pieces)) return 0; // if not in bounds, exit failure 

        for (let i = 0; i < pieces.length; i++) {
            let [dx, dy] = pieces[i]; // array destructuring, yay... 
            data[(x + dx) * resolution + (y + dy)].color = activeColor; // all u need to do is set the active colour 
            data[(x + dx) * resolution + (y + dy)].id = idCTR; // all u need to do is set the active colour 

            // we need to do this add anchorX and anchorY thing
        }
        setIdCTR(idCTR + 1);
        return 1; // exit success 
    }
    function erase(data: Pixel[], x: number, y: number): number {
        // erase from data directly 
        // this is an O(n**2) inefficient algorithm, that still works fast under small n (such as 8 or 16)
        var id = data[x * resolution + y].id;
        if (id === 0) return 0; // don't do anything 
        // here we operate under the assumption that rows == cols, since we will only use 8x8 or 16x16 grid 
        for (let i = 0; i < resolution; i++) {
            for (let j = 0; j < resolution; j++) {
                if (data[i * resolution + j].id === id) {
                    data[i * resolution + j].id = 0;
                    data[i * resolution + j].color = -1;
                }
            }
        }
        return 1;

    }
    const pixels = data.map((pixel, index) => (
        <hstack
        onPress={() => {
            console.log("Draw this shape:", currShapeID);
            const newData = data;
            var success = 1;

            if (currShapeID === -1) success = erase(data, pixel.x, pixel.y); // if -1, erase 
            else success = drawShape(newData, pixel.x, pixel.y, currShapeID);

            if (success === 1) setData(newData);
            // no need to update data if unsuccessful operation
        }}
        height={`${size}px`}
        width={`${size}px`}
        backgroundColor={pixel.color != -1 ? colors[pixel.color] : defBackColor} // use -1 for default background color
        />
    ));
    
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
    function submit(data: Pixel[]): void {
        // Query Reddit API for username/userID
        console.log("Submitted by {username}");
        for (let i = 0; i < resolution; i++) {
            let s = '';
            for (let j = 0; j < resolution; j++) {
                let dat = data[i * resolution + j]
                s = s.concat(`${dat.color}|${dat.id}\t`);
            }
            console.log(s);
        }
        // whoops I need to docker build and import Mongo DB
        // create the return array here 
        var service = new Service();
        service.testFunc(100);
    }
    const Canvas = () => (
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
    );
    const Eraser = () => (
        <vstack border={currShapeID === -1 ? "thick" : "none"}
        borderColor='green'
        padding={"xsmall"} >
                <image
                url="eraser.png"
                description="logo"
                imageHeight={256}
                imageWidth={256}
                height="48px"
                width="48px"
                onPress={() => {
                    console.log("Eraser selected");
                    setCurrShapeID(-1); // -1 stands in for eraser 
                    // maybe we should use enums instead of numbers 
                }}
                />
        </vstack>
    );
   return (
        <hstack height="100%" padding='small' gap='small' alignment = 'center middle'>
            <vstack gap="small" height="100%" alignment="center middle">
                <Eraser />
                <hstack
                cornerRadius="small"
                border="thin"
                >
                {splitArray(GridPresets, Math.ceil(GridPresets.length / 2)).map((GP, row) => (
                    <vstack gap='small'>
                    {GP.map((unused, index) => (
                        <ShapeCanvas 
                        presetID = {row * Math.ceil(GridPresets.length / 2) + index } 
                        currShapeID = {currShapeID} 
                        setCurrShapeID = {setCurrShapeID} 
                        setCurrShapeRotation = {setCurrShapeRotation}/>
                    ))} 
                    </vstack>
                ))}
                </hstack>
                <button onPress={() => {submit(data)}}>Submit</button>
            </vstack>
            <vstack gap="small" height="100%" alignment="center middle">
                <Canvas />
                <ColorSelector />
            </vstack>
        </hstack>
   )
}