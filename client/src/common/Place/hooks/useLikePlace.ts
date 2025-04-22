import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "../../../App.tsx";

interface LikePlacePayload {
  placeId: string;
  userId: number;
}

interface LikePlaceResponse {
  success: boolean;
}

const likePlaceRequest = async (
  payload: LikePlacePayload,
): Promise<LikePlaceResponse> => {
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

const useLikePlace = () => {
  const { mutateAsync, isPending, error } = useMutation<
    LikePlaceResponse,
    Error,
    LikePlacePayload
  >({
    mutationFn: likePlaceRequest,
  });

  return {
    likePlace: mutateAsync,
    isLikingPlace: isPending,
    likePlaceError: error,
  };
};

export default useLikePlace;
