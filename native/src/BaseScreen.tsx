import { Box, VStack, View } from "@gluestack-ui/themed";
import React from "react";
import { ViewProps } from "react-native";
import { screenBackgroundLight } from "../colors";
import HelpActionsheet from "./HelpActionsheet";
import Menu from "./Menu";

interface Props extends ViewProps {
  children: React.ReactNode;
  withMenu?: boolean;
}

const BaseScreen = ({ children, ...rest }: Props) => {
  const [showActionsheet, setShowActionsheet] = React.useState(false);
  const handleClose = () => setShowActionsheet(!showActionsheet);
  return (
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
      {...rest}
    >
      {rest.withMenu && (
        <>
          <VStack marginTop={35}>
            <Menu handleClose={handleClose} />
            <Box marginTop={-10}>{children}</Box>
          </VStack>
          <HelpActionsheet
            handleClose={handleClose}
            showActionsheet={showActionsheet}
          />
        </>
      )}
      {!rest.withMenu && <>{children}</>}
    </View>
  );
};

export default BaseScreen;
