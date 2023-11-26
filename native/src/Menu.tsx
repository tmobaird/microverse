import { AlertCircleIcon, Box, Button, ButtonIcon } from "@gluestack-ui/themed";
import React from "react";

const Menu = ({ handleClose }: { handleClose: () => void }) => (
  <Box width="$5" marginRight={20} alignSelf="flex-end">
    <Button variant="link" size="lg" rounded="$full" onPress={handleClose}>
      <ButtonIcon
        as={AlertCircleIcon}
        size="xl"
        color="$white"
        sx={{
          _dark: {
            color: "$white",
          },
          _light: {
            color: "$black",
          },
        }}
      />
    </Button>
  </Box>
);

export default Menu;
