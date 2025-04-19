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
      _hover={{ bg: isSelected ? "" : "blue.600" }}
      bg={isSelected ? "gray.50" : "blue.500"}
      borderColor={isSelected ? "blue.500" : ""}
      borderWidth={2}
      w={"full"}
      {...props}
    >
      {children}
    </Button>
  );
};

export default ToggleButton;
