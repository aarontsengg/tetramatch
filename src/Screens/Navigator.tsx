import { Devvit, useState, useAsync } from "@devvit/public-api";
import { StartScreen } from "./startScreen";
import { DrawScreen } from "./DrawScreen";
import { WinScreen } from "./WinScreen";
import { DisplayScreen } from "./DisplayScreen";
import { GuessPost } from "./GuessPost";
import { LoadingScreen } from "./loadingScreen";
type NavigatorType = {
    _context: Devvit.Context;
}
export const Navigator = ({_context}: NavigatorType) => {
    const [author, setAuthor] = useState(""); // empty author for start 
    const [counter, setCounter] = useState(0);
    const [page, setPage] = useState('a');
    const [resolution, setResolution] = useState(8); // set to 8x8 by default 

    var targetAuthor = "gridlock-game2"

    const { data: nameAuthor, loading, error } = useAsync(async () => {
        // Make your Reddit API call here
        var nameAuthor = await logAuthor();
        return nameAuthor;
    });
    function configureGuessPost(): void {
        // basically query for the guess post and actually display it 
        setPage("GuessPost");

    }
    if (nameAuthor && !loading && !error) {
        if (nameAuthor === targetAuthor) {
            console.log("LETS GOOOOO");
            setPage('startScreen'); 
        } else {
            console.log("nonspecific username", nameAuthor);
        }
    }

    let tst = Array(resolution * resolution).fill(-1)
    // so right now, we have it so that imageData is being sent to currentPage as a solution
    // this means after creating something, we'll see its afterimage the next time. 
    // Is this a feature, or a bug? 
    // we could do it such that GuessPost only alters a new hook called solutionData, but I want to test this approach first 
    const [imageData, setImageData] = useState(tst)
    let currentPage;
    switch (page) {
      case 'startScreen':
        currentPage = <StartScreen setPage={setPage} />;
        break;
      case 'drawScreen':
        //currentPage = <CounterScreen setPage={setPage} setCounter={setCounter} counter={counter}/>;
        currentPage = <DrawScreen setPage={setPage} context={_context} setImageData={setImageData} solnImg={imageData}/>
        break;
      case 'WinScreen':
        currentPage = <WinScreen data={imageData} resolution={resolution} setPage={setPage}/> // note that there is no parameter, and you're stuck on the win screen lol 
        break;
      case 'DisplayScreen':
        // start with a 2D array 
        let pix = [[0, 0, 0, 0, 0, 9, 0, 0],
                [0, 5, 5, 0, 9, 9, 0, 0],
                [0, 0, 5, 5, 9, 2, 2, 0],
                [0, 2, 0, 0, 0, 0, 0, 2],
                [0, 2, 0, 0, 0, 0, 0, 2],
                [0, 2, 0, 0, 0, 0, 0, 2],
                [0, 2, 2, 0, 0, 0, 0, 2],
                [0, 0, 2, 2, 2, 2, 2, 0]]
        // convert to 1D
        let pix2 = Array(pix.length * pix[0].length).fill(0);
        
        for (let i = 0; i < pix.length; i++) {
          for (let j = 0; j < pix[0].length; j++) {
            pix2[i * 8 + j] = pix[i][j];
          }
        }
        // fire picture from tetramatch canvas 
        //pix2 = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 2, 2, 2, -1, -1, -1, 2, 2, 2, 2, 2, -1, 2, 2, 2, 2, 2, 3, 3, -1, 2, 2, 2, 3, 3, 3, 3, 2, 2, 2, 3, 3, 3, 3, 3, 2, 3, 3, 3, 3, 3, 4, 4, 3, 3, 3, 4, 4, 4, 4, 4]
        // fire pic 2 
        //pix2 = [1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 2, 2, 2, 1, 2, 1, 2, 1, 2, 3, 2, 2, 2, 1, 2, 1, 2, 3, 3, 2, 2, 2, 2, 2, 2, 3, 4, 3, 2, 2, 2, 2, 3, 3, 4, 4, 3, 2, 2, 2, 3, 4, 4, 4, 3, 2]
        // now you can pass it 
        // stolen pikachu pic 
        pix2 = [7, 1, 1, 7, 7, 7, 7, 1, 7, 7, 4, 4, 7, 7, 7, 4, 7, 7, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 1, 4, 4, 1, 4, 4, 7, 2, 4, 4, 4, 4, 7, 9, 7, 4, 4, 4, 4, 7, 7, 9, 4, 4, 4, 4, 4, 7, 7, 7, 4, 4, 9, 9, 4, 7]
        currentPage = <DisplayScreen data={pix2} resolution={8}/>;
        break;
      case 'GuessPost':
        currentPage = <GuessPost data={imageData} resolution={resolution} setPage={setPage} setImageData={setImageData}/>;
        break;
      default:
        //currentPage = <StartScreen setPage={setPage} />;
        currentPage = <LoadingScreen />
        //configurePage(); // change page to other thing 
        //currentPage = <GuessPost data={imageData} resolution={resolution} setPage={setPage} setImageData={setImageData}/>;
        //currentPage = <DisplayScreen resolution={8} data={pix2}/>;

    }
    async function logAuthor() {
        const postId = _context.postId ? _context.postId : "";
        var nameAuthor = "";
        try {
            const post = await _context.reddit.getPostById(postId);
            console.log(`The current post's author is: ${post?.authorName}`);
            nameAuthor = post?.authorName;
            //setAuthor(nameAuthor);
        } catch (error) {
            console.error("Error fetching user:", error);
        }
        return nameAuthor;
    }
    function configurePage() {
        logAuthor()
        .then((result) => {
            if (result === targetAuthor) {
                setPage("startScreen");
            } else {
                setPage("DisplayScreen");
            }
        })
        .catch((error) => console.error("Error:", error));
    }
    //logAuthor(); // logs the author to begin 
    return (
        <blocks>
            <button onPress={ () => {
                //setPage("GuessPost")
                console.log("Do nothing!!!");
            }}
            > Press me 
            </button> 
            {currentPage}
        </blocks> 
    );
}