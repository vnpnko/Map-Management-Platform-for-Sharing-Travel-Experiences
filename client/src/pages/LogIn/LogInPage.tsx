import React, { useState } from "react";
import CustomInput from "../../common/ui/CustomInput.tsx";
import CustomButton from "../../common/ui/CustomButton.tsx";
import { Flex, Heading, Link, Text } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { loggedInUserStore } from "../../store/loggedInUserStore.ts";
import useLogIn from "./hooks/useLogIn.ts";
import ErrorMessage from "../../common/ui/ErrorMessage.tsx";

const LogInPage: React.FC = () => {
  // const [username, setUsername] = useState("");
  // const [password, setPassword] = useState("");
  // const LogInPayload = { username, password };
  //
  // const [error, setError] = useState<Error | null>(null);
  type LogInForm = { username: string; password: string };
  type LogInError = { type: string; message: string } | null;

  const [form, setForm] = useState<LogInForm>({
    username: "",
    password: "",
  });

  const [error, setError] = useState<LogInError>(null);

  const navigate = useNavigate();
  const { login, isLoggingIn } = useLogIn();
  const { setLoggedInUser } = loggedInUserStore();

  const handleLogIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.username.trim())
      return setError({ type: "username", message: "Username is required" });
    if (!form.password.trim())
      return setError({ type: "password", message: "Password is required" });

    try {
      const user = await login(form);
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
    <Flex direction="column" w={"sm"} gap={8} alignItems={"center"}>
      <Heading color="black" size="lg">
        Log in to Favmaps
      </Heading>

      <Flex
        as="form"
        onSubmit={handleLogIn}
        direction={"column"}
        w={"full"}
        gap={4}
      >
        <CustomInput
          name="Username"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          isDisabled={isLoggingIn}
          isError={error?.type === "username"}
        />

        <CustomInput
          name="Password"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          isDisabled={isLoggingIn}
          isError={error?.type === "password"}
        />

        <CustomButton
          type="submit"
          isSelected={isLoggingIn}
          isDisabled={isLoggingIn}
        >
          {isLoggingIn ? "Logging in..." : "Log In"}
        </CustomButton>
      </Flex>

      {error && <ErrorMessage error={error.message} />}

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
