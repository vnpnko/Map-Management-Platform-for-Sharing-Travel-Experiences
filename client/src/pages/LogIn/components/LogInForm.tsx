import React, { useState } from "react";
import { Flex } from "@chakra-ui/react";
import CustomInput from "../../../common/ui/CustomInput";
import CustomButton from "../../../common/ui/CustomButton";
import ErrorMessage from "../../../common/ui/ErrorMessage";
import useLogIn from "../hooks/useLogIn";
import { loggedInUserStore } from "../../../store/loggedInUserStore";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../../../common/ui/PasswordInput.tsx";

type FormState = { username: string; password: string };
type FieldError = { type: string; message: string } | null;

const LoginForm: React.FC = () => {
  const [form, setForm] = useState<FormState>({ username: "", password: "" });
  const [error, setError] = useState<FieldError>(null);

  const navigate = useNavigate();
  const { login, isLoggingIn } = useLogIn();
  const { setLoggedInUser } = loggedInUserStore();

  const handleSubmit = async (e: React.FormEvent) => {
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
      const apiError = err as { type: string; error: string };
      setError({ type: apiError.type, message: apiError.error });
    }
  };

  return (
    <Flex
      as="form"
      onSubmit={handleSubmit}
      direction="column"
      alignItems={"center"}
      w="full"
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

      <PasswordInput
        name="Password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        isDisabled={isLoggingIn}
        isError={error?.type === "password"}
      />

      <CustomButton
        type="submit"
        isSelected={isLoggingIn}
        isLoading={isLoggingIn}
        w="full"
      >
        {isLoggingIn ? "Logging in…" : "Log In"}
      </CustomButton>

      {error && <ErrorMessage error={error.message} />}
    </Flex>
  );
};

export default LoginForm;
