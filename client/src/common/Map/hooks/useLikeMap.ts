import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "../../../App.tsx";
import { Map } from "../../../models/Map.ts";

interface LikeMapPayload {
  mapId: number;
  userId: number;
}

type LikeMapResponse = Map;

const likeMapRequest = async (
  payload: LikeMapPayload,
): Promise<LikeMapResponse> => {
  const { mapId, userId } = payload;

  const response = await fetch(`${BASE_URL}/maps/${mapId}/likes/${userId}`, {
    method: "POST",
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to add like to map");
  }
  return data;
};

const useLikeMap = () => {
  const { mutateAsync, isPending, error } = useMutation<
    LikeMapResponse,
    Error,
    LikeMapPayload
  >({
    mutationFn: likeMapRequest,
  });

  return {
    likeMap: mutateAsync,
    isLikingMap: isPending,
    likeMapError: error,
  };
};

export default useLikeMap;
