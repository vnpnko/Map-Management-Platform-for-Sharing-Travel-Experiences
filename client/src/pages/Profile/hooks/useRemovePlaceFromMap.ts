import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "../../../App.tsx";
import { User } from "../../../models/User.ts";

interface RemovePlaceToMapPayload {
  placeId: number;
  mapId: number;
}

type RemovePlaceFromMapResponse = User;

const addMapRequest = async (
  payload: RemovePlaceToMapPayload,
): Promise<RemovePlaceFromMapResponse> => {
  const response = await fetch(`${BASE_URL}/maps/removePlace`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to remove place to map");
  }
  return data;
};

const useAddMapToUser = () => {
  const { mutateAsync, isPending, error } = useMutation<
    RemovePlaceFromMapResponse,
    Error,
    RemovePlaceToMapPayload
  >({
    mutationFn: addMapRequest,
  });

  return {
    removePlaceFromMap: mutateAsync,
    isRemovingPlaceFromMap: isPending,
    removePlaceFromMapError: error,
  };
};

export default useAddMapToUser;
