import { Devvit } from '@devvit/public-api';

type PageAProps = {
    setPage: (page: string) => void;
}

export const StartScreen = ({ setPage }: PageAProps) => (
    <vstack
      width="100%"
      height="100%"
      alignment="middle center"
      gap="large"
      backgroundColor="lightblue"
    >
      <text size="xxlarge">Start Screen</text>
      <button onPress={() => setPage('drawScreen')}>Go to Draw</button>
    </vstack>
);
