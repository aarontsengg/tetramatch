// Learn more at developers.reddit.com/docs
import { Devvit, useState } from '@devvit/public-api';
import { StartScreen } from './Screens/startScreen.js';
import { CounterScreen } from './Screens/CounterScreen.js';
import {DrawScreen} from './Screens/DrawScreen.js';
import { WinScreen } from './Screens/WinScreen.js';
import { DisplayScreen } from './Screens/DisplayScreen.js';
import { GuessPost } from './Screens/GuessPost.js';
import { StatementSync } from 'node:sqlite';
import { Navigator } from './Screens/Navigator.js';
Devvit.configure({
  redditAPI: true,
});


// Add a post type definition
Devvit.addCustomPostType({
  name: 'Experience Post',
  height: 'tall',
  render: (_context) => {
    return (
        <Navigator _context={_context}/>
    );
  },
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

/*Devvit.addCustomPostType({
  name: 'CreatePostButton',
  render: (context) => {
    return (
      <vstack>
        <button
          onPress={async () => {
            const subreddit = await context.reddit.getCurrentSubreddit();
            await context.reddit.submitPost({
              title: 'My new post',
              subredditName: subreddit.name,
              preview: (
                <vstack>
                  <text>Loading ...</text>
                </vstack>
              ),
            });
            context.ui.showToast('Created post!');
          }}
        >
          Create Post
        </button>
      </vstack>
    );
  },
});*/ // only one post type allowed per project lol 

export default Devvit;
