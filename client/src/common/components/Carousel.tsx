import React from "react";
import { Flex, IconButton, Box, FlexProps, Text } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

interface CarouselProps extends FlexProps {
  children: React.ReactNode[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

const Carousel: React.FC<CarouselProps> = ({
  children,
  currentIndex,
  onIndexChange,
  ...rest
}) => {
  const total = children.length;

  const handlePrev = () => {
    onIndexChange(currentIndex === 0 ? total - 1 : currentIndex - 1);
  };

  const handleNext = () => {
    onIndexChange(currentIndex === total - 1 ? 0 : currentIndex + 1);
  };

  return (
    <Flex direction="column" {...rest}>
      <Box width="100%" textAlign="center">
        {children[currentIndex]}
      </Box>
      <Flex alignItems="center" justifyContent="center" gap={4} mt={-9}>
        <IconButton
          colorScheme={"blackAlpha"}
          aria-label="Previous"
          icon={<ChevronLeftIcon />}
          onClick={handlePrev}
          height={"30px"}
        />
        <Text fontSize="sm" color="blackAlpha.700">
          {currentIndex + 1} / {total}
        </Text>
        <IconButton
          colorScheme={"blackAlpha"}
          aria-label="Next"
          icon={<ChevronRightIcon />}
          onClick={handleNext}
          height={"30px"}
        />
      </Flex>
    </Flex>
  );
};

export default Carousel;
