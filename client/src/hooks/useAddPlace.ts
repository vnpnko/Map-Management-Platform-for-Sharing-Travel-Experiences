import { useState } from "react";
import { BASE_URL } from "../App";

interface AddPlacePayload {
  placeId: string;
  userId: number;
}

const useAddPlace = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const addPlace = async (payload: AddPlacePayload) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/users/addPlace`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Failed to add place");
      }
      return data;
    } catch {
      setError("Network error");
    } finally {
      setIsLoading(false);
    }
  };

  return { addPlace, isLoading, error };
};

export default useAddPlace;
