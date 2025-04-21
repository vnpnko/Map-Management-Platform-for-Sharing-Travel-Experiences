import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "../../../App.tsx";
import { Map as MapType } from "../../../models/Map.ts";

interface RemovePlaceFromMapPayload {
  mapId: number;
  placeId: string;
}

type RemovePlaceFromMapResponse = MapType;

const removePlaceFromMapRequest = async (
  payload: RemovePlaceFromMapPayload,
): Promise<RemovePlaceFromMapResponse> => {
  const { mapId, placeId } = payload;

  const response = await fetch(`${BASE_URL}/maps/${mapId}/places/${placeId}`, {
    method: "DELETE",
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to remove place from map");
  }
  return data;
};

const useRemovePlaceFromMap = () => {
  const { mutateAsync, isPending, error } = useMutation<
    RemovePlaceFromMapResponse,
    Error,
    RemovePlaceFromMapPayload
  >({
    mutationFn: removePlaceFromMapRequest,
  });

  return {
    removePlaceFromMap: mutateAsync,
    isRemovingPlaceFromMap: isPending,
    removePlaceFromMapError: error,
  };
};

export default useRemovePlaceFromMap;
