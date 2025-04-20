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
        borderColor="blackAlpha.300"
        _hover={{ borderColor: "blackAlpha.300" }}
        _placeholder={{ color: "blackAlpha.500" }}
        {...rest}
      >
        {children}
      </Input>
    </FormControl>
  );
};

export default CustomInput;
