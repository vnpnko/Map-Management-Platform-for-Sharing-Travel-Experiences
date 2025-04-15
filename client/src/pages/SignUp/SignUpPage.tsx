import React, { useState } from "react";
import { Flex, Heading, Link as ChakraLink, Text } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import CustomBox from "../../common/components/ui/CustomBox.tsx";
import CustomButton from "../../common/components/ui/CustomButton.tsx";
import CustomInput from "../../common/components/ui/CustomInput.tsx";
import useSignUp from "./hooks/useSignUp.ts";
import { useUserStore } from "../../store/useUserStore.ts";

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const SignUpPayload = { email, name, username, password };

  const [error, setError] = useState<Error | null>(null);

  const navigate = useNavigate();

  const { signup, isSigningUp } = useSignUp();
  const { setUser } = useUserStore();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await signup(SignUpPayload);
      setUser(user);
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
          Join us!
        </Heading>

        <Flex as={"form"} onSubmit={handleSignup} direction={"column"} gap={4}>
          <CustomInput
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            isDisabled={isSigningUp}
          />

          <CustomInput
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            isDisabled={isSigningUp}
          />

          <CustomInput
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isDisabled={isSigningUp}
          />

          <CustomInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isDisabled={isSigningUp}
          />

          <CustomButton
            type="submit"
            isSelected={isSigningUp}
            isDisabled={isSigningUp}
          >
            {isSigningUp ? "Signing up..." : "Sign up"}
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
          Have an account?{" "}
          <ChakraLink
            as={RouterLink}
            to="/"
            color="blue.500"
            fontWeight={"bold"}
          >
            Log in
          </ChakraLink>
        </Text>
      </CustomBox>
    </Flex>
  );
};

export default SignUpPage;
