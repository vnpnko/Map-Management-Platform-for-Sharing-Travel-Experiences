import React from "react";
import { FormControl, FormLabel, Input, InputProps } from "@chakra-ui/react";

interface CustomInputProps extends InputProps {
  name?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({
  name,
  children,
  ...rest
}) => {
  return (
    <FormControl>
      {name && <FormLabel color="black">{name}</FormLabel>}
      <Input
        color={"black"}
        borderColor="gray.400"
        _hover={{ borderColor: "blue.400" }}
        _focus={{ borderColor: "blue.500" }}
        _placeholder={{ color: "gray.500" }}
        {...rest}
      >
        {children}
      </Input>
    </FormControl>
  );
};

export default CustomInput;
