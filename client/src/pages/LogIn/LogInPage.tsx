import { Flex, Heading, Link as ChakraLink, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import LoginForm from "./components/LogInForm";

const LogInPage: React.FC = () => {
  return (
    <Flex direction="column" w="sm" gap={8} alignItems="center">
      <Heading color="black" size="lg">
        Log in to Favmaps
      </Heading>

      <LoginForm />

      <Text fontSize="md" color="black">
        {"Don't have an account? "}
        <ChakraLink
          as={RouterLink}
          to="/signup"
          color="blue.500"
          fontWeight="bold"
        >
          Sign up
        </ChakraLink>
      </Text>
    </Flex>
  );
};

export default LogInPage;
