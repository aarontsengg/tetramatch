import { Devvit, useState, useAsync } from "@devvit/public-api";
import { StartScreen } from "./startScreen";
import { DrawScreen } from "./DrawScreen";
import { WinScreen } from "./WinScreen";
import { DisplayScreen } from "./DisplayScreen";
import { GuessPost } from "./GuessPost";
import { LoadingScreen } from "./loadingScreen";
import Service from "../services/Service";
import { create } from "domain";
type NavigatorType = {
    _context: Devvit.Context;
}
export const Navigator = ({_context}: NavigatorType) => {
    const [counter, setCounter] = useState(0);
    const [page, setPage] = useState('a');
    const [resolution, setResolution] = useState(8); // set to 8x8 by default 
    const [isCreatePost, setIsCreatePost] = useState(true)
    const [puzzleID, setPuzzleID] = useState(-1)
    let tst = Array(resolution * resolution).fill(-1)
    const [imageData, setImageData] = useState(tst)

    var targetTitle = "Create Tetramatch!"

    const { data: conditionalStuff, loading, error } = useAsync(async () => {
        // Make your Reddit API call here
        var title = await getTitle();
        var pieces = tst;
        var height = resolution;
        var page = "startScreen"
        var createPost = true
        if (title && !title.includes(targetTitle)) {
            // Async call to query data from the database
            let service = new Service(_context)
            let puzzle = await service.getPuzzle(parseInt(title))
            if (!puzzle) return {title: title, pieces: pieces, height: height, page: page, createPost: createPost};
            pieces = puzzle.pixels
            height = puzzle.height
            //let width = puzzle.width assume height and width are the same for a grid 
            var pix = Array(height * height).fill(0);
            for (let i = 0; i < height; i++) {
                for (let j = 0; j < height; j++) {
                    pix[i * height + j] = pieces[i][j]
                }
            }
            pieces = pix
            page = "GuessPost"
            createPost = false
        } else {
            console.log("Title target acquired");
        }
        return {title: title, pieces: pieces, height: height, page: page, createPost: createPost};
    });

    if (conditionalStuff && page === 'a') { // only switch page if this is the first time 
        setImageData(conditionalStuff.pieces)
        setResolution(conditionalStuff.height)
        setPage(conditionalStuff.page)
        setIsCreatePost(conditionalStuff.createPost)
        let title = conditionalStuff.title
        if (title && !title.includes(targetTitle)) {
            setPuzzleID(parseInt(title))
        }

        console.log("res", conditionalStuff)
    }

    let currentPage;
    switch (page) {
      case 'startScreen':
        currentPage = <StartScreen setPage={setPage} />;
        break;
      case 'drawScreen':
        //currentPage = <CounterScreen setPage={setPage} setCounter={setCounter} counter={counter}/>;
        currentPage = <DrawScreen setPage={setPage} context={_context} setImageData={setImageData} page={page} solnImg={imageData} puzzleID={puzzleID}/>
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
        currentPage = <GuessPost data={imageData} resolution={resolution} setPage={setPage}/>;
        break;
      default:
        //currentPage = <StartScreen setPage={setPage} />;
        currentPage = <LoadingScreen />
        //configurePage(); // change page to other thing 
        //currentPage = <GuessPost data={imageData} resolution={resolution} setPage={setPage} setImageData={setImageData}/>;
        //currentPage = <DisplayScreen resolution={8} data={pix2}/>;

    }
    async function getTitle() {
        const postId = _context.postId ? _context.postId : "";
        if (postId === "") return "";
        var title = "";
        try {
            const post = await _context.reddit.getPostById(postId);
            console.log(`The current post's title is: ${post?.title}`);
            title = post?.title;
            //setAuthor(nameAuthor);
        } catch (error) {
            console.error("Error fetching user:", error);
        }
        return title;
    }
    return (
        <blocks>
            {currentPage}
        </blocks> 
    );
}