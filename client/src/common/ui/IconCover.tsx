import React from "react";
import { Box, BoxProps } from "@chakra-ui/react";

interface IconCoverProps extends BoxProps {
  children: React.ReactNode;
}

const IconCover: React.FC<IconCoverProps> = ({ children, ...rest }) => {
  return (
    <Box
      borderRadius="md"
      cursor="pointer"
      _hover={{ bg: "blackAlpha.200" }}
      {...rest}
    >
      {children}
    </Box>
  );
};

export default IconCover;
