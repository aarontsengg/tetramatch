// Learn more at developers.reddit.com/docs
import { Devvit, useState } from '@devvit/public-api';


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

type PageAProps = {
  setPage: (page: string) => void;
}
type PageBProps = {
  setPage: (page: string) => void;
  counter: number;
  // take a number value or a function value. Return void
  setCounter:  (value: number | ((prevState: number) => number)) => void;
}

const PageA = ({ setPage }: PageAProps) => (
  <vstack
    width="100%"
    height="100%"
    alignment="middle center"
    gap="large"
    backgroundColor="lightblue"
  >
    <text size="xxlarge">Page A</text>
    <button onPress={() => setPage('b')}>Go to B</button>
  </vstack>
);

const PageB = ({ setPage, counter, setCounter}: PageBProps) => (
  <vstack height="100%" width="100%" gap="medium" alignment="center middle">
    <image
      url="Trollface.png"
      description="logo"
      imageHeight={256}
      imageWidth={256}
      height="48px"
      width="48px"
    />
    <text size="large">{`Number of times a random person died: ${counter} Money: ${counter * 100000}`}</text>
    <button appearance="primary" onPress={() => setCounter((counter) => counter + 1)}>
      kill random person and get money 
    </button>
    <button onPress={() => setPage('a')}>Go to A</button>
  </vstack>
);

// Add a post type definition
Devvit.addCustomPostType({
  name: 'Experience Post',
  height: 'regular',

  render: (_context) => {
    const [counter, setCounter] = useState(0);
    const [page, setPage] = useState('a');

    let currentPage;
    switch (page) {
      case 'a':
        currentPage = <PageA setPage={setPage} />;
        break;
      case 'b':
        currentPage = <PageB setPage={setPage} setCounter={setCounter} counter={counter}/>;
        break;
      default:
        currentPage = <PageA setPage={setPage} />;
    }
    return (
      <blocks>
        {currentPage}
      </blocks>
    );
  },
});

export default Devvit;
