import React, { useState } from "react";
import CustomBox from "../components/ui/CustomBox.tsx";
import CustomInput from "../components/ui/CustomInput.tsx";
import CustomButton from "../components/ui/CustomButton.tsx";
import { Heading, Link as ChakraLink, Text, VStack } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

const LogInPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
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
        localStorage.setItem("user", JSON.stringify(data));
        navigate(`/${data.username}`);
      }
    } catch {
      setError("Network error");
    }
  };

  return (
    <VStack
      direction="column"
      align="center"
      justify="center"
      minH="100vh"
      bg="gray.50"
    >
      <CustomBox w={"sm"}>
        <Heading mb={8} color="black" size="lg">
          Welcome back!
        </Heading>

        <form onSubmit={handleLogin}>
          <VStack spacing={4}>
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
            {error && (
              <Text mt={8} color="red.500">
                {error}
              </Text>
            )}
          </VStack>
        </form>
      </CustomBox>

      <CustomBox w={"sm"} p={8}>
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
    </VStack>
  );
};

export default LogInPage;
