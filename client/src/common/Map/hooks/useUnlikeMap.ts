import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "../../../App.tsx";
import { Map } from "../../../models/Map.ts";

interface UnlikeMapPayload {
  mapId: number;
  userId: number;
}

type UnlikeMapResponse = Map;

const unlikeMapRequest = async (
  payload: UnlikeMapPayload,
): Promise<UnlikeMapResponse> => {
  const { mapId, userId } = payload;

  const response = await fetch(`${BASE_URL}/maps/${mapId}/likes/${userId}`, {
    method: "DELETE",
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to remove like from map");
  }
  return data;
};

const useUnlikeMap = () => {
  const { mutateAsync, isPending, error } = useMutation<
    UnlikeMapResponse,
    Error,
    UnlikeMapPayload
  >({
    mutationFn: unlikeMapRequest,
  });

  return {
    unlikeMap: mutateAsync,
    isUnlikingMap: isPending,
    unlikeMapError: error,
  };
};

export default useUnlikeMap;
