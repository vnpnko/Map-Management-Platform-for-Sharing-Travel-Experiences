import React from "react";
import { Flex, Text, Divider, DividerProps } from "@chakra-ui/react";

interface CustomDividerProps extends DividerProps {
  text: string;
}

const CustomDivider: React.FC<CustomDividerProps> = ({ text, ...rest }) => {
  return (
    <Flex align="center" {...rest}>
      <Divider borderColor={"blackAlpha.300"} borderWidth={2} />
      <Text
        px={2}
        color={"blackAlpha.500"}
        fontWeight="medium"
        whiteSpace="nowrap"
      >
        {text}
      </Text>
      <Divider borderColor={"blackAlpha.300"} borderWidth={2} />
    </Flex>
  );
};

export default CustomDivider;
