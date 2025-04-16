import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "../../../../App.tsx";
import { User } from "../../../../models/User.ts";

interface AddMapPayload {
  userId: number;
  mapId: number;
}

type AddMapResponse = User;

const addMapRequest = async (
  payload: AddMapPayload,
): Promise<AddMapResponse> => {
  const { userId, mapId } = payload;

  const response = await fetch(`${BASE_URL}/users/${userId}/maps/${mapId}`, {
    method: "POST",
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to add map to user");
  }
  return data;
};

const useAddMapToUser = () => {
  const { mutateAsync, isPending, error } = useMutation<
    AddMapResponse,
    Error,
    AddMapPayload
  >({
    mutationFn: addMapRequest,
  });

  return {
    addMapToUser: mutateAsync,
    isAddingMapToUser: isPending,
    addMapToUserError: error,
  };
};

export default useAddMapToUser;
