import { Flex, Heading, Link, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import LoginForm from "./components/LogInForm";

const LogInPage: React.FC = () => {
  return (
    <Flex direction="column" w="sm" gap={8} alignItems="center">
      <Heading color="black" size="lg">
        Log in
      </Heading>

      <LoginForm />

      <Text fontSize="md" color="black">
        {"Don't have an account? "}
        <Link as={RouterLink} to="/signup" color="blue.500" fontWeight="bold">
          Sign up
        </Link>
      </Text>
    </Flex>
  );
};

export default LogInPage;
