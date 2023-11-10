import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetIcon,
  ActionsheetItem,
  ActionsheetItemText,
  ArrowDownIcon,
  ArrowUpIcon,
  Badge,
  BadgeText,
  Box,
  Center,
  Fab,
  FabIcon,
  HStack,
  Heading,
  Icon,
  Image,
  Pressable,
  ScrollView,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  StatusBar,
  Text,
  ThreeDotsIcon,
  VStack,
  View,
} from "@gluestack-ui/themed";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosInstance } from "axios";
import React from "react";
import { Direction, Navigation, Story } from "../../types";
import GenreList from "./GenreList";

type ColorTheme = "SYSTEM" | "WHITE" | "BLACK" | "PAPER" | "PURPLE";

const colorThemeMapping = {
  SYSTEM: {
    backgroundColor: "fake",
    color: "fake",
  },
  WHITE: {
    backgroundColor: "$white",
    color: "$textDark800",
  },
  BLACK: {
    backgroundColor: "$black",
    color: "$white",
  },
  PAPER: {
    backgroundColor: "$yellow50",
    color: "$textDark900",
  },
  PURPLE: {
    backgroundColor: "$purple100",
    color: "$textDark900",
  },
};

const systemTextSx = {
  _dark: { color: "$white" },
  _light: { color: "$black" },
};

type TextSize =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "2xs"
  | "4xl"
  | "5xl"
  | "6xl"
  | undefined;
const textSizeList: TextSize[] = ["xs", "sm", "md", "lg", "xl", "2xl"];

