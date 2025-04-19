import React, { useState } from "react";
import { Flex, Heading, Link, Text } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import CustomButton from "../../common/components/ui/CustomButton.tsx";
import CustomInput from "../../common/components/ui/CustomInput.tsx";
import useSignUp from "./hooks/useSignUp.ts";
import { useLoggedInUserStore } from "../../store/useLoggedInUserStore.ts";

const SignUpPage: React.FC = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const SignUpPayload = { name, username, password };

  const [error, setError] = useState<Error | null>(null);

  const navigate = useNavigate();

  const { signup, isSigningUp } = useSignUp();
  const { setLoggedInUser } = useLoggedInUserStore();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await signup(SignUpPayload);
      setLoggedInUser(user);
      navigate(`/${user.username}`);
    } catch (error) {
      setError(error as Error);
    }
  };

  return (
    <Flex direction="column" w={"sm"} gap={8} alignItems={"center"}>
      <Heading color="black" size="lg">
        Sign up to Favmaps
      </Heading>

      <Flex
        as={"form"}
        onSubmit={handleSignup}
        direction={"column"}
        w={"full"}
        gap={4}
      >
        <CustomInput
          name="Full name"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          isDisabled={isSigningUp}
        />
        <CustomInput
          name="Username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          isDisabled={isSigningUp}
        />
        <CustomInput
          name="Password"
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
          {isSigningUp ? "Signing up..." : "Sign Up"}
        </CustomButton>
      </Flex>

      {error && <Text color="red.500">{error.message}</Text>}

      <Text fontSize="md" color="black">
        {"Have an account? "}
        <Link as={RouterLink} to="/" color="blue.500" fontWeight={"bold"}>
          Log in
        </Link>
      </Text>
    </Flex>
  );
};

export default SignUpPage;
