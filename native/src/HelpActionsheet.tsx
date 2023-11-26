import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
  Heading,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import React from "react";
import { UserContext } from "./UserProvider";

const HelpActionsheet = ({
  showActionsheet,
  handleClose,
}: {
  showActionsheet: boolean;
  handleClose: () => void;
}) => {
  const { uuid } = React.useContext(UserContext);
  return (
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
                If you have an idea for a feature that you would like to see in
                the app, please send an email to the address above.
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
  );
};

export default HelpActionsheet;
