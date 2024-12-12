import { Devvit} from "@devvit/public-api";
import { colors} from '../classes/DataPresets.js';
// what we want is just a canvas to display the drawing, and maybe a button to bring us to the draw screen? 

const size = 32;
function getPixel<T>(array: T[], resolution:number, x: number, y:number): T{
    return array[x * resolution + y];
}
function setPixel<T>(array: T[], resolution:number, x: number, y:number, value: T): void{
    array[x * resolution + y] = value;
}

type DisplayScreenProps = {
    data: number[]; // as a prop, we take in a 1D array, because that is customary for React
    resolution: number;
}
// literally all this does is display the picutre. Nothing else. 
export const DisplayScreen = ({data, resolution}: DisplayScreenProps) => {
    var defBackColor = "#FCFAE8"; // default background color 
    // we have no hooks, because nothing changes. This is static         
    const pixels = data.map((pixColor) => (
        <hstack
        height={`${size}px`}
        width={`${size}px`}
        backgroundColor={pixColor != -1 ? colors[pixColor] : defBackColor} // use -1 for default background color
        />
    ));
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
   return (

        <vstack gap="small" alignment="center middle">
            <Canvas />
        </vstack>
   )
}