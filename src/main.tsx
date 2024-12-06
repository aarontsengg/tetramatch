// Learn more at developers.reddit.com/docs
import { Devvit, useState } from '@devvit/public-api';
import { StartScreen } from './startScreen.js';
import { CounterScreen } from './CounterScreen.js';
import {DrawScreen} from './DrawScreen.js';

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
    await reddit.submitPost({
      title: 'My devvit post',
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
        currentPage = <DrawScreen setPage={setPage}/>
        break;
      default:
        currentPage = <StartScreen setPage={setPage} />;
    }
    return (
      <blocks>
        {currentPage}
      </blocks>
    );
  },
});

export default Devvit;
