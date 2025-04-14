import React from "react";
import { Box, BoxProps } from "@chakra-ui/react";

type IconBoxProps = BoxProps;

const IconBox: React.FC<IconBoxProps> = ({ children, ...rest }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
      w={10}
      h={10}
      {...rest}
    >
      {children}
    </Box>
  );
};

export default IconBox;
