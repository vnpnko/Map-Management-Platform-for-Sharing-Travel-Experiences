import React, { useState } from "react";
import CustomInput from "../../common/ui/CustomInput.tsx";
import CustomButton from "../../common/ui/CustomButton.tsx";
import { Flex, Heading, Link, Text } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { loggedInUserStore } from "../../store/loggedInUserStore.ts";
import useLogIn from "./hooks/useLogIn.ts";

const LogInPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const LogInPayload = { username, password };

  const [error, setError] = useState<Error | null>(null);

  const navigate = useNavigate();

  const { login, isLoggingIn } = useLogIn();
  const { setLoggedInUser } = loggedInUserStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await login(LogInPayload);
      setLoggedInUser(user);
      navigate(`/${user.username}`);
    } catch (error) {
      setError(error as Error);
    }
  };

  return (
    <Flex direction="column" w={"sm"} gap={8} alignItems={"center"}>
      <Heading color="black" size="lg">
        Log in to Favmaps
      </Heading>

      <Flex
        as="form"
        onSubmit={handleLogin}
        direction={"column"}
        w={"full"}
        gap={4}
      >
        <CustomInput
          name="Username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          isDisabled={isLoggingIn}
        />

        <CustomInput
          name="Password"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          isDisabled={isLoggingIn}
        />

        <CustomButton
          type="submit"
          isSelected={isLoggingIn}
          isDisabled={isLoggingIn}
        >
          {isLoggingIn ? "Logging in..." : "Log In"}
        </CustomButton>
      </Flex>

      {error && <Text color="red.500">{error.message}</Text>}

      <Text fontSize="md" color="black">
        {"Don't have an account? "}
        <Link as={RouterLink} to="/signup" color="blue.500" fontWeight={"bold"}>
          Sign up
        </Link>
      </Text>
    </Flex>
  );
};

export default LogInPage;
