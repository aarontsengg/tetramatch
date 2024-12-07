import {Devvit, useState} from '@devvit/public-api'
import { ShapeCanvas } from './Canvas.js';
import { ShapeType } from './classes/ShapeType.js';
const colors = [
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
  /*"#964B00", 
  "#964B00", 
  "#964B00", 
  "#964B00", 
  "#964B00", 
  "#964B00", 
  "#964B00", 
  "#964B00", */
  //"#00FF00",
  //"#FF0000"
];

class Pixel {
    color: number;
    id: number;
    x: number;
    y: number;
    // goofy looking constructor. This is necessary to specify typing and have all params optional 
    // the = {} is the default lol 
    constructor({color = 0xFFFFFF, id = 0, x = 0, y = 0}: {color?: number, id?: number, x?: number, y?: number} = {}) {
        this.color = color;
        this.id = id;
        this.x = x;
        this.y = y;
    }
}

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
    const [activeColor, setActiveColor] = useState(defaultColor);
    const [data, setData] = useState(blankCanvas);

    const [currShapeID, setCurrShapeID] = useState(0); // placeholder lol, we'll use an object
    // also this is shapeID  
    
    /*type ColorSelectorProps = {
        activeColor: number;
        // take a number value or a function value. Return void
        setActiveColor:  (value: number | ((prevState: number) => number)) => void;
    }*/
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
    
    const pixels = data.map((pixel, index) => (
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
    // we need gridSize, resolution and pixels to be passed?
    /*type canvasProps = {
        pixels: T[];
        resolution: number;
        So here's the thing, for a custom grid, you need to define gridSize yourself
    }*/
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
    const pixels2 = data.map((pixel, index) => (
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
    /*const Screen3 = () => (
        <blocks>
        <vstack gap="small" width="100%" height="100%" alignment="center middle">
            <Canvas />
            <ColorSelector />
        </vstack>
        </blocks>
    )*/
   return (
        <vstack gap="small" width="100%" height="100%" alignment="center middle">
            <Canvas />
            <ColorSelector />
            <ShapeCanvas presetID = {0} currShapeID = {currShapeID} setCurrShapeID = {setCurrShapeID}/>
            <ShapeCanvas presetID = {1} currShapeID = {currShapeID} setCurrShapeID = {setCurrShapeID}/>
            <ShapeCanvas presetID = {2} currShapeID = {currShapeID} setCurrShapeID = {setCurrShapeID}/>
            <ShapeCanvas presetID = {3} currShapeID = {currShapeID} setCurrShapeID = {setCurrShapeID}/>
            <ShapeCanvas presetID = {4} currShapeID = {currShapeID} setCurrShapeID = {setCurrShapeID}/>
            <button onPress={() => setPage('startScreen')}>Go to Start</button>

        </vstack>
   )
}