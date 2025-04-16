import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "../../../../App.tsx";
import { Map as MapType } from "../../../../models/Map.ts";

interface AddPlaceToMapPayload {
  mapId: number;
  placeId: string;
}

type AddPlaceToMapResponse = MapType;

const addPlaceToMapRequest = async (
  payload: AddPlaceToMapPayload,
): Promise<AddPlaceToMapResponse> => {
  const { mapId, placeId } = payload;

  const response = await fetch(`${BASE_URL}/maps/${mapId}/places/${placeId}`, {
    method: "POST",
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to add place to map");
  }
  return data;
};

const useAddPlaceToMap = () => {
  const { mutateAsync, isPending, error } = useMutation<
    AddPlaceToMapResponse,
    Error,
    AddPlaceToMapPayload
  >({
    mutationFn: addPlaceToMapRequest,
  });

  return {
    addPlaceToMap: mutateAsync,
    isAddingPlaceToMap: isPending,
    addPlaceToMapError: error,
  };
};

export default useAddPlaceToMap;
