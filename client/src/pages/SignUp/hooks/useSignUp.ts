import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "../../../App.tsx";
import { User } from "../../../models/User.ts";

interface SignUpPayload {
  name: string;
  username: string;
  password: string;
}

type SignUpResponse = User;

const useSignUpRequest = async (
  payload: SignUpPayload,
): Promise<SignUpResponse> => {
  const response = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to sign up");
  }
  return data;
};

const useSignUp = () => {
  const { mutateAsync, isPending, error } = useMutation<
    SignUpResponse,
    Error,
    SignUpPayload
  >({
    mutationFn: useSignUpRequest,
  });

  return {
    signup: mutateAsync,
    isSigningUp: isPending,
    signUpError: error,
  };
};

export default useSignUp;
