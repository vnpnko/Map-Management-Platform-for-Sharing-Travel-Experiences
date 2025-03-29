import { useState } from "react";

const useLogOut = () => {
  const [error, setError] = useState<string | null>(null);

  const logout = async () => {
    setError(null);
    try {
      localStorage.removeItem("user");
    } catch {
      setError("Network error");
    }
  };

  return { logout, error };
};

export default useLogOut;
