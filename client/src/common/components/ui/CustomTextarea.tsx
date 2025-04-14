import React from "react";
import { Textarea, TextareaProps } from "@chakra-ui/react";

type CustomTextareaProps = TextareaProps;

const CustomTextarea: React.FC<CustomTextareaProps> = ({
  children,
  ...rest
}) => {
  return (
    <Textarea
      color={"black"}
      borderColor="gray.400"
      _hover={{ borderColor: "blue.400" }}
      _focus={{ borderColor: "blue.500" }}
      _placeholder={{ color: "gray.500" }}
      {...rest}
    >
      {children}
    </Textarea>
  );
};

export default CustomTextarea;