const StoryReaderScreen = ({
  storyId,
  navigation,
  axios,
}: {
  storyId: number;
  navigation: Navigation;
  axios: AxiosInstance;
}) => {
  const queryClient = useQueryClient();
  const [showActionsheet, setShowActionsheet] = React.useState(false);
  const [sliderValue, setSliderValue] = React.useState(3);
  const [colorTheme, setColorTheme] = React.useState<ColorTheme>("SYSTEM");

  const handleSliderChange = (value: any) => {
    setSliderValue(value);
  };

  const handleClose = () => setShowActionsheet(!showActionsheet);
  const story = useQuery<Story>({
    queryKey: ["story", storyId],
    queryFn: () => axios.get(`/stories/${storyId}`).then((res) => res.data),
  });

  const createVote = useMutation({
    mutationFn: (direction: string) =>
      axios.post(`/stories/${storyId}/votes`, { direction: direction }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["story", storyId] }),
    onMutate: () => {},
    onError: () => console.log("error"),
  });

  const deleteVote = useMutation({
    mutationFn: (voteId: number) => axios.delete(`/votes/${voteId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["story", storyId] });
    },
    onMutate: () => {},
    onError: () => console.log("error"),
  });

  const updateVote = useMutation({
    mutationFn: ({
      voteId,
      direction,
    }: {
      voteId: number;
      direction: string;
    }) => axios.put(`/votes/${voteId}`, { direction: direction }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["story", storyId] });
    },
    onMutate: () => {},
    onError: () => console.log("error"),
  });

  const handlePressVote = (direction: Direction) => {
    if (story.data) {
      if (story.data.myVote?.direction === direction) {
        deleteVote.mutate(story.data.myVote.id);
      } else if (!story.data.myVote) {
        createVote.mutate(direction);
      } else if (story.data.myVote.direction !== direction) {
        updateVote.mutate({
          voteId: story.data.myVote.id,
          direction: direction,
        });
      }
    }
  };

  const handlePressUpVote = () => {
    handlePressVote(Direction.UP);
  };

  const handlePressDownVote = () => {
    handlePressVote(Direction.DOWN);
  };

  const renderStoryContent = (story: Story) => {
    let contents = story.body.split("\n").map((paragraph) => (
      <Text
        key={Math.random()}
        size={textSizeList[sliderValue]}
        sx={colorTheme === "SYSTEM" ? systemTextSx : undefined}
        color={
          colorTheme !== "SYSTEM"
            ? colorThemeMapping[colorTheme].color
            : undefined
        }
      >
        {paragraph}
      </Text>
    ));
    story.images.forEach((image) => {
      contents = [
        ...contents.slice(0, image.afterParagraph),
        <Image
          key={Math.random()}
          size="2xl"
          alt="Image"
          alignSelf="center"
          rounded="$lg"
          borderColor="$trueGray600"
          borderWidth="$2"
          source={{
            uri: image.url,
          }}
        />,
        ...contents.slice(image.afterParagraph),
      ];
      image.afterParagraph;
    });
    return contents;
  };

  return (
    <View
      backgroundColor={
        colorTheme !== "SYSTEM"
          ? colorThemeMapping[colorTheme].backgroundColor
          : undefined
      }
    >
      <ScrollView paddingHorizontal="$5" marginTop="$16">
        <StatusBar />
        {story.isLoading && <Text>Loading...</Text>}
        {story.isError && <Text>Error: Failed to load</Text>}
        {story.data && (
          <VStack space="md">
            <Center>
              <Heading
                textAlign="center"
                size="xl"
                lineHeight="$xl"
                pb="$2"
                sx={colorTheme === "SYSTEM" ? systemTextSx : undefined}
                color={
                  colorTheme !== "SYSTEM"
                    ? colorThemeMapping[colorTheme].color
                    : undefined
                }
              >
                {story.data.id}. {story.data.title}
              </Heading>
              <GenreList genres={story.data.genres} />
            </Center>
            {renderStoryContent(story.data)}
            <Box height="$40" />
          </VStack>
        )}
      </ScrollView>
      {story.data && (
        <Fab
          accessibilityLabel="More"
          size="md"
          placement="bottom right"
          marginBottom={20}
          isHovered={false}
          isDisabled={false}
          isPressed={false}
          backgroundColor="$trueGray700"
          rounded="$lg"
          onPress={handleClose}
          sx={{
            _dark: {
              backgroundColor: "$trueGray700",
            },
            _light: {
              backgroundColor: "$trueGray900",
            },
          }}
        >
          <FabIcon as={ThreeDotsIcon} size="xl" />
        </Fab>
      )}
      {story.data && (
        <Actionsheet
          isOpen={showActionsheet}
          onClose={handleClose}
          zIndex={999}
        >
          <ActionsheetBackdrop />
          <ActionsheetContent pb="$8">
            <ActionsheetDragIndicatorWrapper>
              <ActionsheetDragIndicator />
            </ActionsheetDragIndicatorWrapper>
            <ActionsheetItem disabled>
              <VStack width="100%">
                <Text pb="$2">Page Color</Text>
                <HStack>
                  {["WHITE", "BLACK", "PAPER", "PURPLE"].map((ct) => (
                    <Pressable
                      key={ct}
                      sx={{
                        ":active": {
                          opacity: 0.5,
                        },
                      }}
                      onPress={() => setColorTheme(ct as ColorTheme)}
                    >
                      <Box
                        width="$8"
                        height="$8"
                        bgColor={`${
                          colorThemeMapping[ct as ColorTheme].backgroundColor
                        }`}
                        borderColor={
                          colorTheme == ct ? "$primary400" : "$trueGray400"
                        }
                        borderWidth="$2"
                        rounded="$full"
                        marginRight="$2"
                      />
                    </Pressable>
                  ))}
                </HStack>
              </VStack>
            </ActionsheetItem>
            <ActionsheetItem disabled>
              <VStack width="100%">
                <Text pb="$2">Font Size</Text>
                <Center>
                  <HStack space="md" alignItems="center">
                    <Text size="sm">AB</Text>
                    <Box width="$5/6">
                      <Slider
                        size="md"
                        orientation="horizontal"
                        isDisabled={false}
                        isReversed={false}
                        minValue={0}
                        maxValue={5}
                        step={1}
                        sliderTrackHeight={4}
                        value={sliderValue}
                        thumbSize="sm"
                        onChange={handleSliderChange}
                      >
                        <SliderTrack>
                          <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb alignSelf="center" />
                      </Slider>
                    </Box>
                    <Text size="xl">AB</Text>
                  </HStack>
                </Center>
              </VStack>
            </ActionsheetItem>
            <ActionsheetItem onPress={handlePressUpVote}>
              <ActionsheetIcon>
                <Icon
                  as={ArrowUpIcon}
                  color={
                    story.data.myVote?.direction === "UP"
                      ? "$green500"
                      : "$coolGray400"
                  }
                />
              </ActionsheetIcon>
              <ActionsheetItemText>
                <HStack space="sm">
                  <Text>Up Vote</Text>
                  <Badge
                    justifyContent="center"
                    size="lg"
                    variant="solid"
                    rounded="$full"
                    bgColor={
                      story.data.myVote?.direction === "UP"
                        ? "$green500"
                        : "$trueGray400"
                    }
                  >
                    <BadgeText color="$white">{story.data.upVotes}</BadgeText>
                  </Badge>
                </HStack>
              </ActionsheetItemText>
            </ActionsheetItem>
            <ActionsheetItem onPress={handlePressDownVote}>
              <ActionsheetIcon>
                <Icon
                  as={ArrowDownIcon}
                  color={
                    story.data.myVote?.direction === "DOWN"
                      ? "$green500"
                      : "$coolGray400"
                  }
                />
              </ActionsheetIcon>
              <ActionsheetItemText>
                <HStack space="sm">
                  <Text>Down Vote</Text>
                  <Badge
                    justifyContent="center"
                    size="lg"
                    variant="solid"
                    rounded="$full"
                    bgColor={
                      story.data.myVote?.direction === "DOWN"
                        ? "$green500"
                        : "$trueGray400"
                    }
                  >
                    <BadgeText color="$white">{story.data.downVotes}</BadgeText>
                  </Badge>
                </HStack>
              </ActionsheetItemText>
            </ActionsheetItem>
            <ActionsheetItem onPress={() => navigation.navigate("home", {})}>
              <ActionsheetItemText>Exit Story</ActionsheetItemText>
            </ActionsheetItem>
          </ActionsheetContent>
        </Actionsheet>
      )}
    </View>
  );
};

export default StoryReaderScreen;
