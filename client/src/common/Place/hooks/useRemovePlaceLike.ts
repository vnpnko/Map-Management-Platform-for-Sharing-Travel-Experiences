import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "../../../App.tsx";

interface RemovePlaceLikePayload {
  placeId: string;
  userId: number;
}

interface RemovePlaceLikeResponse {
  success: boolean;
}

const removePlaceLikeRequest = async (
  payload: RemovePlaceLikePayload,
): Promise<RemovePlaceLikeResponse> => {
  const { placeId, userId } = payload;

  const response = await fetch(
    `${BASE_URL}/places/${placeId}/likes/${userId}`,
    { method: "DELETE" },
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to remove like from place");
  }
  return data;
};

const useRemovePlaceLike = () => {
  const { mutateAsync, isPending, error } = useMutation<
    RemovePlaceLikeResponse,
    Error,
    RemovePlaceLikePayload
  >({
    mutationFn: removePlaceLikeRequest,
  });

  return {
    removePlaceLike: mutateAsync,
    isRemovingPlaceLike: isPending,
    removePlaceLikeError: error,
  };
};

export default useRemovePlaceLike;
