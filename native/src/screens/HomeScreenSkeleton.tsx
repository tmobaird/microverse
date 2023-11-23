import { View } from "@gluestack-ui/themed";
import React from "react";
import Skeleton from "../Skeleton";

const HomeScreenSkeleton = () => (
  <View>
    <Skeleton height={35} width="50%" paddingHorizontal={5} />
    <Skeleton height={100} paddingHorizontal={5} />
    <Skeleton height={35} width="50%" paddingHorizontal={5} />
    <Skeleton height={100} paddingHorizontal={5} />
    <Skeleton height={100} paddingHorizontal={5} />
    <Skeleton height={100} paddingHorizontal={5} />
    <Skeleton height={100} paddingHorizontal={5} />
  </View>
);

export default HomeScreenSkeleton;
