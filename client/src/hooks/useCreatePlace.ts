import { BASE_URL } from "../App";
import { useUser } from "../context/UserContext";

import { useState } from "react";

const useCreatePlace = () => {
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { loggedInUser } = useUser();

  const createPlace = async (
    placeID: string,
    placeName: string,
    placeURL: string,
  ) => {
    setError(null);
    setIsCreating(true);
    try {
      const response = await fetch(`${BASE_URL}/createPlace`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: placeID,
          name: placeName,
          url: placeURL,
          likes: [loggedInUser!._id],
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Failed to create place");
      }
      return data;
    } catch {
      setError("Network error");
    } finally {
      setIsCreating(false);
    }
  };

  return { createPlace, isCreating, error };
};

export default useCreatePlace;
