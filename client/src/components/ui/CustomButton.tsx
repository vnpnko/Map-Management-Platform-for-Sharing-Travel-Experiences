import React from "react";
import { Button, ButtonProps } from "@chakra-ui/react";

type CustomButtonProps = ButtonProps;

const CustomButton: React.FC<CustomButtonProps> = ({ children, ...rest }) => {
  return (
    <Button
      bg={"blue.500"}
      _hover={{ bg: "blue.600" }}
      fontSize="lg"
      color="white"
      type="submit"
      w={"full"}
      {...rest}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
