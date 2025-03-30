import { useState } from "react";

const useLogOut = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const logout = async () => {
    setError(null);
    setIsLoading(true);

    try {
      localStorage.removeItem("user");
    } catch {
      setError("Network error");
    } finally {
      setIsLoading(false);
    }
  };

  return { logout, isLoading, error };
};

export default useLogOut;
