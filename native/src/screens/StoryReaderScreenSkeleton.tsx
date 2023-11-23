import { Box, Center, VStack, View } from "@gluestack-ui/themed";
import React from "react";
import Skeleton from "../Skeleton";

const ParagraphSkeleton = () => (
  <Box>
    <Skeleton height={16} paddingVertical={8} paddingHorizontal={2} />
    <Skeleton height={16} paddingVertical={8} paddingHorizontal={2} />
    <Skeleton height={16} paddingVertical={8} paddingHorizontal={2} />
    <Skeleton height={16} paddingVertical={8} paddingHorizontal={2} />
    <Skeleton height={16} paddingVertical={8} paddingHorizontal={2} />
    <Skeleton height={16} paddingVertical={8} paddingHorizontal={2} />
    <Skeleton
      height={16}
      width="75%"
      paddingVertical={8}
      paddingHorizontal={2}
    />
  </Box>
);
const StoryReaderScreenSkeleton = () => (
  <View>
    <Center>
      <Skeleton height={30} width="75%" />
      <Skeleton height={25} width="10%" />
    </Center>
    <VStack space="md">
      <ParagraphSkeleton />
      <ParagraphSkeleton />
      <ParagraphSkeleton />
    </VStack>
  </View>
);

export default StoryReaderScreenSkeleton;
