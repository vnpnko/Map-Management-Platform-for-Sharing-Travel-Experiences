import { useState } from "react";
import { BASE_URL } from "../App.tsx";

interface SignUpPayload {
  email: string;
  name: string;
  username: string;
  password: string;
}

const useSignUp = (payload: SignUpPayload) => {
  const [error, setError] = useState<string | null>(null);

  const signup = async () => {
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Signup failed");
      } else {
        localStorage.setItem("user", JSON.stringify(data));
        return data;
      }
    } catch {
      setError("Network error");
    }
  };

  return { signup, error };
};

export default useSignUp;
