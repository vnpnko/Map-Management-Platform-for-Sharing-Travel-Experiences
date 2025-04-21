import React from "react";
import { Textarea, TextareaProps } from "@chakra-ui/react";

interface CustomTextareaProps extends TextareaProps {
  isError?: boolean;
}

const CustomTextarea: React.FC<CustomTextareaProps> = ({
  isError,
  children,
  ...rest
}) => {
  return (
    <Textarea
      color={"black"}
      borderWidth={2}
      borderColor={isError ? "red.400" : "blackAlpha.300"}
      _hover={{ borderColor: isError ? "red.400" : "blackAlpha.300" }}
      _placeholder={{ color: "blackAlpha.500" }}
      {...rest}
    >
      {children}
    </Textarea>
  );
};

export default CustomTextarea;
