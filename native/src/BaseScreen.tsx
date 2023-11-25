import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
  AlertCircleIcon,
  Box,
  Button,
  ButtonIcon,
  Heading,
  Text,
  VStack,
  View,
} from "@gluestack-ui/themed";
import React from "react";
import { screenBackgroundLight } from "../colors";
import { UserContext } from "./UserProvider";

const BaseScreen = ({ children }: { children: React.ReactNode }) => {
  const { uuid } = React.useContext(UserContext);
  const [showActionsheet, setShowActionsheet] = React.useState(false);
  const handleClose = () => setShowActionsheet(!showActionsheet);
  return (
    <View
      paddingHorizontal={10}
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
      <VStack marginTop={40}>
        <Box width="$5" marginRight={20} alignSelf="flex-end">
          <Button
            variant="link"
            size="lg"
            rounded="$full"
            onPress={handleClose}
          >
            <ButtonIcon as={AlertCircleIcon} size="xl" color="$white" />
          </Button>
        </Box>
        <Box marginTop={-5}>{children}</Box>
      </VStack>
      <Actionsheet isOpen={showActionsheet} onClose={handleClose} zIndex={999}>
        <ActionsheetBackdrop />
        <ActionsheetContent h="$3/5" zIndex={999}>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <ActionsheetItem disabled>
            <ActionsheetItemText>
              <VStack>
                <Heading>Reporting an issue</Heading>
                <Text>
                  - To Report an issue with the app, please email{" "}
                  <Text fontWeight="$bold">tmobaird@gmail.com</Text>.
                </Text>
                <Text>
                  - Make sure to include a description of the issue you are
                  seeing, an optional screenshot or video, and your device ID.
                </Text>
              </VStack>
            </ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem disabled>
            <ActionsheetItemText>
              <VStack>
                <Heading>Feature ideas</Heading>
                <Text>
                  If you have an idea for a feature that you would like to see
                  in the app, please send an email to the address above.
                </Text>
              </VStack>
            </ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem disabled>
            <ActionsheetItemText>
              <VStack>
                <Heading>Device Id</Heading>
                <Text>{uuid}</Text>
              </VStack>
            </ActionsheetItemText>
          </ActionsheetItem>
        </ActionsheetContent>
      </Actionsheet>
    </View>
  );
};

export default BaseScreen;
