import React from "react";
import { Box, BoxProps } from "@chakra-ui/react";

type CustomBoxProps = BoxProps;

const CustomBox: React.FC<CustomBoxProps> = ({ children, ...rest }) => {
  return (
    <Box
      bg="gray.50"
      border="2px"
      borderRadius="md"
      borderColor="gray.200"
      boxShadow={"md"}
      textAlign="center"
      {...rest}
    >
      {children}
    </Box>
  );
};

export default CustomBox;
