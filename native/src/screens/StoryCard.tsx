import {
  ArrowDownIcon,
  ArrowUpIcon,
  Box,
  HStack,
  Heading,
  Icon,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import React from "react";
import { TouchableOpacity } from "react-native";
import { Direction } from "../../types";
import GenreList from "./GenreList";

const VoteUpArrowIcon = ({
  darkColor,
  lightColor,
}: {
  darkColor: string;
  lightColor: string;
}) => {
  return (
    <Icon
      as={ArrowUpIcon}
      sx={{
        _dark: {
          color: darkColor,
        },
        _light: {
          color: lightColor,
        },
      }}
      size="xl"
    />
  );
};

const VoteDownArrowIcon = ({
  darkColor,
  lightColor,
}: {
  darkColor: string;
  lightColor: string;
}) => {
  return (
    <Icon
      as={ArrowDownIcon}
      sx={{
        _dark: {
          color: darkColor,
        },
        _light: {
          color: lightColor,
        },
      }}
      size="xl"
    />
  );
};

const VoteObject = ({
  direction,
  myVote,
  voteCount,
}: {
  direction: Direction;
  myVote: Direction | null;
  voteCount: number;
}) => {
  return (
    <VStack>
      {direction === Direction.UP ? (
        <VoteUpArrowIcon
          darkColor={myVote == direction ? "$green400" : "$trueGray100"}
          lightColor={myVote == direction ? "$green400" : "$trueGray500"}
        />
      ) : (
        <VoteDownArrowIcon
          darkColor={myVote == direction ? "$green400" : "$trueGray100"}
          lightColor={myVote == direction ? "$green400" : "$trueGray500"}
        />
      )}
      <Text alignSelf="center">{voteCount}</Text>
    </VStack>
  );
};

const StoryCard = ({
  story,
  onPress,
}: {
  story: any;
  onPress: (id: number) => void;
}) => {
  return (
    <Box mb={"$2"}>
      <TouchableOpacity activeOpacity={0.5} onPress={() => onPress(story.id)}>
        <Box
          rounded="$xl"
          borderWidth="$2"
          padding="$2"
          sx={{
            _dark: {
              borderColor: "$white",
            },
            _light: {
              borderColor: "$black",
            },
          }}
        >
          <HStack justifyContent="space-between">
            <Heading size="lg" width="$4/5" lineHeight="$md">
              {story.id}. {story.title}
            </Heading>
            <GenreList genres={story.genres} />
          </HStack>
          <HStack space="md">
            <VoteObject
              direction={Direction.UP}
              myVote={story.myVote?.direction}
              voteCount={story.upVotes}
            />
            <VoteObject
              direction={Direction.DOWN}
              myVote={story.myVote?.direction}
              voteCount={story.downVotes}
            />
          </HStack>
        </Box>
      </TouchableOpacity>
    </Box>
  );
};

export default StoryCard;
