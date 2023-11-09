export type Navigation = {
  route: {
    name: string;
    params?: any;
  };
  navigate: (route: string, params?: any) => void;
};

export enum Direction {
  UP = "UP",
  DOWN = "DOWN",
}

export type Story = {
  id: number;
  title: string;
  body: string;
  myVote: {
    id: number;
    direction: Direction;
    userId: string;
  };
  upVotes: number;
  downVotes: number;
  genres: string[];
};
