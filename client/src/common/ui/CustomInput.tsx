import React from "react";
import { FormControl, FormLabel, Input, InputProps } from "@chakra-ui/react";

interface CustomInputProps extends InputProps {
  name?: string;
  isError?: boolean;
  error?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({
  name,
  isError,
  children,
  ...rest
}) => {
  return (
    <FormControl isInvalid={isError}>
      {name && <FormLabel color="black">{name}</FormLabel>}
      <Input
        color={"black"}
        borderColor="blackAlpha.400"
        _hover={{ borderColor: "blackAlpha.400" }}
        _placeholder={{ color: "blackAlpha.600" }}
        {...rest}
      >
        {children}
      </Input>
    </FormControl>
  );
};

export default CustomInput;
