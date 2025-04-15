import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "../../../../App.tsx";

interface AddPlaceToMapPayload {
  placeId: string;
  mapId: number;
}

interface AddPlaceToMapResponse {
  success: boolean;
}

const addPlaceToMapRequest = async (
  payload: AddPlaceToMapPayload,
): Promise<AddPlaceToMapResponse> => {
  const response = await fetch(`${BASE_URL}/maps/addPlace`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
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
