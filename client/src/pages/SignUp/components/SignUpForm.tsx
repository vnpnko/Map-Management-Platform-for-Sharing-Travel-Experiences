import React, { useState } from "react";
import { Flex } from "@chakra-ui/react";
import CustomInput from "../../../common/ui/CustomInput";
import CustomButton from "../../../common/ui/CustomButton";
import ErrorMessage from "../../../common/ui/ErrorMessage";
import useSignUp from "../hooks/useSignUp";
import { loggedInUserStore } from "../../../store/loggedInUserStore";
import { useNavigate } from "react-router-dom";

type FormState = { name: string; username: string; password: string };

type FieldError = { type: string; message: string } | null;

const SignUpForm: React.FC = () => {
  const [form, setForm] = useState<FormState>({
    name: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState<FieldError>(null);

  const navigate = useNavigate();
  const { signup, isSigningUp } = useSignUp();
  const { setLoggedInUser } = loggedInUserStore();

  const handleSubmit = async (e: React.FormEvent) => {
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
      const apiError = err as { type: string; error: string };
      setError({ type: apiError.type, message: apiError.error });
    }
  };

  return (
    <Flex
      as="form"
      onSubmit={handleSubmit}
      direction="column"
      alignItems="center"
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
        w="full"
      >
        {isSigningUp ? "Signing up…" : "Sign Up"}
      </CustomButton>

      {error && <ErrorMessage error={error.message} />}
    </Flex>
  );
};

export default SignUpForm;
