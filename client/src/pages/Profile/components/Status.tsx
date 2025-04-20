import React from "react";
import { Text } from "@chakra-ui/react";

interface StatusProps {
  name: string;
  value: string | number;
  isSelected?: boolean;
}

const Status: React.FC<StatusProps> = ({ value, name, isSelected }) => {
  return (
    <Text fontSize="md">
      <Text
        as="span"
        color={isSelected ? "black" : "white"}
        fontWeight="medium"
      >
        {value}
      </Text>{" "}
      <Text
        as="span"
        color={isSelected ? "black" : "white"}
        fontWeight="normal"
      >
        {name}
      </Text>
    </Text>
  );
};

export default Status;
