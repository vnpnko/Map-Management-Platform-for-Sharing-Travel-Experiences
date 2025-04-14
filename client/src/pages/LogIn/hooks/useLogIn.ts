import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "../../../App.tsx";
import { User } from "../../../models/User.ts";

interface LogInPayload {
  email: string;
  password: string;
}

type LogInResponse = User;

const useLogInRequest = async (
  payload: LogInPayload,
): Promise<LogInResponse> => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to log in");
  }
  return data;
};

const useLogIn = () => {
  const { mutateAsync, isPending, error } = useMutation<
    LogInResponse,
    Error,
    LogInPayload
  >({
    mutationFn: useLogInRequest,
  });

  return {
    login: mutateAsync,
    isLoggingIn: isPending,
    loginError: error,
  };
};

export default useLogIn;
