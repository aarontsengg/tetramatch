import { Devvit, GetUserFlairBySubredditResponse } from "@devvit/public-api";
import { DisplayScreen } from "./DisplayScreen";
import { colors} from '../classes/DataPresets.js';
import { DrawScreen } from "./DrawScreen";
type GuessPostProps = {
    data: number[]; // as a prop, we take in a 1D array, because that is customary for React
    resolution: number;
    setPage: (page: string) => void;
    //setImageData: (img: number[]) => void;

}
// literally all this does is display the picutre. Nothing else. 
export const GuessPost = ({data, resolution, setPage}: GuessPostProps) => {
    function buttonHandler(): void {
        // we need to set background, then we can set screen... 
        console.log("Button pressed...")
        //setImageData(data); // this sets up the background for DrawScreen
        setPage("drawScreen");
    }
    return (
        <vstack height="100%" alignment="middle center" gap="small">
            <DisplayScreen data={data} resolution={resolution}/>
            <button onPress={() => buttonHandler()}>Attempt this drawing!</button>
        </vstack>
   )
}