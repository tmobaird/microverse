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

export type Image = {
  id: number;
  url: string;
  blobId: string;
  afterParagraph: number;
  storyId: number;
  createdAt: string;
  updatedAt: string;
};

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
  images: Image[];
};
