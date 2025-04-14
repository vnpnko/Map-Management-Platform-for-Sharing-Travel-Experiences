import React from "react";
import { Box, BoxProps } from "@chakra-ui/react";

type CustomBoxProps = BoxProps;

const CustomBox: React.FC<CustomBoxProps> = ({ children, ...rest }) => {
  return (
    <Box
      borderBottomWidth="2px"
      borderBottomColor={"gray.200"}
      textAlign="center"
      {...rest}
    >
      {children}
    </Box>
  );
};

export default CustomBox;
