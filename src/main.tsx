// Learn more at developers.reddit.com/docs
import { Devvit, useState } from '@devvit/public-api';
import { StartScreen } from './Screens/startScreen.js';
import { CounterScreen } from './Screens/CounterScreen.js';
import {DrawScreen} from './Screens/DrawScreen.js';
import { WinScreen } from './Screens/WinScreen.js';
import { DisplayScreen } from './Screens/DisplayScreen.js';

Devvit.configure({
  redditAPI: true,
});


// Add a menu item to the subreddit menu for instantiating the new experience post
Devvit.addMenuItem({
  label: 'Add my post',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_event, context) => {
    const { reddit, ui } = context;
    const subreddit = await reddit.getCurrentSubreddit();
    const startDate = new Date('2024-12-04');
    const currentDate = new Date();
    const utcStartDate = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const utcCurrentDate = Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const diffTime = utcCurrentDate - utcStartDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to start counting from Tetramatch 1
    const postTitle = `Tetramatch ${diffDays}`;
    await reddit.submitPost({
      title: postTitle,
      subredditName: subreddit.name,
      // The preview appears while the post loads
      preview: (
        <vstack height="100%" width="100%" alignment="middle center">
          <text size="large">Loading ...</text>
        </vstack>
      ),
    });
    ui.showToast({ text: 'Created post!' });
  },
});

// Add a post type definition
Devvit.addCustomPostType({
  name: 'Experience Post',
  height: 'tall',
  
  render: (_context) => {
    const [counter, setCounter] = useState(0);
    const [page, setPage] = useState('a');

    let currentPage;
    switch (page) {
      case 'startScreen':
        currentPage = <StartScreen setPage={setPage} />;
        break;
      case 'drawScreen':
        //currentPage = <CounterScreen setPage={setPage} setCounter={setCounter} counter={counter}/>;
        currentPage = <DrawScreen setPage={setPage} context={_context}/>
        break;
      case 'WinScreen':
        currentPage = <WinScreen /> // note that there is no parameter, and you're stuck on the win screen lol 
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
        pix2 = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 2, 2, 2, -1, -1, -1, 2, 2, 2, 2, 2, -1, 2, 2, 2, 2, 2, 3, 3, -1, 2, 2, 2, 3, 3, 3, 3, 2, 2, 2, 3, 3, 3, 3, 3, 2, 3, 3, 3, 3, 3, 4, 4, 3, 3, 3, 4, 4, 4, 4, 4]
        // now you can pass it 
        currentPage = <DisplayScreen data={pix2} resolution={8}/>;
        break;
      default:
        currentPage = <StartScreen setPage={setPage} />;
        //currentPage = <DisplayScreen resolution={8} data={pix2}/>;

    }
    return (
      <blocks>
        {currentPage}
      </blocks>
    );
  },
});

export default Devvit;
