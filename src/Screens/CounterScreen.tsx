import { Devvit } from '@devvit/public-api';

type PageBProps = {
    setPage: (page: string) => void;
    counter: number;
    // take a number value or a function value. Return void
    setCounter:  (value: number | ((prevState: number) => number)) => void;
  }
  
export const CounterScreen = ({ setPage, counter, setCounter}: PageBProps) => (
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
      <button onPress={() => setPage('startScreen')}>Go to A</button>
    </vstack>
  );