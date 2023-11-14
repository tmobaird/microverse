import {
  Box,
  FlatList,
  Heading,
  Spinner,
  Text,
  VStack,
  View,
} from "@gluestack-ui/themed";
import { useInfiniteQuery } from "@tanstack/react-query";
import { AxiosInstance } from "axios";
import React from "react";
import { Navigation, Story } from "../../types";
import StoryCard from "./StoryCard";

type StoryResponse = {
  stories: Story[];
  nextCursor: number | null;
};

const HomeScreen = ({
  navigation,
  axios,
}: {
  navigation: Navigation;
  axios: AxiosInstance;
}) => {
  const stories = useInfiniteQuery<StoryResponse>({
    queryKey: ["stories"],
    queryFn: ({ pageParam }) => {
      if (pageParam) {
        return axios
          .get(`/stories?cursor=${pageParam}`)
          .then((res) => res.data);
      } else {
        return axios.get(`/stories`).then((res) => res.data);
      }
    },
    initialPageParam: null,
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
  });

  const onPressStory = (id: number) => {
    navigation.navigate("story", { id });
  };

  const renderStoryCard = ({ item }) => {
    return <StoryCard key={item.id} story={item} onPress={onPressStory} />;
  };

  return (
    <View paddingTop={50} paddingHorizontal={10}>
      {stories.isLoading && <Text>Loading...</Text>}
      {stories.isError && <Text>Error: Failed to load</Text>}
      {stories.data && (
        <FlatList
          data={stories.data.pages
            .flatMap((page, pi) =>
              page.stories.map((story, i) => {
                if (pi === 0 && i === 0) {
                  return null;
                } else {
                  return story;
                }
              }),
            )
            .filter((story) => story)}
          renderItem={renderStoryCard}
          onEndReached={() => stories.hasNextPage && stories.fetchNextPage()}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => (
            <VStack space="xl">
              {stories.data &&
                stories.data.pages[0] &&
                stories.data.pages[0].stories[0] && (
                  <Box>
                    <Heading size="xl" marginBottom="$2">
                      Today's Story
                    </Heading>
                    <StoryCard
                      story={stories.data.pages[0].stories[0]}
                      onPress={onPressStory}
                    />
                  </Box>
                )}
              <Box>
                <Heading size="xl" marginBottom="$2">
                  Older Stories
                </Heading>
              </Box>
            </VStack>
          )}
        />
      )}
      {stories.isFetchingNextPage && <Spinner color="$indigo600" />}
    </View>
  );
};

export default HomeScreen;
