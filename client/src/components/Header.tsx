import { Flex, Text } from "@chakra-ui/react";
import CustomButton from "./ui/CustomButton.tsx";

export function Header() {
  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      boxShadow="md"
      px={4}
    >
      <Text fontSize="xl" fontWeight="medium" color="black">
        Map Management Platform for Sharing Travel Experiences
      </Text>

      <Flex gap={4} my={2}>
        <CustomButton isDisabled>Home</CustomButton>
        <CustomButton isDisabled>Create</CustomButton>
        <CustomButton>Search</CustomButton>
      </Flex>
    </Flex>
  );
}
