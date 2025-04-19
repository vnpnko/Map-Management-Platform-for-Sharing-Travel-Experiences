import React from "react";
import { Button, ButtonProps } from "@chakra-ui/react";

interface CustomButtonProps extends ButtonProps {
  isSelected?: boolean;
  children?: React.ReactNode;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  isSelected,
  children,
  ...props
}) => {
  return (
    <Button
      _hover={{
        bg: isSelected ? "blackAlpha.400" : "blue.600",
      }}
      textColor={isSelected ? "black" : "white"}
      bg={isSelected ? "blackAlpha.300" : "blue.500"}
      borderWidth={2}
      borderColor="blackAlpha.300"
      {...props}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
