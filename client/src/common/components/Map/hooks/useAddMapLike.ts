import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "../../../../App.tsx";
import { Map } from "../../../../models/Map.ts";

interface AddMapLikePayload {
  mapId: number;
  userId: number;
}

type AddMapLikeResponse = Map;

const addMapLikeRequest = async (
  payload: AddMapLikePayload,
): Promise<AddMapLikeResponse> => {
  const response = await fetch(`${BASE_URL}/maps/addMapLike`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to add like to map");
  }
  return data;
};

const useAddMapLike = () => {
  const { mutateAsync, isPending, error } = useMutation<
    AddMapLikeResponse,
    Error,
    AddMapLikePayload
  >({
    mutationFn: addMapLikeRequest,
  });

  return {
    addMapLike: mutateAsync,
    isAddingMapLike: isPending,
    addMapLikeError: error,
  };
};

export default useAddMapLike;
