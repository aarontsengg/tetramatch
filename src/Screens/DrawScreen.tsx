import {Devvit, useState} from '@devvit/public-api'
import { ShapeCanvas } from './Canvas.js';
import { ShapeType } from '../classes/ShapeType.js';
import { Pixel } from '../classes/PixelClass.js';
import { shapes, colors, GridPresets, altColors} from '../classes/DataPresets.js';
import { Puzzle, Service } from '../services/Service.js';
const resolution = 8;
const size = 32;
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
  context: Devvit.Context;
  setImageData: (img: number[]) => void;
  solnImg: number[];
}
export const DrawScreen = ({setPage, context, setImageData, solnImg}: DrawScreenProps) => {
    const blankCanvas = new Array(resolution * resolution).fill(new Pixel());
    for (let i = 0; i < resolution; i++) {
        for (let j = 0; j < resolution; j++) {
            blankCanvas[i * 8 + j] = new Pixel({x: i, y: j});
        }
    }
    var defBackColor = ["#FCFAE8","#CFC995" ];
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
    function getBackgroundColor(pixel, index): string {
        let colorID = pixel.color
        if (colorID != -1) return colors[colorID];
        // check soln layer first
        if (solnImg[pixel.x * resolution + pixel.y] != -1) return altColors[solnImg[pixel.x * resolution + pixel.y]] 
        // fix last layer 
        return defBackColor[((index % resolution) + Math.floor(index / resolution)) % 2]
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
            backgroundColor={getBackgroundColor(pixel, index)} // use -1 for default background color
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
    function genID(): number {
        return Math.floor(Math.random() * 1000000000000000000) // 10 ** 18 btw
    }
    async function createPuzzle(context: Devvit.Context, service: Service, width: number, height: number, pixels: number[][]) {
        let ret = -1; // return the unique identifier 
        console.log("Async function...")
        var puzzleId = genID()
        console.log("Unique puzzle ID:", puzzleId)
        var userID = context.userId ? context.userId : ""
        var timeCreated = Math.floor(Date.now() / 1000); // seconds since 1970 jan 1
        var tmpPuzzle: Puzzle = {
            puzzleId: puzzleId,
            width: width,
            height: height,
            pixels: pixels,
            userId: parseInt(userID),
            createdAt: timeCreated.toString()
        }
        let success = await service.addNewPuzzle(tmpPuzzle);
        console.log("Success?", success);
        if (success) {
            ret = puzzleId;
            let gPuzzle = await service.getPuzzle(puzzleId);
            if (gPuzzle) {
                console.log("Got puzzle successfully!")
                console.log(gPuzzle.pixels);
            } else {
                console.log("Puzzle: ", puzzleId, "failed to retrieve")
            }
        } else {
            console.log("Set puzzle fail");
        }
        return ret

        /**
         * 
         * interface Puzzle {
            puzzleId: number;
            userId: number; 
            createdAt: string;
            width: number;
            height: number;
            pixels: number[][];
            }
         */
    }
    function validate(data: Pixel[], context: Devvit.Context) {

    }
    async function submit(data: Pixel[], context: Devvit.Context) {
        // Query Reddit API for username/userID
        console.log("Submitted by {username}");
        var arr = Array.from({ length: resolution }, () => new Array(resolution).fill(0));
        for (let i = 0; i < resolution; i++) {
            let s = '';
            for (let j = 0; j < resolution; j++) {
                let dat = data[i * resolution + j]
                s = s.concat(`${dat.color}|${dat.id}\t`);
                arr[i][j] = dat.color;
            }
            console.log(s);
        }
        var arr2 = Array(resolution * resolution).fill(0);
        for (let i = 0; i < data.length; i++) arr2[i] = data[i].color;
        console.log(arr2);
        var service = new Service(context);
        // [TypeError: (void 0) is not a constructor]
        console.log("Object object lolol with maybe object promise???", service)
        var puzzleID = await createPuzzle(context, service, resolution, resolution, arr); // async function, returns puzzle ID, no dependencies 
        //let res = service.validateSolution(arr, "puzzle1")
        //console.log("result", res);
        let success2 = await createPost(puzzleID, context)
        if (success2) console.log("Yay, you created a post!")
        context.ui.showToast({text: "Submitted!", appearance: 'success'});
        let success = 1; // always set to 1 for now, else set to res once res is working
        if (success) context.ui.showToast("Success set to 1 for debug purposes");
        setImageData(arr2);
        if (success) setPage("WinScreen"); // switch page if successful 
    }
    async function createPost(puzzleID: number, context: Devvit.Context) {
        try {

            const subreddit = await context.reddit.getCurrentSubreddit();

            await context.reddit.submitPost({
            title: puzzleID.toString(),
            subredditName: subreddit.name,
            preview: (
                <vstack>
                <text>Loading ...</text>
                </vstack>
            ),
            });
            context.ui.showToast('Created post!');
        } catch (error) {
            console.log("Failed to create post:", error)
            return false;
        }
        return true
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
        <vstack width = "100%" height = "100%" alignment='center middle'>
            <vstack>
                <hstack height="100%" padding='small' gap='small' alignment = 'center middle'>
                    <vstack gap="small" alignment="center middle">
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
                    </vstack>
                    <vstack gap="small" height="100%" alignment="center middle">
                        <Canvas />
                        <ColorSelector />
                    </vstack>
                </hstack>
                <button onPress={() => {submit(data, context)}}> Submit </button>
            </vstack>
        

        </vstack>
    
   )
}