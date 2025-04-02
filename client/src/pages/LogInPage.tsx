import React, { useState } from "react";
import CustomBox from "../components/ui/CustomBox.tsx";
import CustomInput from "../components/ui/CustomInput.tsx";
import CustomButton from "../components/ui/CustomButton.tsx";
import { Flex, Heading, Link, Text } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import useLogIn from "../hooks/useLogIn.ts";

const LogInPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const LogInPayload = { email, password };

  const [error, setError] = useState<Error | null>(null);

  const navigate = useNavigate();

  const { login, isLoggingIn } = useLogIn();
  const { setLoggedInUser } = useUser();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await login(LogInPayload);
      setLoggedInUser(user);
      navigate(`/${user.username}`);
    } catch (error) {
      console.error("Login failed:", error);
      setError(error as Error);
    }
  };

  return (
    <Flex direction="column">
      <CustomBox p={8} w={"sm"}>
        <Heading mb={8} color="black" size="lg">
          Welcome back!
        </Heading>

        <Flex as="form" onSubmit={handleLogin} direction={"column"} gap={4}>
          <CustomInput
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isDisabled={isLoggingIn}
          />

          <CustomInput
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
            {isLoggingIn ? "Logging in..." : "Log in"}
          </CustomButton>
        </Flex>

        {error && (
          <Text mt={4} color="red.500">
            {error.message}
          </Text>
        )}
      </CustomBox>

      <CustomBox p={8} w={"sm"}>
        <Text fontSize="md" color="black">
          Don&apos;t have an account?{" "}
          <Link
            as={RouterLink}
            to="/signup"
            color="blue.500"
            fontWeight={"bold"}
          >
            Sign up
          </Link>
        </Text>
      </CustomBox>
    </Flex>
  );
};

export default LogInPage;
