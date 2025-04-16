import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "../../../../App.tsx";
import { Map } from "../../../../models/Map.ts";

interface RemoveMapLikePayload {
  mapId: number;
  userId: number;
}

type RemoveMapLikeResponse = Map;

const removeMapLikeRequest = async (
  payload: RemoveMapLikePayload,
): Promise<RemoveMapLikeResponse> => {
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

const useRemoveMapLike = () => {
  const { mutateAsync, isPending, error } = useMutation<
    RemoveMapLikeResponse,
    Error,
    RemoveMapLikePayload
  >({
    mutationFn: removeMapLikeRequest,
  });

  return {
    removeMapLike: mutateAsync,
    isRemovingMapLike: isPending,
    removeMapLikeError: error,
  };
};

export default useRemoveMapLike;
