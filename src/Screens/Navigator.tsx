import { Devvit, useState, useAsync } from "@devvit/public-api";
import { StartScreen } from "./startScreen";
import { DrawScreen } from "./DrawScreen";
import { WinScreen } from "./WinScreen";
import { DisplayScreen } from "./DisplayScreen";
import { GuessPost } from "./GuessPost";
import { LoadingScreen } from "./loadingScreen";
import Service from "../services/Service";
type NavigatorType = {
    _context: Devvit.Context;
}
export const Navigator = ({_context}: NavigatorType) => {
    const [counter, setCounter] = useState(0);
    const [page, setPage] = useState('a');
    const [resolution, setResolution] = useState(8); // set to 8x8 by default 
    const [dummy, setDummy] = useState("Dumbbb")
    const [isCreatePost, setIsCreatePost] = useState(true)
    const updateData = async () => {
        // Your async function that returns a number
        if (!title) return null
        let tmpTitle = title ? title : ""
        let service = new Service(_context)
        console.log("before doing other things...")
        let puzzle = await service.getPuzzle(parseInt(tmpTitle))
        if (!puzzle) return null
        let pieces = puzzle.pixels
        let height = puzzle.height
        console.log(pieces, height)
        //let width = puzzle.width assume height and width are the same for a grid 
        setResolution(height)
        var pix = Array(height * height).fill(0);
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < height; j++) {
                pix[i * height + j] = pieces[i][j]
            }
        }
        console.log(pix)
        setImageData(pix)
        setPage("GuessPost");
        //const newData = await someAsyncOperation();
        //setData(newData);
      };
    const { data: assortedStuff, loading: loading2, error: erro2 } = useAsync(async () => {
        if (!isCreatePost) {
            if (!title) return null
            let tmpTitle = title ? title : ""
            let service = new Service(_context)
            console.log("before doing other things...")
            let puzzle = await service.getPuzzle(parseInt(tmpTitle))
            if (!puzzle) return null
            let pieces = puzzle.pixels
            let height = puzzle.height
            console.log(pieces, height)
            //let width = puzzle.width assume height and width are the same for a grid 
            //setResolution(height)
            var pix = Array(height * height).fill(0);
            for (let i = 0; i < height; i++) {
                for (let j = 0; j < height; j++) {
                    pix[i * height + j] = pieces[i][j]
                }
            }
            console.log(pix)
            //setImageData(pix)
            //setPage("GuessPost");
            
            return  { resolution: height, imageData: pix, page: "GuessPost"};
        }
        return null;
    }, { depends: [isCreatePost] });

    var targetTitle = "Create Tetramatch!"

    const { data: title, loading, error } = useAsync(async () => {
        // Make your Reddit API call here
        var title = await getTitle();
        return title;
    });

    let tst = Array(resolution * resolution).fill(-1)
    // so right now, we have it so that imageData is being sent to currentPage as a solution
    // this means after creating something, we'll see its afterimage the next time. 
    // Is this a feature, or a bug? 
    // we could do it such that GuessPost only alters a new hook called solutionData, but I want to test this approach first 
    const [imageData, setImageData] = useState(tst)

    console.log("Checking conditional async")
    /*if (page === 'a') {
        if (title && title.includes(targetTitle)) {
            console.log("Title target acquired");
            setPage('startScreen');
        } else if (assortedStuff) {
            console.log("assorted stuff lol");
            console.log(assortedStuff);
            setResolution(assortedStuff.resolution);
            setImageData(assortedStuff.imageData);
            setPage('GuessPost');
        } else {
            console.log("nonspecific username", title);
            if (isCreatePost) {
                console.log("IsCreatePost")
                setIsCreatePost(false);
            }
        }
    }*/
    console.log("test", assortedStuff)
    if (title && page === 'a') { // only switch page if this is the first time 
        if (title.includes(targetTitle)) {
            console.log("Title target acquired");
            setPage('startScreen'); 
        } /*else if (assortedStuff) {
            console.log("assorted stuff lol")
            console.log(assortedStuff);
    
            //setResolution(assortedStuff.resolution);
            //setImageData(assortedStuff.imageData);
            //setPage(assortedStuff.page); 
            setPage('GuessPost'); */
            /*setPage(prevPage => {
                console.log("Updating page from", prevPage, "to GuessPost");
                return assortedStuff.page;
            });*/
    
        //     console.log("Page shoudl be set now...")
        // } else {
            // we need to invoke guessPost 
            console.log("nonspecific username", title);
            if (isCreatePost)
            {
                console.log("is create post!")
                setIsCreatePost(false);  
            } 
            //setPage('GuessPost'); 
            updateData();

            //configureGuessPost(); // lets see if this works lol
            // dang it does 
            // this means, we need to make a call to get the puzzle, as shown by the title 
            // we can do this with conditional async call hooks 
            /**
             * 
             *   const [shouldMakeCall, setShouldMakeCall] = useState(false);
                const [storedNumber, setStoredNumber] = useState<number | null>(null);

                const { data, loading, error } = useAsync(async () => {
                    if (shouldMakeCall) {
                    // Your async function that returns a number
                    const result = await someAsyncFunction();
                    setStoredNumber(result);
                    return result;
                    }
                    return null;
                }, { depends: [shouldMakeCall] });
             */
        }
    }
    if (assortedStuff && page === 'a') {
        console.log("assorted stuff lol")
        console.log(assortedStuff);
        setPage('GuessPost'); 
        setResolution(100000);
        setDummy("smarty")
        /*setPage(prevPage => {
            console.log("Updating page from", prevPage, "to GuessPost");
            return assortedStuff.page;
        });*/
        //setResolution(assortedStuff.resolution);
        //setImageData(assortedStuff.imageData);
        //setPage(assortedStuff.page); 
       console.log("Page shoudl be set now...")
    }
    /*if (assortedStuff) {
        console.log("asfdsdaf", assortedStuff);
        setPage('GuessPost'); 

    }*/
    /*conditionalAsync(); // check for conditional async stuff once every rerender 
    function conditionalAsync() {
        
    }*/


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
    /*function configurePage() {
        logAuthor()
        .then((result) => {
            if (result === targetAuthor) {
                setPage("startScreen");
            } else {
                setPage("DisplayScreen");
            }
        })
        .catch((error) => console.error("Error:", error));
    }*/
    function dumbfunction(tst) {
        console.log("Well that was dumb...")
        setPage("GuessPost")
        return tst.page.toString();
    }
    return (
        <blocks>
            <button onPress={ () => {
                //setPage("GuessPost")
                console.log("Do nothing!!!");
            }}
            > {assortedStuff ? dumbfunction(assortedStuff) : "nothing"} 
            and page: {page} and res: {resolution} and dummy: {dummy}
            </button>  
            {currentPage}
        </blocks> 
    );
}