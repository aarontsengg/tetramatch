import { Devvit } from "@devvit/public-api";
import { DisplayScreen } from "./DisplayScreen";


type WinScreenProps = {
    data: number[]; // as a prop, we take in a 1D array, because that is customary for React
    resolution: number;
    setPage: (page: string) => void;

}
export const WinScreen = ({data, resolution, setPage}: WinScreenProps) =>  {

    return ( 
        <vstack alignment="center middle" height = "100%" gap="small">
            <text> You win lol 🎉🎉🎉 </text>
            <DisplayScreen data={data} resolution={resolution}></DisplayScreen>
            <button onPress={() => {setPage("startScreen")}}> Back to home </button>
        </vstack>
    )
}