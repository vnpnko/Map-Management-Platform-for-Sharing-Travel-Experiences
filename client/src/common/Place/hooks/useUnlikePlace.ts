import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "../../../App.tsx";

interface UnlikePlacePayload {
  placeId: string;
  userId: number;
}

interface UnlikePlaceResponse {
  success: boolean;
}

const unlikePlaceRequest = async (
  payload: UnlikePlacePayload,
): Promise<UnlikePlaceResponse> => {
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

const useUnlikePlace = () => {
  const { mutateAsync, isPending, error } = useMutation<
    UnlikePlaceResponse,
    Error,
    UnlikePlacePayload
  >({
    mutationFn: unlikePlaceRequest,
  });

  return {
    unlikePlace: mutateAsync,
    isUnlikingPlace: isPending,
    unlikePlaceError: error,
  };
};

export default useUnlikePlace;
