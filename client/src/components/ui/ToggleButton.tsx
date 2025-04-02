import React from "react";
import { Button } from "@chakra-ui/react";

interface ToggleButtonProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  label,
  isSelected,
  onClick,
}) => {
  return (
    <Button
      onClick={onClick}
      _hover={{ bg: isSelected ? "" : "blue.600" }}
      textColor={isSelected ? "blue.500" : "white"}
      bg={isSelected ? "gray.50" : "blue.500"}
      borderColor={isSelected ? "blue.500" : ""}
      borderWidth={2}
      w={"full"}
    >
      {label}
    </Button>
  );
};

export default ToggleButton;
