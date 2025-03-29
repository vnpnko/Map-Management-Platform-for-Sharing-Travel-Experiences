import { useState } from "react";
import { BASE_URL } from "../App.tsx";

interface FollowPayload {
  followerId: number;
  followeeId: number;
}

const useFollow = () => {
  const [error, setError] = useState<string | null>(null);

  const follow = async (payload: FollowPayload) => {
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/follow`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Failed to follow user");
      }
      return data;
    } catch {
      setError("Network error");
    }
  };

  return { follow, error };
};

export default useFollow;
