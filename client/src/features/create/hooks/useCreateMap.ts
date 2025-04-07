import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "../../../App.tsx";
import { Map } from "../../../models/Map.ts";

interface CreateMapPayload {
  name: string;
  description: string;
}

type CreateMapResponse = Map;

const createMapRequest = async (
  payload: CreateMapPayload,
): Promise<CreateMapResponse> => {
  const response = await fetch(`${BASE_URL}/createMap`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to create map");
  }
  return data;
};

const useCreateMap = () => {
  const { mutateAsync, isPending, error } = useMutation<
    CreateMapResponse,
    Error,
    CreateMapPayload
  >({
    mutationFn: createMapRequest,
  });

  return {
    createMap: mutateAsync,
    isCreatingMap: isPending,
    createMapError: error,
  };
};

export default useCreateMap;
