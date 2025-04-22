import { Flex, Heading, Link as ChakraLink, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import SignUpForm from "./components/SignUpForm";

const SignUpPage: React.FC = () => {
  return (
    <Flex direction="column" w="sm" gap={8} alignItems="center">
      <Heading color="black" size="lg">
        Sign up
      </Heading>

      <SignUpForm />

      <Text fontSize="md" color="black">
        {"Have an account? "}
        <ChakraLink as={RouterLink} to="/" color="blue.500" fontWeight="bold">
          Log in
        </ChakraLink>
      </Text>
    </Flex>
  );
};

export default SignUpPage;
