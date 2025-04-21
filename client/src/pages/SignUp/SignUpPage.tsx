import React, { useState } from "react";
import { Flex, Heading, Link as ChakraLink, Text } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import CustomInput from "../../common/ui/CustomInput";
import CustomButton from "../../common/ui/CustomButton";
import ErrorMessage from "../../common/ui/ErrorMessage";
import useSignUp from "./hooks/useSignUp";
import { loggedInUserStore } from "../../store/loggedInUserStore";

const SignUpPage: React.FC = () => {
  type SingUpForm = { name: string; username: string; password: string };
  type SingUpError = { type: string; message: string } | null;

  const [form, setForm] = useState<SingUpForm>({
    name: "",
    username: "",
    password: "",
  });

  const [error, setError] = useState<SingUpError>(null);

  const navigate = useNavigate();
  const { signup, isSigningUp } = useSignUp();
  const { setLoggedInUser } = loggedInUserStore();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim())
      return setError({ type: "name", message: "Full name is required" });
    if (!form.username.trim())
      return setError({ type: "username", message: "Username is required" });
    if (!form.password.trim())
      return setError({ type: "password", message: "Password is required" });
    if (form.password.length < 6)
      return setError({
        type: "password",
        message: "Password must be at least 6 characters",
      });

    try {
      const user = await signup(form);
      setLoggedInUser(user);
      navigate(`/${user.username}`);
    } catch (err) {
      const apiErr = err as { type: string; error: string };
      setError({
        type: apiErr.type,
        message: apiErr.error,
      });
    }
  };

  return (
    <Flex direction="column" w="sm" gap={8} alignItems="center">
      <Heading color="black" size="lg">
        Sign up to Favmaps
      </Heading>

      <Flex
        as="form"
        onSubmit={handleSignUp}
        direction="column"
        w="full"
        gap={4}
      >
        <CustomInput
          name="Full name"
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          isDisabled={isSigningUp}
          isError={error?.type === "name"}
        />

        <CustomInput
          name="Username"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          isDisabled={isSigningUp}
          isError={error?.type === "username"}
        />

        <CustomInput
          name="Password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          isDisabled={isSigningUp}
          isError={error?.type === "password"}
        />

        <CustomButton
          type="submit"
          isSelected={isSigningUp}
          isDisabled={isSigningUp}
        >
          {isSigningUp ? "Signing up..." : "Sign Up"}
        </CustomButton>
      </Flex>

      {error && <ErrorMessage error={error.message} />}

      <Text fontSize="md" color="black">
        Have an account?{" "}
        <ChakraLink as={RouterLink} to="/" color="blue.500" fontWeight="bold">
          Log in
        </ChakraLink>
      </Text>
    </Flex>
  );
};

export default SignUpPage;
