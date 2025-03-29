import { useState } from "react";
import { BASE_URL } from "../App.tsx";

const useLogin = () => {
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
      } else {
        localStorage.setItem("user", JSON.stringify(data));
        return data;
      }
    } catch {
      setError("Network error");
    }
  };

  return { login, error };
};

export default useLogin;
