import { useMutation } from "react-query";
import { BASE_URL } from "../App";

interface RemovePlacePayload {
  placeId: string;
  userId: number;
}

const removePlaceRequest = async (payload: RemovePlacePayload) => {
  const response = await fetch(`${BASE_URL}/users/removePlace`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to remove place");
  }
  return data;
};

const useRemovePlace = () => {
  return useMutation(removePlaceRequest);
};

export default useRemovePlace;
