import React from "react";
import { Text } from "@chakra-ui/react";

interface StatusProps {
  value: string | number;
  name: string;
}

const Status: React.FC<StatusProps> = ({ value, name }) => {
  return (
    <Text fontSize="md">
      <Text as="span" color="black" fontWeight="medium">
        {value}
      </Text>{" "}
      <Text as="span" color="blackAlpha.600" fontWeight="normal">
        {name}
      </Text>
    </Text>
  );
};

export default Status;
