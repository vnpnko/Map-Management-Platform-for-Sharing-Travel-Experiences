import React from "react";
import { Box, BoxProps } from "@chakra-ui/react";

type CustomBoxProps = BoxProps;

const CustomBox: React.FC<CustomBoxProps> = ({ children, ...rest }) => {
  return (
    <Box
      border="2px"
      borderColor="gray.200"
      borderRadius="md"
      boxShadow={"md"}
      textAlign="center"
      {...rest}
    >
      {children}
    </Box>
  );
};

export default CustomBox;
