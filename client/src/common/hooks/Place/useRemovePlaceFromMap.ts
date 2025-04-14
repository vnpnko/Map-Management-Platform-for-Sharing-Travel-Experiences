import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "../../../App.tsx";

interface RemovePlaceFromMapPayload {
  placeId: string;
  mapId: number;
}

interface RemovePlaceFromMapResponse {
  success: boolean;
}

const removePlaceFromMapRequest = async (
  payload: RemovePlaceFromMapPayload,
): Promise<RemovePlaceFromMapResponse> => {
  const response = await fetch(`${BASE_URL}/maps/removePlace`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to remove place from map");
  }
  return data;
};

const useAddPlaceToMap = () => {
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

export default useAddPlaceToMap;
