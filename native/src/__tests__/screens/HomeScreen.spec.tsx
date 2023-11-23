import { config } from "@gluestack-ui/config";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react-native";
import { AxiosInstance } from "axios";
import HomeScreen from "../../screens/HomeScreen";

describe("renders correctly", () => {
  it("does something", async () => {
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
    const axios = {
      get: jest.fn().mockResolvedValue({
        data: {
          stories: [
            {
              id: 1,
              title: "1. Hello, World!",
              genres: [],
            },
          ],
          nextCursor: null,
        },
      }),
    } as unknown as AxiosInstance;

    render(
      <QueryClientProvider client={queryClient}>
        <GluestackUIProvider config={config}>
          <HomeScreen
            navigation={{ navigate: () => {}, route: { name: "Home" } }}
            axios={axios}
          />
        </GluestackUIProvider>
      </QueryClientProvider>,
    );
    const story = await screen.findByText(/Hello, World!/);
    expect(story).toBeDefined();
  });
});
