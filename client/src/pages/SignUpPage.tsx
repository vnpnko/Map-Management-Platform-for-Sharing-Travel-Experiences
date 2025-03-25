import React, { useState } from "react";
import { Heading, Link as ChakraLink, Text, VStack } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import CustomBox from "../components/ui/CustomBox.tsx";
import CustomButton from "../components/ui/CustomButton.tsx";
import CustomInput from "../components/ui/CustomInput.tsx";

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const payload = { email, name, username, password };
    try {
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Signup failed");
      } else {
        setSuccess(true);
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
          Join us!
        </Heading>
        <form onSubmit={handleSignUp}>
          <VStack spacing={4}>
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
            {error && <Text color="red.500">{error}</Text>}
            {success && <Text color="green.500">Signup successful!</Text>}
          </VStack>
        </form>
      </CustomBox>
      <CustomBox w={"sm"}>
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
    </VStack>
  );
};

export default SignUpPage;
