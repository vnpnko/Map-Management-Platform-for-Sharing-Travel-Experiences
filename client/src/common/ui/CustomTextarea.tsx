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
      borderColor="blackAlpha.300"
      _hover={{ borderColor: "blackAlpha.300" }}
      _placeholder={{ color: "blackAlpha.500" }}
      {...rest}
    >
      {children}
    </Textarea>
  );
};

export default CustomTextarea;
