import { config } from "@gluestack-ui/config";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import { AxiosInstance } from "axios";
import StoryReaderScreen from "../../screens/StoryReaderScreen";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
    },
    mutations: {
      retry: false,
      gcTime: 0,
    },
  },
});

const baseStory = {
  id: 1,
  title: "Hello, World!",
  body: "This is the body!",
  genres: [],
  upVotes: 0,
  downVotes: 0,
  myVote: null,
};

describe("StoryReaderScreen", () => {
  it("renders correctly", async () => {
    const axios = {
      get: jest.fn().mockResolvedValue({
        data: baseStory,
      }),
    } as unknown as AxiosInstance;
    render(
      <QueryClientProvider client={queryClient}>
        <GluestackUIProvider config={config}>
          <StoryReaderScreen
            navigation={{ navigate: () => {}, route: { name: "Home" } }}
            axios={axios}
            storyId={1}
          />
        </GluestackUIProvider>
      </QueryClientProvider>,
    );

    const storyTitle = await screen.findByText(/Hello, World!/);
    expect(storyTitle).toBeDefined();
  });

  describe("Votes", () => {
    it("renders votes", async () => {
      const axios = {
        get: jest.fn().mockResolvedValue({
          data: { ...baseStory, myVote: null },
        }),
      } as unknown as AxiosInstance;

      render(
        <QueryClientProvider client={queryClient}>
          <GluestackUIProvider config={config}>
            <StoryReaderScreen
              navigation={{ navigate: () => {}, route: { name: "Home" } }}
              axios={axios}
              storyId={1}
            />
          </GluestackUIProvider>
        </QueryClientProvider>,
      );

      const storyTitle = await screen.findByText(/Hello, World!/);
      expect(storyTitle).toBeDefined();

      const actionFab = await screen.findByLabelText("More");
      expect(actionFab).toBeDefined();

      fireEvent.press(actionFab);

      const upVoteButton = await screen.findByText("Up Vote");
      expect(upVoteButton).toBeDefined();

      const downVoteButton = await screen.findByText("Down Vote");
      expect(downVoteButton).toBeDefined();
    });

    it("allows voting", async () => {
      const axios = {
        get: jest.fn().mockResolvedValue({
          data: { ...baseStory, myVote: null },
        }),
        post: jest.fn().mockResolvedValue({
          data: { ...baseStory, id: 2, myVote: { direction: "UP" } },
        }),
      } as unknown as AxiosInstance;

      render(
        <QueryClientProvider client={queryClient}>
          <GluestackUIProvider config={config}>
            <StoryReaderScreen
              navigation={{ navigate: () => {}, route: { name: "Home" } }}
              axios={axios}
              storyId={1}
            />
          </GluestackUIProvider>
        </QueryClientProvider>,
      );

      const storyTitle = await screen.findByText(/Hello, World!/);
      expect(storyTitle).toBeDefined();

      const actionFab = await screen.findByLabelText("More");
      expect(actionFab).toBeDefined();

      fireEvent.press(actionFab);

      const upVoteButton = await screen.findByText("Up Vote");
      fireEvent.press(upVoteButton);

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith("/stories/1/votes", {
          direction: "UP",
        });
      });
    });

    it("allows unvoting", async () => {
      const axios = {
        get: jest.fn().mockResolvedValue({
          data: { ...baseStory, myVote: { id: 1, direction: "UP" } },
        }),
        delete: jest.fn().mockResolvedValue({
          data: {},
        }),
      } as unknown as AxiosInstance;

      render(
        <QueryClientProvider client={queryClient}>
          <GluestackUIProvider config={config}>
            <StoryReaderScreen
              navigation={{ navigate: () => {}, route: { name: "Home" } }}
              axios={axios}
              storyId={1}
            />
          </GluestackUIProvider>
        </QueryClientProvider>,
      );

      const storyTitle = await screen.findByText(/Hello, World!/);
      expect(storyTitle).toBeDefined();

      const actionFab = await screen.findByLabelText("More");
      expect(actionFab).toBeDefined();

      fireEvent.press(actionFab);

      const upVoteButton = await screen.findByText("Up Vote");
      fireEvent.press(upVoteButton);

      await waitFor(() => {
        expect(axios.delete).toHaveBeenCalledWith("/votes/1");
      });
    });

    it("allows changing a vote", async () => {
      const axios = {
        get: jest.fn().mockResolvedValue({
          data: { ...baseStory, myVote: { id: 1, direction: "UP" } },
        }),
        put: jest.fn().mockResolvedValue({
          data: { ...baseStory, myVote: { id: 1, direction: "DOWN" } },
        }),
      } as unknown as AxiosInstance;

      render(
        <QueryClientProvider client={queryClient}>
          <GluestackUIProvider config={config}>
            <StoryReaderScreen
              navigation={{ navigate: () => {}, route: { name: "Home" } }}
              axios={axios}
              storyId={1}
            />
          </GluestackUIProvider>
        </QueryClientProvider>,
      );

      const storyTitle = await screen.findByText(/Hello, World!/);
      expect(storyTitle).toBeDefined();

      const actionFab = await screen.findByLabelText("More");
      expect(actionFab).toBeDefined();

      fireEvent.press(actionFab);

      const downVoteButton = await screen.findByText("Down Vote");
      fireEvent.press(downVoteButton);

      await waitFor(() => {
        expect(axios.put).toHaveBeenCalledWith("/votes/1", {
          direction: "DOWN",
        });
      });
    });
  });
});
