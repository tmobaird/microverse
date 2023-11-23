import { Avatar, AvatarGroup, Box, Text } from "@gluestack-ui/themed";
import React from "react";

const genreMap: any = {
  romance: {
    emoji: "🌹",
    bgColor: "$rose300",
  },
  horror: {
    emoji: "👻",
    bgColor: "$textDark900",
  },
  fantasy: {
    emoji: "🧙‍♀️",
    bgColor: "$green300",
  },
  "science fiction": {
    emoji: "👽",
    bgColor: "$indigo600",
  },
  dystopian: {
    emoji: "🏙",
    bgColor: "$lightBlue400",
  },
  "action + adventure": {
    emoji: "⚔️",
    bgColor: "$violet300",
  },
  mystery: {
    emoji: "🔍",
    bgColor: "$trueGray400",
  },
  "historical fiction": {
    emoji: "📜",
    bgColor: "$amber500",
  },
};

const getEmojiForGenre = (
  genre: string,
): { emoji: string; bgColor: string } | null => {
  let genreMapping = genreMap[genre];
  if (!genreMapping) {
    return null;
  }
  return genreMapping;
};

const GenreList = ({ genres }: { genres: string[] }) => {
  let genresToDisplay = genres.filter((genre) => genreMap[genre] !== undefined);
  return (
    <Box accessibilityLabel="Genre List">
      <AvatarGroup>
        {genresToDisplay.map((genre) => (
          <Avatar
            accessibilityLabel={genre}
            key={genre}
            sx={{
              _dark: {
                borderColor: "$white",
              },
              _light: {
                borderColor: "$borderDark800",
              },
            }}
            borderWidth="$2"
            bgColor={getEmojiForGenre(genre)?.bgColor}
            size="sm"
          >
            <Text>{getEmojiForGenre(genre)?.emoji}</Text>
          </Avatar>
        ))}
      </AvatarGroup>
    </Box>
  );
};

export default GenreList;
