import React from "react";
import { Button, ButtonProps } from "@chakra-ui/react";

interface ToggleButtonProps extends ButtonProps {
  isSelected?: boolean;
  children?: React.ReactNode;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  isSelected,
  children,
  ...props
}) => {
  return (
    <Button
      textColor={isSelected ? "blue.500" : "white"}
      _hover={{ bg: isSelected ? "transparent" : "blue.600" }}
      bg={isSelected ? "transparent" : "blue.500"}
      borderWidth={2}
      borderColor={"blue.500"}
      w={"full"}
      {...props}
    >
      {children}
    </Button>
  );
};

export default ToggleButton;
