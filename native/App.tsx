import { COLORMODES } from "@gluestack-style/react/lib/typescript/types";
import { config } from "@gluestack-ui/config";
import { Box, GluestackUIProvider, Text, View } from "@gluestack-ui/themed";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { useColorScheme } from "react-native";
import "react-native-get-random-values";
import { screenBackgroundLight } from "./colors";
import UserProvider, { UserContext } from "./src/UserProvider";
import HomeScreen from "./src/screens/HomeScreen";
import StoryReaderScreen from "./src/screens/StoryReaderScreen";
import { Navigation } from "./types";

const queryClient = new QueryClient();

interface Route {
  name: string;
  params: any;
}

export const useAxiosClient = () => {
  const context = React.useContext(UserContext);

  return axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${context.token}`,
    },
  });
};

const Router = () => {
  const [route, setRoute] = React.useState<Route>({ name: "home", params: {} });
  const axios = useAxiosClient();

  const navigation: Navigation = {
    route: route,
    navigate: (name: string, params: any) => {
      setRoute({ name, params });
    },
  };
  switch (route.name) {
    case "story":
      return (
        <StoryReaderScreen
          navigation={navigation}
          storyId={route.params.id}
          axios={axios}
        />
      );
    default:
      return <HomeScreen navigation={navigation} axios={axios} />;
  }
};

const UUIDBar = () => {
  const { uuid } = React.useContext(UserContext);
  return (
    <Box>
      <Text>{uuid}</Text>
    </Box>
  );
};

export default function App() {
  let colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <GluestackUIProvider
        config={config}
        colorMode={colorScheme as COLORMODES}
      >
        <UserProvider>
          <View
            style={{ flex: 1 }}
            sx={{
              _dark: {
                backgroundColor: "$black",
              },
              _light: {
                backgroundColor: screenBackgroundLight,
              },
            }}
          >
            <View
              style={{ position: "absolute", left: 25, right: 0, bottom: 25 }}
            >
              <UUIDBar />
            </View>
            <Router />
          </View>
        </UserProvider>
      </GluestackUIProvider>
    </QueryClientProvider>
  );
}
