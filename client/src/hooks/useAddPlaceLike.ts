import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "../App";

interface AddPlaceLikePayload {
  placeId: string;
  userId: number;
}

interface AddPlaceLikeResponse {
  success: boolean;
}

const addPlaceLikeRequest = async (
  payload: AddPlaceLikePayload,
): Promise<AddPlaceLikeResponse> => {
  const response = await fetch(`${BASE_URL}/places/addPlaceLike`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to add like to place");
  }
  return data;
};

const useAddPlaceLike = () => {
  const { mutateAsync, isPending, error } = useMutation<
    AddPlaceLikeResponse,
    Error,
    AddPlaceLikePayload
  >({
    mutationFn: addPlaceLikeRequest,
  });

  return {
    addPlaceLike: mutateAsync,
    isAddingPlaceLike: isPending,
    addPlaceLikeError: error,
  };
};

export default useAddPlaceLike;
