import React, { useState } from "react";
import CustomBox from "../components/ui/CustomBox.tsx";
import CustomInput from "../components/ui/CustomInput.tsx";
import CustomButton from "../components/ui/CustomButton.tsx";
import { Flex, Heading, Link as ChakraLink, Text } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const LogInPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { handleLogin } = useUser();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const payload = { email, password };
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Login failed");
      } else {
        handleLogin(data);
        navigate(`/${data.username}`);
      }
    } catch {
      setError("Network error");
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
          Welcome back!
        </Heading>

        <Flex
          as="form"
          onSubmit={handleLoginSubmit}
          direction={"column"}
          gap={4}
        >
          <CustomInput
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <CustomInput
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <CustomButton>Log in</CustomButton>
        </Flex>

        {error && (
          <Text mt={4} color="red.500">
            {error}
          </Text>
        )}
      </CustomBox>

      <CustomBox p={8} w={"sm"}>
        <Text fontSize="md" color="black">
          Don&apos;t have an account?{" "}
          <ChakraLink
            as={RouterLink}
            to="/signup"
            color="blue.500"
            fontWeight={"bold"}
          >
            Sign up
          </ChakraLink>
        </Text>
      </CustomBox>
    </Flex>
  );
};

export default LogInPage;
