import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "../../../App.tsx";

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
  const { placeId, userId } = payload;

  const response = await fetch(
    `${BASE_URL}/places/${placeId}/likes/${userId}`,
    {
      method: "POST",
    },
  );

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
