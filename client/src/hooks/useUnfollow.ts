import { useState } from "react";
import { BASE_URL } from "../App.tsx";

interface UnfollowPayload {
  followerId: number;
  followeeId: number;
}

const useUnfollow = () => {
  const [error, setError] = useState<string | null>(null);

  const unfollow = async (payload: UnfollowPayload) => {
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/unfollow`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Failed to unfollow user");
      }
      return data;
    } catch {
      setError("Network error");
    }
  };

  return { unfollow, error };
};

export default useUnfollow;
