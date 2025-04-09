import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "../../../App.tsx";
import { User } from "../../../models/User.ts";

interface AddPlaceToMapPayload {
  placeId: number;
  mapId: number;
}

type AddPlaceToMapResponse = User;

const addMapRequest = async (
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

const useAddMapToUser = () => {
  const { mutateAsync, isPending, error } = useMutation<
    AddPlaceToMapResponse,
    Error,
    AddPlaceToMapPayload
  >({
    mutationFn: addMapRequest,
  });

  return {
    addPlaceToMap: mutateAsync,
    isAddingPlaceToMap: isPending,
    addPlaceToMapError: error,
  };
};

export default useAddMapToUser;
