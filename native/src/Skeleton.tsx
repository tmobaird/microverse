import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

interface Props {
  width?: number | `${number}%`;
  height?: number | `${number}%`;
  paddingHorizontal?: number;
  paddingVertical?: number;
}
const Skeleton = ({
  height = 12,
  width = "100%",
  paddingHorizontal = 16,
  paddingVertical = 8,
}: Props) => {
  const shimmerAnimated = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.timing(shimmerAnimated, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      })
    );

    shimmerAnimation.start();

    return () => {
      shimmerAnimation.stop();
    };
  }, [shimmerAnimated]);

  const interpolateShimmer = shimmerAnimated.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.7, 0.3],
  });

  return (
    <View style={{ ...styles.container, paddingHorizontal, paddingVertical }}>
      <Animated.View
        style={[
          styles.skeletonItem,
          {
            width: width,
            height: height,
          },
          {
            opacity: interpolateShimmer,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  skeletonItem: {
    borderRadius: 6,
    backgroundColor: "#CFCFCF",
  },
});

export default Skeleton;
