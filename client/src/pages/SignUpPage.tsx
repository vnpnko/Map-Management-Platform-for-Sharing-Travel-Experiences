import React, { useState } from "react";
import { Flex, Heading, Link as ChakraLink, Text } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import CustomBox from "../components/ui/CustomBox.tsx";
import CustomButton from "../components/ui/CustomButton.tsx";
import CustomInput from "../components/ui/CustomInput.tsx";
import useSignUp from "../hooks/useSignUp.ts";
import { useUser } from "../context/UserContext.tsx";

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const payload = { email, name, username, password };
  const { signup, error } = useSignUp(payload);
  const { setLoggedInUser } = useUser();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const userData = await signup();
    if (userData) {
      setLoggedInUser(userData);
      navigate(`/${userData.username}`);
    }
  };

  return (
    <Flex
      minH="100vh"
      bg="gray.50"
      direction="column"
      align="center"
      justify="center"
      gap={2}
      py={10}
    >
      <CustomBox p={8} w={"sm"}>
        <Heading mb={8} color="black" size="lg">
          Join us!
        </Heading>

        <Flex as={"form"} onSubmit={handleSignup} direction={"column"} gap={4}>
          <CustomInput
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <CustomInput
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <CustomInput
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <CustomInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <CustomButton>Sign up</CustomButton>
        </Flex>

        {error && (
          <Text mt={4} color="red.500">
            {error}
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
